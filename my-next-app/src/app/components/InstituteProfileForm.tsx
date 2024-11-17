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
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/instituteProfile");
        const data = await response.json();
        const formattedData = data.reduce(
          (acc: Record<string, ProfileData>, profile: ProfileData) => {
            acc[profile.role] = profile;
            return acc;
          },
          {}
        );
        setProfileData(formattedData);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
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
        throw new Error("Failed to save profile");
      }

      const result = await response.json();
      console.log(`${role} Profile Data saved:`, result);
      setEditMode((prev) => ({ ...prev, [role]: false }));
    } catch (error) {
      console.error("Error saving profile:", error);
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
        throw new Error("Failed to delete profile");
      }

      const result = await response.json();
      console.log(result.message);
      setProfileData((prevData) => {
        const newData = { ...prevData };
        delete newData[role];
        return newData;
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
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

  const renderEditForm = (role: string, title: string) => {
    const profile = profileData[role];

    return (
      <form
        className="space-y-4"
        onSubmit={(e) => handleSubmit(e, role)}
      >
        <h2 className="text-center text-xl font-bold text-green-600 mb-4">
          Edit {title}
        </h2>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => handleChange(role, "name", e.target.value)}
          placeholder="Name"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="email"
          value={profile.email}
          onChange={(e) => handleChange(role, "email", e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          value={profile.phone}
          onChange={(e) => handleChange(role, "phone", e.target.value)}
          placeholder="Phone"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          value={profile.cnic}
          onChange={(e) => handleChange(role, "cnic", e.target.value)}
          placeholder="CNIC"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          value={profile.department || ""}
          onChange={(e) => handleChange(role, "department", e.target.value)}
          placeholder="Department"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditMode((prev) => ({ ...prev, [role]: false }))}
          className="w-full bg-gray-400 text-white p-3 rounded-md hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </form>
    );
  };

  const renderDisplay = (role: string, title: string) => {
    const profile = profileData[role];

    return (
      <div className="p-6 bg-gray-100 shadow-md rounded-lg border">
        {editMode[role] ? (
          renderEditForm(role, title)
        ) : (
          <>
            <h2 className="text-center text-xl font-bold text-green-600 mb-4">
              {title}
            </h2>
            {profile ? (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>CNIC:</strong> {profile.cnic}
                </p>
                <p>
                  <strong>Department:</strong> {profile.department || "N/A"}
                </p>
                <button
                  onClick={() => setEditMode((prev) => ({ ...prev, [role]: true }))}
                  className="mt-4 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  className="mt-2 w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ) : (
              <p>No data available for this role.</p>
            )}
          </>
        )}
      </div>
    );
  };

  const handleNewProfileChange = (field: keyof ProfileData, value: string) => {
    setNewProfile((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const renderAddProfileForm = () => (
    <div className="p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-center text-xl font-bold text-green-600 mb-4">
        Add New Profile
      </h2>
      <form  className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (addingRole) {
          handleAddProfile(addingRole);
        } else {
          alert("Please select a role.");
        }
      }}
    >
      <select
        value={addingRole || ""}
        onChange={(e) => {
          const selectedRole = e.target.value;
          setAddingRole(selectedRole); // Update the addingRole state
          handleNewProfileChange("role", selectedRole); // Add the role to the newProfile object
        }}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      >
        <option value="" disabled>
          Select Role
        </option>
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
    <div className="max-w-5xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDisplay("vc", "Vice Chancellor")}
        {renderDisplay("dean", "Dean")}
        {renderDisplay("chairman", "Chairman Academics")}
        {renderDisplay("deputy", "Deputy Academics")}
      </div>
      {renderAddProfileForm()}
    </div>
  );
};

export default InstituteProfile;
