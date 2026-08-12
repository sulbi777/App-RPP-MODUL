// Google Drive and Application Backup Utilities for SMAN 106 Jakarta

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  error?: string;
}

// Function to dynamically load GIS script if not present
export function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('gsi-client-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error('Gagal memuat Google Accounts SDK.'));
    document.head.appendChild(script);
  });
}

/**
 * Uploads a string or Blob content directly to Google Drive using Google Drive v3 REST API
 */
export async function uploadToGoogleDrive({
  fileName,
  content,
  mimeType = 'text/html',
  accessToken,
}: {
  fileName: string;
  content: string | Blob;
  mimeType?: string;
  accessToken: string;
}): Promise<DriveUploadResult> {
  try {
    const metadata = {
      name: fileName,
      mimeType: mimeType,
      description: 'Disimpan otomatis dari SMAN 106 Jakarta Generator & Canvas Modul Ajar',
    };

    const formData = new FormData();
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );

    const fileBlob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    formData.append('file', fileBlob);

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Drive API error (${response.status})`);
    }

    const result = await response.json();
    return {
      success: true,
      fileId: result.id,
      webViewLink: result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`,
    };
  } catch (err: any) {
    console.error('Upload to Drive failed:', err);
    return {
      success: false,
      error: err.message || 'Terjadi kesalahan saat mengunggah ke Google Drive.',
    };
  }
}

/**
 * Request an Access Token via Google OAuth2 Token Client
 */
export async function requestGoogleAccessToken(): Promise<string> {
  await loadGsiScript();

  return new Promise((resolve, reject) => {
    const googleObj = (window as any).google;
    if (!googleObj || !googleObj.accounts || !googleObj.accounts.oauth2) {
      reject(new Error('Google Identity Services client tidak tersedia.'));
      return;
    }

    // Try using VITE_GOOGLE_CLIENT_ID if present or prompt
    const clientId = ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) || '';

    const tokenClient = googleObj.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
        } else if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error('Token akses tidak diterima.'));
        }
      },
      onerror: (err: any) => reject(err),
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * Export full Application state into downloadable JSON & store to localStorage
 */
export function exportApplicationBackup(allData: any) {
  const dataStr = JSON.stringify(
    {
      app: 'SMAN 106 Jakarta Modul Ajar Portal',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      data: allData,
    },
    null,
    2
  );

  // Save to localStorage
  try {
    localStorage.setItem('sman106_app_backup', dataStr);
  } catch (e) {
    console.warn('LocalStorage full, downloading backup file instead.');
  }

  // Trigger File Download
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Cadangan_Aplikasi_SMAN106_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
