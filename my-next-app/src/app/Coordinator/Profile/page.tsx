  "use client";
  import { useEffect, useState } from "react";
  import CoordinatorLayout from './../CoordinatorLayout';

  interface Department {
    id: string;
    name: string;
    startDate: string;
    category: string;
    hodName: string;
    honorific: string;
    cnic: string;
    email: string;
    phone: string;
    landLine?: string;
    focalPersonName: '',
    focalPersonHonorific: 'Mr.',
    focalPersonCnic: '',
    focalPersonEmail: '',
    focalPersonPhone: '',
    CoordinatorName: string,
    CoordinatorHonorific: 'Mr.',
    CoordinatorCnic: '',
    CoordinatorEmail: '',
    CoordinatorPhone: '',

  }

  const VocalPerson: React.FC = () => {
    const [profile, setProfile] = useState<Department | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
      try {
        const email = 'wajahat1@gmail.com'
        // localStorage?.getItem("email");
        if (email) {
          fetchProfile(email);
        } else {
          setError("Email not found in localStorage.");
          setLoading(false);
        }
      } catch {
        setError("LocalStorage access is not available.");
        setLoading(false);
      }
    }, []);

    const fetchProfile = async (email: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await fetch(`/api/ProfileForCoordinator?CoordinatorEmail=${email}`);
        if (response.ok) {
          const data: Department = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch profile.");
        }
      } catch {
        setError("Network error: Unable to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (field: keyof Department, value: string) => {
      if (profile) {
        setProfile({ ...profile, [field]: value });
      }
    };

    const validateInputs = (): boolean => {
      if (!profile) return false;

      const { CoordinatorName, CoordinatorPhone } = profile;

      if (!CoordinatorName || CoordinatorName.trim().length < 2) {
        setError("Name must be at least 2 characters long.");
        return false;
      }
      if (!CoordinatorPhone || !/^\d{10,15}$/.test(CoordinatorPhone)) {
        setError("Phone number must be between 10 and 15 digits.");
        return false;
      }
      
      setError(null);
      return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!profile || !validateInputs()) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const { CoordinatorEmail, CoordinatorCnic, ...profileToUpdate } = profile;

        const response = await fetch("/api/ProfileForCoordinator", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CoordinatorEmail, CoordinatorCnic, ...profileToUpdate }),
        });

        if (response.ok) {
          await fetchProfile(CoordinatorEmail); // Refresh profile
          setSuccess("Profile updated successfully.");
          setEditMode(false);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to update profile.");
        }
      } catch {
        setError("Network error: Unable to update profile.");
      } finally {
        setLoading(false);
      }
    };

    const renderDisplay = () => (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Coordinator Profile</h2>
        {profile ? (
          <>
            <p><strong>Name:</strong> {profile.CoordinatorName}</p>
            <p><strong>Email:</strong> {profile.CoordinatorEmail}</p>
            <p><strong>CNIC:</strong> {profile.CoordinatorCnic}</p>
            <p><strong>Phone:</strong> {profile.CoordinatorPhone}</p>
            <p><strong>Department :</strong> {profile.name}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <p>No profile found.</p>
        )}
      </div>
    );

    const renderForm = () => (
      <form onSubmit={handleSubmit} className="p-6 bg-gray-50 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Edit Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <input
          type="text"
          placeholder="CoordinatorName"
          value={profile?.CoordinatorName || ""}
          onChange={(e) => handleChange("CoordinatorName", e.target.value)}
          className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="CoordinatorEmail"
          value={profile?.CoordinatorEmail || ""}
          readOnly
          className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="CoordinatorCnic"
          value={profile?.CoordinatorCnic || ""}
          readOnly
          className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
        />
         <input
          type="text"
          placeholder="CoordinatorPhone"
          value={profile?.CoordinatorPhone || ""}
          onChange={(e) => handleChange("CoordinatorPhone", e.target.value)}
          className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Department Name"
          value={profile?.name || ""}
          readOnly
          className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <button
          type="submit"
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          Save Profile
        </button>
      </form>
    );

    return (
      <CoordinatorLayout>
      <div className="max-w-3xl mx-auto p-6">
        {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : editMode ? renderForm() : renderDisplay()}
      </div>
      </CoordinatorLayout>
    );
  };

  export default VocalPerson; 
