"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import IndustryLayout from '../../../IndustryLayout'; 

interface Internship {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface InternshipForm {
  title: string;
  description: string;
  numberOfStudents: number;
  locationType: 'onsite' | 'oncampus';
  compensationType: 'paid' | 'unpaid';
  compensationAmount?: number;
  supervisorName: string;
  supervisorEmail: string;
  startDate: string;
  endDate: string;
  universityId: string;
}

const Internship = () => {
  const params = useParams();
  const universityId = params?.slug as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [formData, setFormData] = useState<InternshipForm>(() => ({
    title: '',
    description: '',
    numberOfStudents: 1,
    locationType: 'onsite',
    compensationType: 'paid',
    compensationAmount: 0,
    supervisorName: '',
    supervisorEmail: '',
    startDate: '',
    endDate: '',
    universityId: universityId,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/internship?universityId=${universityId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch internships');
      }
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (universityId) {
      fetchInternships();
    }
  }, [universityId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/internship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numberOfStudents: Number(formData.numberOfStudents),
          compensationAmount: formData.compensationType === 'paid' 
            ? Number(formData.compensationAmount) 
            : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create internship');
      }

      const newInternship = await res.json();
      setInternships((prev) => [newInternship, ...prev]);

      // Reset form
      setFormData({
        title: '',
        description: '',
        numberOfStudents: 1,
        locationType: 'onsite',
        compensationType: 'paid',
        compensationAmount: 0,
        supervisorName: '',
        supervisorEmail: '',
        startDate: '',
        endDate: '',
        universityId: universityId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create internship');
      console.error('Error creating internship:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <IndustryLayout>
      <h1 className="text-2xl font-bold mb-6">Create New Internship Opportunity</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Form Fields */}
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>
        {/* Other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Students */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Number of Students <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfStudents"
              value={formData.numberOfStudents}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Location Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Location Type <span className="text-red-500">*</span>
            </label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="onsite">On-site</option>
              <option value="oncampus">On-campus</option>
            </select>
          </div>
          {/* Compensation Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Compensation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="compensationType"
              value={formData.compensationType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {formData.compensationType === 'paid' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Compensation Amount
              </label>
              <input
                type="number"
                name="compensationAmount"
                value={formData.compensationAmount}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Supervisor Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Supervisor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Supervisor Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="supervisorEmail"
              value={formData.supervisorEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Internship'}
        </button>
      </form>

      {/* Internships List */}
      <h2 className="text-xl font-bold mt-8 mb-4">Internship Opportunities</h2>
      {loading && !internships.length ? (
        <p className="text-gray-600">Loading internships...</p>
      ) : internships.length === 0 ? (
        <p className="text-gray-600">No internships available.</p>
      ) : (
        <ul className="space-y-4">
          {internships.map((internship) => (
            <li key={internship._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg">{internship.title}</h3>
              <p className="text-gray-600">{internship.description}</p>
              <p className="text-sm text-gray-500">
                Start: {new Date(internship.startDate).toLocaleDateString()} | End:{' '}
                {new Date(internship.endDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      </IndustryLayout>
    </div>
  );
};

export default Internship;