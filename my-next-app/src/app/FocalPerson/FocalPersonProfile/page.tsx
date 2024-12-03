"use client";

import { useEffect, useState } from "react";
import FocalPersonLayout from "../FocalPersonLayout";
interface Department {
    _id: string;
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
  }
  

const VocalPerson: React.FC = () => {
  const [profile, setProfile] = useState<Department | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const email = localStorage?.getItem("email");
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
        const response = await fetch("/api/department/674179f1d751474776dc5bd5");
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

    const { focalPersonName, focalPersonEmail, focalPersonCnic,focalPersonHonorific,focalPersonPhone,name } = profile;

    if (!name || name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return false;
    }
    if (!focalPersonName || !/^\d{10,15}$/.test(focalPersonName)) {
      setError("focalPersonName must be between 10 and 15 digits.");
      return false;
    }
  
    if (!focalPersonCnic || !/^\d{10,15}$/.test(focalPersonCnic)) {
        setError("focalPersonCnic must be between 10 and 15 digits.");
        return false;
      }
      if (!focalPersonHonorific || focalPersonHonorific.trim().length < 3) {
        setError("focalPersonHonorific must be at least 3 characters long.");
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
      const { email, cnic, ...profileToUpdate } = profile;

      const response = await fetch("/api/vocalPersonProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cnic, ...profileToUpdate }),
      });

      if (response.ok) {
        await fetchProfile(email); // Refresh profile
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
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Focal Person Profile</h2>
      {profile ? (
        <>
          <p><strong>Name:</strong> {profile.focalPersonHonorific}{profile.focalPersonName}</p>
          <p><strong>Email:</strong> {profile.focalPersonEmail}</p>
          <p><strong>Phone:</strong> {profile.focalPersonPhone}</p>
          <p><strong>CNIC:</strong> {profile.focalPersonCnic}</p>
          <p><strong>Department:</strong> {profile.name}</p>
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
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <input
        type="text"
        placeholder="focalPersonName"
        value={profile?.focalPersonName || ""}
        onChange={(e) => handleChange("focalPersonName", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={profile?.focalPersonEmail || ""}
        readOnly
        className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
      />
       <input
        type="text"
        placeholder="focalPersonCnic"
        value={profile?.focalPersonCnic || ""}
        readOnly
        className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
      />
      <input
        type="text"
        placeholder="focalPersonPhone"
        value={profile?.focalPersonPhone || ""}
        onChange={(e) => handleChange("focalPersonPhone", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="name"
        value={profile?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
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
    <FocalPersonLayout>
    <div className="max-w-3xl mx-auto p-6">
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : editMode ? renderForm() : renderDisplay()}
    </div>
    </FocalPersonLayout>
  );
};

export default VocalPerson;
