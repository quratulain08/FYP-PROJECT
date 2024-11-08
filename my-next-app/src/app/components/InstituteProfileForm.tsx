"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  role: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  department?: string;
  designation?: string;
  officeLocation?: string;
  tenureStart?: string;
  tenureEnd?: string;
}

const InstituteProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<Record<string, ProfileData>>({});
  const [editMode, setEditMode] = useState<Record<string, boolean>>({
    dean: false,
    vc: false,
    chairman: false,
    deputy: false,
  });
  const [newProfile, setNewProfile] = useState<ProfileData>({
    role: "",
    name: "",
    email: "",
    phone: "",
    cnic: "",
    department: "",
    designation: "",
    officeLocation: "",
    tenureStart: "",
    tenureEnd: "",
  });
  
  const [addingRole, setAddingRole] = useState<string | null>(null);

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/instituteProfile");
        const data = await response.json();
        const formattedData = data.reduce((acc: Record<string, ProfileData>, profile: ProfileData) => {
          acc[profile.role] = profile;
          return acc;
        }, {});
        setProfileData(formattedData);
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleChange = (role: string, field: keyof ProfileData, value: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      [role]: { ...prevData[role], [field]: value },
    }));
  };

  const handleNewProfileChange = (field: keyof ProfileData, value: string) => {
    setNewProfile((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/instituteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData[role]),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const result = await response.json();
      console.log(`${role} Profile Data saved:`, result);
      setEditMode((prev) => ({ ...prev, [role]: false }));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAddProfile = async (role: string) => {
    try {
      const response = await fetch("/api/instituteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to add profile');
      }

      const result = await response.json();
      console.log("New Profile Data saved:", result);
      setProfileData((prevData) => ({
        ...prevData,
        [role]: newProfile,
      }));
      setNewProfile({
        role: "",
        name: "",
        email: "",
        phone: "",
        cnic: "",
        department: "",
        designation: "",
        officeLocation: "",
        tenureStart: "",
        tenureEnd: "",
      });
      setAddingRole(null);
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  };

  const handleDelete = async (role: string) => {
    try {
      const response = await fetch("/api/instituteProfile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      const result = await response.json();
      console.log(result.message);
      setProfileData((prevData) => {
        const newData = { ...prevData };
        delete newData[role];
        return newData;
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const renderDisplay = (role: string, title: string) => {
    const profile = profileData[role];
  
    return (
      <div className="p-6 bg-gray-100 shadow-md rounded-lg border">
        <h2 className="text-center text-xl font-bold text-green-600 mb-4">
          {title}
        </h2>
        {profile ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>CNIC:</strong> {profile.cnic}</p>
            {profile.department && (
              <p><strong>Department:</strong> {profile.department}</p>
            )}
            {profile.officeLocation && (
              <p><strong>Office Location:</strong> {profile.officeLocation}</p>
            )}
            {profile.tenureStart && (
              <p><strong>Tenure Start:</strong> {profile.tenureStart}</p>
            )}
            {profile.tenureEnd && (
              <p><strong>Tenure End:</strong> {profile.tenureEnd}</p>
            )}
            <button
              onClick={() => setEditMode((prev) => ({ ...prev, [role]: true }))}
              className="mt-4 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
            >
              Edit {title}
            </button>
            <button
              onClick={() => handleDelete(role)}
              className="mt-2 w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
            >
              Delete {title}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No data available for this role.</p>
        )}
      </div>
    );
  };
  
  const renderForm = (role: string, title: string) => (
    <div className="p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-center text-xl font-bold text-green-600 mb-4">
        Edit {title}
      </h2>
      <form onSubmit={(e) => handleSubmit(e, role)} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={profileData[role]?.name}
          onChange={(e) => handleChange(role, "name", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={profileData[role]?.email}
          disabled
          className="w-full p-3 border bg-gray-100 rounded-md"
        />
        <input
          type="text"
          placeholder="Phone"
          value={profileData[role]?.phone}
          onChange={(e) => handleChange(role, "phone", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="CNIC"
          value={profileData[role]?.cnic}
          disabled
          className="w-full p-3 border bg-gray-100 rounded-md"
        />
        <input
          type="text"
          placeholder="Department"
          value={profileData[role]?.department}
          onChange={(e) => handleChange(role, "department", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Designation"
          value={profileData[role]?.designation}
          onChange={(e) => handleChange(role, "designation", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Office Location"
          value={profileData[role]?.officeLocation}
          onChange={(e) => handleChange(role, "officeLocation", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          placeholder="Tenure Start"
          value={profileData[role]?.tenureStart}
          onChange={(e) => handleChange(role, "tenureStart", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          placeholder="Tenure End"
          value={profileData[role]?.tenureEnd}
          onChange={(e) => handleChange(role, "tenureEnd", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          Save Changes
        </button>
        <button
          onClick={() => setEditMode((prev) => ({ ...prev, [role]: false }))}
          type="button"
          className="w-full bg-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );

  const renderAddProfileForm = () => (
    <div className="p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-center text-xl font-bold text-green-600 mb-4">
        Add New Profile
      </h2>
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        if (addingRole) handleAddProfile(addingRole);
      }}>
        <select
          value={addingRole || ""}
          onChange={(e) => setAddingRole(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="vc">Vice Chancellor</option>
          <option value="dean">Dean</option>
          <option value="chairman">Chairman Academics</option>
          <option value="deputy">Deputy Academics</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          value={newProfile.name}
          onChange={(e) => handleNewProfileChange("name", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={newProfile.email}
          onChange={(e) => handleNewProfileChange("email", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Phone"
          value={newProfile.phone}
          onChange={(e) => handleNewProfileChange("phone", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="CNIC"
          value={newProfile.cnic}
          onChange={(e) => handleNewProfileChange("cnic", e.target.value)}
          required
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Department"
          value={newProfile.department}
          onChange={(e) => handleNewProfileChange("department", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Designation"
          value={newProfile.designation}
          onChange={(e) => handleNewProfileChange("designation", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Office Location"
          value={newProfile.officeLocation}
          onChange={(e) => handleNewProfileChange("officeLocation", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          placeholder="Tenure Start"
          value={newProfile.tenureStart}
          onChange={(e) => handleNewProfileChange("tenureStart", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          placeholder="Tenure End"
          value={newProfile.tenureEnd}
          onChange={(e) => handleNewProfileChange("tenureEnd", e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          Add Profile
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8">
      {renderDisplay("vc", "Vice Chancellor")}
      {editMode.vc && renderForm("vc", "Vice Chancellor")}
      {renderDisplay("dean", "Dean")}
      {editMode.dean && renderForm("dean", "Dean")}
      {renderDisplay("chairman", "Chairman Academics")}
      {editMode.chairman && renderForm("chairman", "Chairman Academics")}
      {renderDisplay("deputy", "Deputy Academics")}
      {editMode.deputy && renderForm("deputy", "Deputy Academics")}
      {renderAddProfileForm()}
    </div>
  );
};

export default InstituteProfile;
