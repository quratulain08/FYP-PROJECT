"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Edit,
  Trash2,
  UserPlus,
  Save,
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Building,
  Briefcase,
  MapPin,
  Calendar,
} from "lucide-react"

interface ProfileData {
  role: string
  name: string
  email: string
  phone: string
  cnic: string
  department?: string
  designation?: string
  officeLocation?: string
  tenureStart?: string
  tenureEnd?: string
  university?: string

}

const InstituteProfile: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState<Record<string, ProfileData>>({})
  const [editMode, setEditMode] = useState<Record<string, boolean>>({})
  const [universityId, setUniversityId] = useState(null);

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
    university:"",
  })
  const [addingRole, setAddingRole] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {


      const email = localStorage.getItem("email")
      const res = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
     
if (!res.ok) {
  throw new Error(`Failed to fetch university ID for ${email}`);
}

const dataa = await res.json();
// Assuming the response is an object with the universityId property
const universityId = dataa.universityId; // Access the correct property
setUniversityId(dataa.universityId); // Store universityId in state

        const response = await fetch(`/api/instituteProfile/${universityId}`)
        const data = await response.json()
        const formattedData = data.reduce((acc: Record<string, ProfileData>, profile: ProfileData) => {
          acc[profile.role] = profile
          return acc
        }, {})
        setProfileData(formattedData)
      } catch (error) {
        console.error("Failed to fetch profiles:", error)
        setStatusMessage({ type: "error", message: "Failed to fetch profiles. Please try again." })
      }
    }

    fetchProfiles()
  }, [])

  // Auto-dismiss status messages after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  const [formData, setFormData] = useState({
    user: "",
    password: "",
  })

  const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Submitted:", formData)

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const { user: email, password } = formData

      const focalPersonResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "EnterpriseCell",
          university: universityId,
        }),
      })

      if (!focalPersonResponse.ok) {
        throw new Error("Error registering Enterprise Cell")
      }

      const emailResponse = await fetch("/api/sendEmail-EnterpriseCell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EnterpriseCellEmail: email,
          EnterpriseCellPassword: password,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Error sending email")
      }

      setStatusMessage({ type: "success", message: "Enterprise Cell registered and email sent successfully." })
      setFormData({ user: "", password: "" })
    } catch (error) {
      console.error(error)
      setStatusMessage({
        type: "error",
        message: "Failed to register Enterprise Cell or send email. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (role: string, field: keyof ProfileData, value: string) => {
    setProfileData((prevData) => ({
      ...prevData,  
         [role]: { ...prevData[role], [field]: value },
    }))
  }

  const handleSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/instituteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData[role]),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const result = await response.json()
      console.log(`${role} Profile Data saved:`, result)
      setEditMode((prev) => ({ ...prev, [role]: false }))
      setStatusMessage({ type: "success", message: `${getRoleTitle(role)} profile updated successfully.` })
    } catch (error) {
      console.error("Error saving profile:", error)
      setStatusMessage({ type: "error", message: `Failed to update ${getRoleTitle(role)} profile.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (role: string) => {
    if (!confirm(`Are you sure you want to delete the ${getRoleTitle(role)} profile?`)) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/instituteProfile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      const result = await response.json()
      console.log(result.message)
      setProfileData((prevData) => {
        const newData = { ...prevData }
        delete newData[role]
        return newData
      })
      setStatusMessage({ type: "success", message: `${getRoleTitle(role)} profile deleted successfully.` })
    } catch (error) {
      console.error("Error deleting profile:", error)
      setStatusMessage({ type: "error", message: `Failed to delete ${getRoleTitle(role)} profile.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddProfile = async (role: string) => {
    if (!role) {
      setStatusMessage({ type: "error", message: "Please select a role before adding a profile." })
      return
    }

    setIsSubmitting(true)
    const profileWithRole: ProfileData = { 
      ...newProfile, 
      role, 
      university: universityId ?? "" // Convert null to an empty string
    };
    try {
      const response = await fetch("/api/instituteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileWithRole),
      })

      if (!response.ok) {
        throw new Error("Failed to add profile")
      }

      const result = await response.json()
      console.log("New Profile Data saved:", result)

      setProfileData((prevData) => ({
        ...prevData,
        [role]: profileWithRole,
      }))

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
        university: universityId || "",

      })

      setAddingRole(null)
      setShowAddForm(false)
      setStatusMessage({ type: "success", message: `${getRoleTitle(role)} profile added successfully.` })
    } catch (error) {
      console.error("Error adding profile:", error)
      setStatusMessage({ type: "error", message: `Failed to add ${getRoleTitle(role)} profile.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleTitle = (role: string): string => {
    const titles: Record<string, string> = {
      vc: "Vice Chancellor",
      dean: "Dean",
      chairman: "Chairman Academics",
      deputy: "Deputy Academics",
    }
    return titles[role] || role
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const renderEditForm = (role: string, title: string) => {
    const profile = profileData[role]

    return (
      <form className="space-y-4" onSubmit={(e) => handleSubmit(e, role)}>
        <h2 className="text-center text-xl font-bold text-green-600 mb-4">Edit {title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange(role, "name", e.target.value)}
                placeholder="Name"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange(role, "email", e.target.value)}
                placeholder="Email"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleChange(role, "phone", e.target.value)}
                placeholder="Phone"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.cnic}
                onChange={(e) => handleChange(role, "cnic", e.target.value)}
                placeholder="CNIC"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.department || ""}
                onChange={(e) => handleChange(role, "department", e.target.value)}
                placeholder="Department"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={profile.designation || ""}
                onChange={(e) => handleChange(role, "designation", e.target.value)}
                placeholder="Designation"
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-green-400"
          >
            {isSubmitting ? "Saving..." : "Save"}
            {!isSubmitting && <Save size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setEditMode((prev) => ({ ...prev, [role]: false }))}
            className="flex-1 bg-gray-400 text-white p-3 rounded-md hover:bg-gray-500 transition flex items-center justify-center gap-2"
          >
            Cancel
            <X size={18} />
          </button>
        </div>
      </form>
    )
  }

  const renderDisplay = (role: string, title: string) => {
    const profile = profileData[role]

    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        {editMode[role] ? (
          <div className="p-6">{renderEditForm(role, title)}</div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode((prev) => ({ ...prev, [role]: true }))}
                  className="text-white hover:text-green-200 p-1 rounded-full hover:bg-green-600 transition"
                  title="Edit Profile"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(role)}
                  className="text-white hover:text-green-200 p-1 rounded-full hover:bg-green-600 transition"
                  title="Delete Profile"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {profile ? (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                    {getInitials(profile.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
                    {profile.designation && <p className="text-gray-600">{profile.designation}</p>}
                  </div>
                </div>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <Mail className="text-green-600 mr-3" size={18} />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-green-600 mr-3" size={18} />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="text-green-600 mr-3" size={18} />
                    <span>{profile.cnic}</span>
                  </div>
                  {profile.department && (
                    <div className="flex items-center">
                      <Building className="text-green-600 mr-3" size={18} />
                      <span>{profile.department}</span>
                    </div>
                  )}
                  {profile.officeLocation && (
                    <div className="flex items-center">
                      <MapPin className="text-green-600 mr-3" size={18} />
                      <span>{profile.officeLocation}</span>
                    </div>
                  )}
                  {(profile.tenureStart || profile.tenureEnd) && (
                    <div className="flex items-center">
                      <Calendar className="text-green-600 mr-3" size={18} />
                      <span>
                        {profile.tenureStart && `From: ${new Date(profile.tenureStart).toLocaleDateString()}`}
                        {profile.tenureStart && profile.tenureEnd && " - "}
                        {profile.tenureEnd && `To: ${new Date(profile.tenureEnd).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <User className="mx-auto mb-2 text-gray-400" size={48} />
                <p>No data available for this role.</p>
                <button
                  onClick={() => {
                    setAddingRole(role)
                    setShowAddForm(true)
                  }}
                  className="mt-2 text-green-600 hover:text-green-800 underline"
                >
                  Add profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  const handleNewProfileChange = (field: keyof ProfileData, value: string) => {
    setNewProfile((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const renderAddProfileForm = () => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-600">Add New Profile</h2>
        <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (addingRole) {
            handleAddProfile(addingRole)
          } else {
            setStatusMessage({ type: "error", message: "Please select a role before adding a profile." })
          }
        }}
      >
        <div className="relative">
          <select
            value={addingRole || ""}
            onChange={(e) => setAddingRole(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pl-10"
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
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Name"
              value={newProfile.name}
              onChange={(e) => handleNewProfileChange("name", e.target.value)}
              required
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={newProfile.email}
              onChange={(e) => handleNewProfileChange("email", e.target.value)}
              required
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Phone"
              value={newProfile.phone}
              onChange={(e) => handleNewProfileChange("phone", e.target.value)}
              required
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="CNIC"
              value={newProfile.cnic}
              onChange={(e) => handleNewProfileChange("cnic", e.target.value)}
              required
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Department"
              value={newProfile.department}
              onChange={(e) => handleNewProfileChange("department", e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Designation"
              value={newProfile.designation}
              onChange={(e) => handleNewProfileChange("designation", e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Office Location"
              value={newProfile.officeLocation}
              onChange={(e) => handleNewProfileChange("officeLocation", e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              placeholder="Tenure Start"
              value={newProfile.tenureStart}
              onChange={(e) => handleNewProfileChange("tenureStart", e.target.value)}
              className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="date"
            placeholder="Tenure End"
            value={newProfile.tenureEnd}
            onChange={(e) => handleNewProfileChange("tenureEnd", e.target.value)}
            className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-green-400"
        >
          {isSubmitting ? "Adding..." : "Add Profile"}
          {!isSubmitting && <UserPlus size={18} />}
        </button>
      </form>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Institute Profile Management</h1>
          <p className="text-gray-600">Manage profiles for key positions in your institution</p>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-md ${
              statusMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-green-500 to-green-700 p-4 text-white">
                <h2 className="text-xl font-bold">Register Enterprise Cell</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmitRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="user"
                      value={formData.user}
                      onChange={handleChangeRegister}
                      placeholder="Username"
                      className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChangeRegister}
                      placeholder="Password"
                      className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-green-400"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                    {!isSubmitting && <UserPlus size={18} />}
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                {showAddForm ? "Hide Form" : "Add New Profile"}
                {!showAddForm ? <UserPlus size={18} /> : <X size={18} />}
              </button>

              {showAddForm && <div className="mt-4">{renderAddProfileForm()}</div>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderDisplay("vc", "Vice Chancellor")}
              {renderDisplay("dean", "Dean")}
              {renderDisplay("chairman", "Chairman Academics")}
              {renderDisplay("deputy", "Deputy Academics")}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstituteProfile

