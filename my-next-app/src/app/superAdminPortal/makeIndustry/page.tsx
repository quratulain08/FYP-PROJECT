"use client"
import { useState } from 'react';
import SuperAdminPortalLayout from "../superAdminPortalLayout"

const MakeAdmin = () => {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        contactEmail: '',
        location: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage("");
        setMessageType("");

        const generateRandomPassword = () => Math.random().toString(36).slice(-8);
        const Password = generateRandomPassword();

        try {
            // Create Industry
            const response = await fetch("/api/Industry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to create industry");

            console.log("Industry Created:", result);
            alert(`Industry Created Successfully! ID: ${result.industryId}`);

            // Register Admin
            const Response2 = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.contactEmail,
                    password: Password,
                    role: "industry",
                }),
            });
            setMessageType("success");

            const result2 = await Response2.json();
        //      if (Response2.status !== 200 && Response2.status !== 201)
        //   throw new Error(result2.error || "Failed to register industry ");

            alert(`Industry  Registered Successfully!`);

            // Send Email
            const emailResponse = await fetch("/api/sendEmail-Industry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Email: formData.contactEmail,
                    Password: Password,
                }),
            });

            if (!emailResponse.ok) throw new Error("Error sending email to industry admin");
            console.log("Industry admin email sent successfully");

            setStatusMessage("Industry and Admin successfully created.");
            setMessageType("success");

        } catch (error) {
            console.error("Request failed:", error);
            setStatusMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SuperAdminPortalLayout>
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-start p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-teal-700">Register New Industry</h2>
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
                                        Industry Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter industry name"
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
                                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        placeholder="contact@industry.com"
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
                                        "Register Industry"
                                    )}
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
