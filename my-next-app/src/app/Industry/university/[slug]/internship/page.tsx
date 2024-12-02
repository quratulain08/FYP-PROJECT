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
  category: string;
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
  category: string;
}


const Internship = () => {
  const params = useParams();
  const universityId = params?.slug as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    category: 'frontend',
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
        category: 'frontend',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create internship');
      console.error('Error creating internship:', err);
    } finally {
      setLoading(false);
    }
  };

  const internshipCategories = [
    // Technology
    { value: 'frontend', label: 'Frontend Development', group: 'Technology' },
    { value: 'backend', label: 'Backend Development', group: 'Technology' },
    { value: 'fullstack', label: 'Full Stack Development', group: 'Technology' },
    { value: 'mobile', label: 'Mobile Development', group: 'Technology' },
    { value: 'devops', label: 'DevOps', group: 'Technology' },
    { value: 'data', label: 'Data Science', group: 'Technology' },
    { value: 'ai', label: 'Artificial Intelligence', group: 'Technology' },
    { value: 'cybersecurity', label: 'Cybersecurity', group: 'Technology' },
    { value: 'cloud', label: 'Cloud Computing', group: 'Technology' },
    { value: 'qa', label: 'Quality Assurance', group: 'Technology' },

    // Business & Finance
    { value: 'accounting', label: 'Accounting', group: 'Business & Finance' },
    { value: 'finance', label: 'Finance', group: 'Business & Finance' },
    { value: 'marketing', label: 'Marketing', group: 'Business & Finance' },
    { value: 'sales', label: 'Sales', group: 'Business & Finance' },
    { value: 'hr', label: 'Human Resources', group: 'Business & Finance' },
    { value: 'consulting', label: 'Business Consulting', group: 'Business & Finance' },

    // Engineering
    { value: 'mechanical', label: 'Mechanical Engineering', group: 'Engineering' },
    { value: 'electrical', label: 'Electrical Engineering', group: 'Engineering' },
    { value: 'civil', label: 'Civil Engineering', group: 'Engineering' },
    { value: 'chemical', label: 'Chemical Engineering', group: 'Engineering' },
    { value: 'aerospace', label: 'Aerospace Engineering', group: 'Engineering' },

    // Healthcare
    { value: 'medical', label: 'Medical', group: 'Healthcare' },
    { value: 'nursing', label: 'Nursing', group: 'Healthcare' },
    { value: 'pharmacy', label: 'Pharmacy', group: 'Healthcare' },
    { value: 'biotech', label: 'Biotechnology', group: 'Healthcare' },

    // Creative
    { value: 'design', label: 'Graphic Design', group: 'Creative' },
    { value: 'content', label: 'Content Writing', group: 'Creative' },
    { value: 'media', label: 'Digital Media', group: 'Creative' },
    { value: 'ui_ux', label: 'UI/UX Design', group: 'Creative' },

    // Science & Research
    { value: 'research', label: 'Research & Development', group: 'Science & Research' },
    { value: 'physics', label: 'Physics', group: 'Science & Research' },
    { value: 'chemistry', label: 'Chemistry', group: 'Science & Research' },
    { value: 'biology', label: 'Biology', group: 'Science & Research' },

    // Law & Public Policy
    { value: 'legal', label: 'Legal', group: 'Law & Public Policy' },
    { value: 'public_policy', label: 'Public Policy', group: 'Law & Public Policy' },
    { value: 'government', label: 'Government', group: 'Law & Public Policy' },

    // Education
    { value: 'teaching', label: 'Teaching', group: 'Education' },
    { value: 'training', label: 'Corporate Training', group: 'Education' },
    { value: 'education_tech', label: 'Education Technology', group: 'Education' },

    // Others
    { value: 'other', label: 'Other', group: 'Others' },
  ];

  const filteredInternships = selectedCategory
    ? internships.filter(internship => internship.category === selectedCategory)
    : internships;

  return (
    <div className="container mx-auto px-4 py-8">
      <IndustryLayout>
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Manage Internships
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className="bg-white shadow-md border border-green-500 rounded-lg p-6 mb-8 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Add a New Internship
          </h2>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Internship Title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 h-32"
                placeholder="Internship Description"
                required
              />
            </div>

            {/* Two column layout for smaller inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Students */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Number of Students <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="numberOfStudents"
                  value={formData.numberOfStudents}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="onsite">On-site</option>
                  <option value="oncampus">On-campus</option>
                </select>
              </div>

              {/* Compensation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Compensation Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="compensationType"
                  value={formData.compensationType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {/* Conditional Compensation Amount */}
              {formData.compensationType === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Compensation Amount
                  </label>
                  <input
                    type="number"
                    name="compensationAmount"
                    value={formData.compensationAmount}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              )}

              {/* Date Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Supervisor Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Supervisor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Supervisor Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Supervisor Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="supervisorEmail"
                  value={formData.supervisorEmail}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="supervisor@example.com"
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                >
                  {internshipCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
          >
            {loading ? 'Adding...' : 'Add Internship'}
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4 text-green-600">Internships</h2>
        {loading && !internships.length ? (
          <div className="text-gray-600">Loading internships...</div>
        ) : internships.length === 0 ? (
          <div className="text-gray-600">No internships found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white shadow-lg border border-green-500 rounded-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold text-lg text-green-600 mb-2">
                  {internship.title}
                </h3>
                <p className="text-gray-600 mb-2">{internship.description}</p>
                <p className="text-gray-600 mb-1">
                  <strong>Duration:</strong>{' '}
                  {new Date(internship.startDate).toLocaleDateString()} -{' '}
                  {new Date(internship.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Category:</strong> {
                    internshipCategories.find(cat => cat.value === internship.category)?.label
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </IndustryLayout>
    </div>
  );
};

export default Internship;