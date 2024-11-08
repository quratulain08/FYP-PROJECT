"use client";
import React, { useState } from 'react';

const provinces = [
    { name: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'] },
    { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'] },
    { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat'] },
    { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Sibi', 'Zhob'] },
    { name: 'Gilgit-Baltistan', cities: ['Gilgit', 'Skardu', 'Hunza', 'Ghanche'] },
    { name: 'Azad Kashmir', cities: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bhimber'] },
];

export default function FacultyForm() {
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [cnic, setCnic] = useState<string>('');
    const [gender, setGender] = useState<string>('Male');
    const [address, setAddress] = useState<string>('');
    const [contractType, setContractType] = useState<string>('Permanent');
    const [academicRank, setAcademicRank] = useState<string>('Professor');
    const [joiningDate, setJoiningDate] = useState<string>('');
    const [leavingDate, setLeavingDate] = useState<string>('');
    const [isCoreComputingTeacher, setIsCoreComputingTeacher] = useState<boolean>(false);
    const [degreeName, setDegreeName] = useState<string>('');
    const [degreeType, setDegreeType] = useState<string>('');
    const [fieldOfStudy, setFieldOfStudy] = useState<string>('');
    const [degreeAwardingCountry, setDegreeAwardingCountry] = useState<string>('');
    const [degreeAwardingInstitute, setDegreeAwardingInstitute] = useState<string>('');
    const [degreeStartDate, setDegreeStartDate] = useState<string>('');
    const [degreeEndDate, setDegreeEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(event.target.value);
        setSelectedCity(''); // Reset city selection
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        const facultyData = {
            name,
            cnic,
            gender,
            address,
            province: selectedProvince,
            city: selectedCity,
            contractType,
            academicRank,
            joiningDate,
            leavingDate,
            isCoreComputingTeacher,
            lastAcademicQualification: {
                degreeName,
                degreeType,
                fieldOfStudy,
                degreeAwardingCountry,
                degreeAwardingInstitute,
                degreeStartDate,
                degreeEndDate,
            }
        };

        try {
            const response = await fetch('/api/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(facultyData),
            });

            if (!response.ok) {
                throw new Error('Failed to create faculty member');
            }

            const data = await response.json();
            setMessage(`Faculty member ${data.name} created successfully!`);
            // Clear the form or reset state here if needed
        } catch (error: unknown) {
    if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
    } else {
        setMessage('An unknown error occurred.');
    }
}

    };

    return (
        <div className="max-w-8xl mx-auto w-full">
            <form className="p-2 text-sm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Right Side (Instructions Box) */}
                    <div className="hidden lg:block border border-green-500 p-4 w-full">
                        <h2 className="text-green-600 font-semibold mb-2">Instructions</h2>
                        <div className="text-red-600 text-xs">
                            <p>1. Name & CNIC cannot be changed once added.</p>
                            <p>2. For Computing Faculty Types and Requirements/Criteria please visit the website.</p>
                            <p>3. Core Computing Teacher (Check Box) must be checked for computing faculty.</p>
                        </div>
                    </div>

                    {/* Left Side (Form Sections) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-green-600 font-semibold mb-2">Personal Information</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Honorific</label>
                                    <select className="w-full p-4 border rounded-md text-sm min-h-[50px]">
                                        <option>Mr</option>
                                        <option>Ms</option>
                                        <option>Mrs</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Gender</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)} 
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">CNIC</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={cnic}
                                        onChange={(e) => setCnic(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-green-600 font-semibold mb-2">Address Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Address</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Province</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={selectedProvince} 
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">Select Province</option>
                                        {provinces.map((province) => (
                                            <option key={province.name} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">City</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={selectedCity} 
                                        onChange={(e) => setSelectedCity(e.target.value)} 
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Select City</option>
                                        {selectedProvince && provinces.find(p => p.name === selectedProvince)?.cities?.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-green-600 font-semibold mb-2">Employment Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Contract Type</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={contractType}
                                        onChange={(e) => setContractType(e.target.value)} 
                                    >
                                        <option>Permanent</option>
                                        <option>Temporary</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Academic Rank</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={academicRank}
                                        onChange={(e) => setAcademicRank(e.target.value)} 
                                    >
                                        <option>Professor</option>
                                        <option>Associate Professor</option>
                                        <option>Assistant Professor</option>
                                        <option>Lecturer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Joining Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={joiningDate}
                                        onChange={(e) => setJoiningDate(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Leaving Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={leavingDate}
                                        onChange={(e) => setLeavingDate(e.target.value)} 
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={isCoreComputingTeacher} 
                                        onChange={(e) => setIsCoreComputingTeacher(e.target.checked)} 
                                        className="mr-2"
                                    />
                                    <label className="text-xs font-semibold">Core Computing Teacher</label>
                                </div>
                            </div>
                        </div>

                        {/* Last Academic Qualification */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-green-600 font-semibold mb-2">Last Academic Qualification</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeName}
                                        onChange={(e) => setDegreeName(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeType}
                                        onChange={(e) => setDegreeType(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Field of Study</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={fieldOfStudy}
                                        onChange={(e) => setFieldOfStudy(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Awarding Country</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeAwardingCountry}
                                        onChange={(e) => setDegreeAwardingCountry(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Awarding Institute</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeAwardingInstitute}
                                        onChange={(e) => setDegreeAwardingInstitute(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeStartDate}
                                        onChange={(e) => setDegreeStartDate(e.target.value)} 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeEndDate}
                                        onChange={(e) => setDegreeEndDate(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2">
                        <button 
                            type="submit" 
                            className={`w-full p-4 bg-green-500 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Add Faculty'}
                        </button>
                    </div>
                </div>
            </form>
            {message && <div className="mt-4 text-red-500">{message}</div>}
        </div>
    );
}
