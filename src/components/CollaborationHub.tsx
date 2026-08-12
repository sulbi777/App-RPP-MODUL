import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Plus, 
  Tag, 
  BookOpen, 
  Sparkles,
  Share2
} from 'lucide-react';
import { MgmpForumPost, UserProfile } from '../types';

interface CollaborationHubProps {
  posts: MgmpForumPost[];
  onAddPost: (post: MgmpForumPost) => void;
  currentUser: UserProfile;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  posts,
  onAddPost,
  currentUser,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('InovasiPembelajaran');
  const [likeCounts, setLikeCounts] = useState<{ [id: string]: number }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: MgmpForumPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser.nama,
      authorSubject: currentUser.mataPelajaran,
      title: newTitle,
      content: newContent,
      timestamp: 'Baru saja',
      likes: 0,
      commentsCount: 0,
      tags: [currentUser.mataPelajaran, newTag]
    };

    onAddPost(post);
    setNewTitle('');
    setNewContent('');
  };

  const handleLike = (id: string, initialLikes: number) => {
    setLikeCounts(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Forum Kolaborasi MGMP SMAN 106 Jakarta
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ruang diskusi antar guru mata pelajaran untuk berbagi best practice, ide diferensiasi, & proyek kolaborasi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Create Post Form (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Bagikan Ide / Diskusi Baru
          </h3>

          <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Judul Topik / Praktik Baik:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Penggunaan Geogebra di Kelas X..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Deskripsi Diskusi:</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Jelaskan gagasan, kendala, atau penemuan metode baru..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Tag Kategori:</label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="InovasiPembelajaran">Inovasi Pembelajaran</option>
                <option value="Diferensiasi">Strategi Diferensiasi</option>
                <option value="AsesmenFormatif">Asesmen & KKTP</option>
                <option value="ProyekP5">Proyek P5 & Lintas Mapel</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Diskusi MGMP</span>
            </button>
          </form>
        </div>

        {/* Right Side Posts Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {post.authorName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      MGMP {post.authorSubject} • {post.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-200 dark:border-blue-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {post.title}
              </h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={() => handleLike(post.id, post.likes)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>{likeCounts[post.id] ?? post.likes} Suka</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {post.commentsCount} Komentar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
