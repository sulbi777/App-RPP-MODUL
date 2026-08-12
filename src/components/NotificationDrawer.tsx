import React from 'react';
import { Bell, X, CheckCircle2, MessageSquare, ShieldCheck, CloudCheck, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Notifikasi Real-time SMAN 106
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-xs text-slate-500">{notifications.length} Notifikasi</span>
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Tandai Semua Dibaca
            </button>
          </div>

          {/* List of Notifications */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition ${
                  notif.read
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-blue-50/60 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'approval' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {notif.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-500" />}
                    {notif.type === 'sync' && <CloudCheck className="w-4 h-4 text-amber-500" />}
                    {notif.type === 'system' && <ShieldCheck className="w-4 h-4 text-purple-500" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">{notif.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400">
            Terhubung ke Sistem Notifikasi Push Real-time SMAN 106 Jakarta
          </p>
        </div>
      </div>
    </div>
  );
};
