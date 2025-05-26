"use client"
import { useState } from 'react';
import SuperAdminPortalLayout from "../superAdminPortalLayout"
// import { CheckCircle } from "lucide-react"




const MakeAdmin = () => {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        contactEmail: '',
        location: '',
    });

    const [formData2, setFormData2] = useState({
        name: "",
        phone: "",
        cnic: "",
        designation: "",
        email: "" // This will now hold the email for Vocal Person profile
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [message, setMessage] = useState("");
    const [sharedEmail, setSharedEmail] = useState(""); // Only used for the University form email

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(""); // Reset previous messages
        setMessageType("");

        const generateRandomPassword = () => Math.random().toString(36).slice(-8);
        const Password = generateRandomPassword(); // Generate admin password

        try {
            // Create University
            const response = await fetch("/api/universities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to create university");

            console.log("University Created:", result);
            alert(`University Created Successfully! ID: ${result.universityId}`);

            // Register Admin
            const adminResponse = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.contactEmail,
                    password: Password,
                    role: "admin",
                    university: result.universityId,
                }),
            });

            const adminResult = await adminResponse.json();
            if (!adminResponse.ok) throw new Error(adminResult.error || "Failed to register admin");

            console.log("Admin Registered:", adminResult);
            alert(`Admin Registered Successfully!`);

            // Send Email
            const emailResponse = await fetch("/api/sendEmail-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: formData.contactEmail, // Ensure correct key
                    Password: Password,
                }),
            });

            if (!emailResponse.ok) throw new Error("Error sending email to admin");
            console.log("Admin email sent successfully");

            // Success Message
            setStatusMessage("University and Admin successfully created.");
            setMessageType("success");

        } catch (error) {
            console.error("Request failed:", error);
            setStatusMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData2((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch("/api/vocalPersonProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData2), // Send formData2 here
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Failed to save profile");

            setMessage(result.message || "Vocal Person profile saved successfully!");
            setMessageType("success");

        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SuperAdminPortalLayout>
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-start p-4">
                {/* Register New University Form */}
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-teal-700">Register New University</h2>
                        </div>

                        {statusMessage && (
                            <div
                                className={`p-4 my-4 text-center rounded-md ${
                                    messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {statusMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        University Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter university name"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="contactEmail"
                                        type="email"
                                        value={sharedEmail}
                                        onChange={(e) => {
                                            setSharedEmail(e.target.value);
                                            setFormData({ ...formData, contactEmail: e.target.value });
                                        }}
                                        placeholder="contact@university.edu"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                            Registering...
                                        </>
                                    ) : (
                                        "Request Register"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Vocal Person Profile Form */}
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Vocal Person Profile</h2>

                        {message && (
                            <div
                                className={`p-4 mb-4 text-center rounded-md ${
                                    messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit2} className="space-y-4">
                            {["name", "phone", "cnic", "designation"].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                                        {field} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id={field}
                                        name={field}
                                        type="text"
                                        value={formData2[field as keyof typeof formData2]}
                                        onChange={handleChange2}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        placeholder={`Enter ${field}`}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 capitalize">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData2.email} // Correct reference to formData2.email
                                    onChange={(e) => {
                                        setFormData2({ ...formData2, email: e.target.value }); // Update formData2.email
                                    }}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    placeholder="Enter email"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                >
                                    {isSubmitting ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SuperAdminPortalLayout>
    );
};

export default MakeAdmin;


