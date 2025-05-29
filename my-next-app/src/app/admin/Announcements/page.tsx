'use client';

import { useEffect, useState } from 'react';
import Layout from "@/app/components/Layout";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  expiresAt?: string | null;
  isActive: boolean;
}

export default function AnnouncementPage() {
  const [form, setForm] = useState({ title: '', content: '', expiresAt: '' });
  const [active, setActive] = useState<Announcement[]>([]);
  const [expired, setExpired] = useState<Announcement[]>([]);
  const [showExpired, setShowExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [universityId, setUniversityId] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);

    const email = localStorage.getItem("email");
    const resp = await fetch(`/api/UniversityByEmailAdmin/${email}`);
    if (!resp.ok) {
      throw new Error(`Failed to fetch university ID for ${email}`);
    }

    const dataa = await resp.json();
    const id = dataa.universityId;
    setUniversityId(id);

    const res = await fetch(`/api/Announcements/${id}`);
    const data: Announcement[] = await res.json();
    const now = new Date();

    const active = data.filter(
      (a) => a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now)
    );
    const expired = data.filter(
      (a) => !a.isActive || (a.expiresAt && new Date(a.expiresAt) <= now)
    );

    setActive(active);
    setExpired(expired);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/Announcements/${universityId}`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setForm({ title: '', content: '', expiresAt: '' });
      fetchAnnouncements();
    }
  };

  // Helper to get initials for announcement circle, fallback to "AN"
  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AN';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-10">
  {/* Create Announcement Form Card */}
  <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Announcement</h1>
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter announcement title"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          placeholder="Enter announcement content"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
      </div>
      
      <div>
        <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date & Time
        </label>
        <input
          id="expiresAt"
          type="datetime-local"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
      >
        Create
      </button>
    </form>
  </div>


        {/* Announcements List */}
        <div className="space-y-8">
          {/* Active Announcements */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
              Active Announcements
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : active.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {active.map((a) => (
                  <div key={a._id} className="bg-green-50 border border-green-300 rounded-lg p-6 shadow-sm flex space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(a.title)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 text-lg">{a.title}</h3>
                      <p className="text-green-700 mb-2">{a.content}</p>
                      {a.expiresAt && (
                        <small className="text-green-600">
                          Expires: {new Date(a.expiresAt).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No active announcements</p>
            )}
          </div>

          {/* Toggle expired */}
          <button
            className="text-green-600 underline text-center block mx-auto"
            onClick={() => setShowExpired(!showExpired)}
          >
            {showExpired ? 'Hide' : 'Show'} Expired Announcements
          </button>

          {/* Expired Announcements */}
          {showExpired && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Expired Announcements
              </h2>
              {expired.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {expired.map((a) => (
                    <div key={a._id} className="bg-red-50 border border-red-300 rounded-lg p-6 shadow-sm flex space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(a.title)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800 text-lg">{a.title}</h3>
                        <p className="text-red-700 mb-2">{a.content}</p>
                        {a.expiresAt && (
                          <small className="text-red-600">
                            Expired: {new Date(a.expiresAt).toLocaleString()}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No expired announcements</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
