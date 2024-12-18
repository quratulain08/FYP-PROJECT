'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IndustryLayout from '../IndustryLayout';

interface University {
  _id: string;
  name: string;
  address: string;
  contactEmail: string;
  location: string;
}

const UniversityPage = () => {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/universities');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUniversities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !contactEmail || !location) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError(null);

   
    
    const newUniversity = { name, address, contactEmail, location };
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUniversity),
      });
      if (!res.ok) throw new Error(await res.text());
      setName('');
      setAddress('');
      setContactEmail('');
      setLocation('');
      await fetchUniversities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add university');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <IndustryLayout>
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Manage Universities
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md border border-green-500 rounded-lg p-6 mb-8 max-w-xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Add a New University
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="University Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="University Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="university@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="University Location"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add University'}
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4 text-green-600">Universities</h2>
        {loading && !universities.length ? (
          <div className="text-gray-600">Loading universities...</div>
        ) : universities.length === 0 ? (
          <div className="text-gray-600">No universities found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <div
              key={university._id}
              onClick={() => {
                const path = `/Industry/university/${university._id}/internship`;
                console.log('Navigating to:', path);
                router.push(path);}}
                className="bg-white shadow-lg border border-green-500 rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <h3 className="font-semibold text-lg text-green-600 mb-2">
                  {university.name}
                </h3>
                <p className="text-gray-600 mb-1">
              <strong>Address:</strong> {university.address || 'Not provided'}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Location:</strong> {university.location || 'Not provided'}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong> {university.contactEmail || 'Not provided'}
                </p>
              </div>
            ))}
          </div>
        )}
      </IndustryLayout>
    </div>
  );
};

export default UniversityPage;





{/*key={university._id}
onClick={() => {
  const path = `/Industry/university/${university._id}/internship`;
  console.log('Navigating to:', path);
  router.push(path);
}}*/}