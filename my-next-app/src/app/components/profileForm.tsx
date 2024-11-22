"use client";

import { useEffect, useState } from "react";

interface VocalPersonData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  designation: string;
}

const VocalPerson: React.FC = () => {
  const [profile, setProfile] = useState<VocalPersonData | null>(null);
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
      const response = await fetch(`/api/vocalPersonProfile?email=${email}`);
      if (response.ok) {
        const data: VocalPersonData = await response.json();
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

  const handleChange = (field: keyof VocalPersonData, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const validateInputs = (): boolean => {
    if (!profile) return false;

    const { name, phone, designation } = profile;

    if (!name || name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return false;
    }
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      setError("Phone number must be between 10 and 15 digits.");
      return false;
    }
    if (!designation || designation.trim().length < 3) {
      setError("Designation must be at least 3 characters long.");
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
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Vocal Person Profile</h2>
      {profile ? (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>CNIC:</strong> {profile.cnic}</p>
          <p><strong>Designation:</strong> {profile.designation}</p>
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
        placeholder="Name"
        value={profile?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={profile?.email || ""}
        readOnly
        className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
      />
       <input
        type="text"
        placeholder="cnic"
        value={profile?.cnic || ""}
        readOnly
        className="w-full p-3 border mb-3 rounded-lg bg-gray-200 cursor-not-allowed"
      />
      <input
        type="text"
        placeholder="Phone"
        value={profile?.phone || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Designation"
        value={profile?.designation || ""}
        onChange={(e) => handleChange("designation", e.target.value)}
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
    <div className="max-w-3xl mx-auto p-6">
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : editMode ? renderForm() : renderDisplay()}
    </div>
  );
};

export default VocalPerson;
