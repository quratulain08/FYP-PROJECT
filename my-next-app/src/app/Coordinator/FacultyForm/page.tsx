"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from "next/navigation";
import CoordinatorLayout from '../CoordinatorLayout';

interface FacultyData {
    departmentId: string;
    honorific: string;
    name: string;
    cnic: string;
    gender: string;
    address: string;
    province: string;
    city: string;
    contractType: string;
    academicRank: string;
    joiningDate: string;
    leavingDate?: string;
    isCoreComputingTeacher: boolean;
    email:string;
    lastAcademicQualification: {
        degreeName: string;
        degreeType: string;
        fieldOfStudy: string;
        degreeAwardingCountry: string;
        degreeAwardingInstitute: string;
        degreeStartDate: string;
        degreeEndDate: string;
    };
}
interface ValidationErrors {
    honorific?: string;
    name?: string;
    cnic?: string;
    gender?: string;
    address?: string;
    province?: string;
    city?: string;
    contractType?: string;
    academicRank?: string;
    joiningDate?: string;
    leavingDate?: string;
    email?:string;

    
    degreeName?: string;
    degreeType?: string;
    fieldOfStudy?: string;
    degreeAwardingCountry?: string;
    degreeAwardingInstitute?: string;
    degreeStartDate?: string;
    degreeEndDate?: string;
}

const provinces = [
    { name: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'] },
    { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'] },
    { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat'] },
    { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Sibi', 'Zhob'] },
    { name: 'Gilgit-Baltistan', cities: ['Gilgit', 'Skardu', 'Hunza', 'Ghanche'] },
    { name: 'Azad Kashmir', cities: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bhimber'] },
];

const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-red-500 text-xs mt-1">{error}</p>;
};

export default function FacultyForm() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.slug as string;
    const searchParams = useSearchParams();
    const isEdit = searchParams.get('edit') === 'true';
    const facultyId = searchParams.get('facultyId');
    const [errors, setErrors] = useState<ValidationErrors>({});
    // const [isCheckingCNIC, setIsCheckingCNIC] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [honorific, setHonorific] = useState<string>('Mr');
    const [name, setName] = useState<string>('');
    const [cnic, setCnic] = useState<string>('');
    const [gender, setGender] = useState<string>('Male');
    const [email, setEmail] = useState<string>('');
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
        setSelectedCity('');
    };

    const fetchFacultyData = async () => {
        try {
            setLoading(true);
            setMessage('');

            if (!facultyId || facultyId === 'undefined') {
                setMessage('Invalid faculty ID provided');
                return;
            }

            const response = await fetch(`/api/faculty/${facultyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed to fetch faculty data. Status: ${response.status}`);
            }

            const facultyData: FacultyData = await response.json();

            setHonorific(facultyData.honorific);
            setName(facultyData.name);
            setCnic(facultyData.cnic);
            setGender(facultyData.gender);
            setEmail(facultyData.email);
            setAddress(facultyData.address);
            setSelectedProvince(facultyData.province);
            setSelectedCity(facultyData.city);
            setContractType(facultyData.contractType);
            setAcademicRank(facultyData.academicRank);
            setJoiningDate(facultyData.joiningDate);
            setLeavingDate(facultyData.leavingDate || '');
            setIsCoreComputingTeacher(facultyData.isCoreComputingTeacher);

            const qual = facultyData.lastAcademicQualification;
            setDegreeName(qual.degreeName);
            setDegreeType(qual.degreeType);
            setFieldOfStudy(qual.fieldOfStudy);
            setDegreeAwardingCountry(qual.degreeAwardingCountry);
            setDegreeAwardingInstitute(qual.degreeAwardingInstitute);
            setDegreeStartDate(qual.degreeStartDate);
            setDegreeEndDate(qual.degreeEndDate);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch faculty data';
            console.error('Error fetching faculty data:', errorMessage);
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit && facultyId && facultyId !== 'undefined') {
            fetchFacultyData();
        }
    }, [isEdit, facultyId]);

    const formatCNIC = (value: string) => {
        const cleanValue = value.replace(/[^\d]/g, '');
        let formattedValue = '';
        
        if (cleanValue.length <= 5) {
            formattedValue = cleanValue;
        } else if (cleanValue.length <= 12) {
            formattedValue = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5)}`;
        } else {
            formattedValue = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 12)}-${cleanValue.slice(12, 13)}`;
        }
        
        return formattedValue;
    };
    const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCNIC(e.target.value);
        setCnic(formatted);
        
        // Clear CNIC error if it exists
        if (errors.cnic) {
            setErrors(prev => ({ ...prev, cnic: undefined }));
        }
    };
    
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Required field validations
        if (!honorific) newErrors.honorific = 'Honorific is required';
        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'email is required';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!address) newErrors.address = 'Address is required';
        if (!selectedProvince) newErrors.province = 'Province is required';
        if (!selectedCity) newErrors.city = 'City is required';
        if (!contractType) newErrors.contractType = 'Contract type is required';
        if (!academicRank) newErrors.academicRank = 'Academic rank is required';
        if (!joiningDate) newErrors.joiningDate = 'Joining date is required';

        // CNIC validation
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        if (!cnic) {
            newErrors.cnic = 'CNIC is required';
        } else if (!cnicRegex.test(cnic)) {
            newErrors.cnic = 'CNIC must be in format: 12345-1234567-1';
        }

        // Ensure that the function name matches throughout your code
// const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters

//     // Limit the length of the CNIC to 13 digits (without dashes)
//     if (value.length > 13) {
//         value = value.slice(0, 13);
//     }

//     // Add the first dash after 5 digits
//     if (value.length > 5) {
//         value = value.slice(0, 5) + '-' + value.slice(5);
//     }

//     // Add the second dash after 13 digits
//     if (value.length > 12) {
//         value = value.slice(0, 13) + '-' + value.slice(13);
//     }

//     setCnic(value);
// };

        // Date validations
        if (leavingDate && new Date(leavingDate) <= new Date(joiningDate)) {
            newErrors.leavingDate = 'Leaving date must be after joining date';
        }

        // Academic qualification validations
        if (!degreeName) newErrors.degreeName = 'Degree name is required';
        if (!degreeType) newErrors.degreeType = 'Degree type is required';
        if (!fieldOfStudy) newErrors.fieldOfStudy = 'Field of study is required';
        if (!degreeAwardingCountry) newErrors.degreeAwardingCountry = 'Degree awarding country is required';
        if (!degreeAwardingInstitute) newErrors.degreeAwardingInstitute = 'Degree awarding institute is required';
        if (!degreeStartDate) newErrors.degreeStartDate = 'Degree start date is required';
        if (!degreeEndDate) newErrors.degreeEndDate = 'Degree end date is required';

        if (degreeStartDate && degreeEndDate && new Date(degreeEndDate) <= new Date(degreeStartDate)) {
            newErrors.degreeEndDate = 'Degree end date must be after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!validateForm()) {
            setMessage('Please fill in all required fields correctly');
            return;
        }

        setLoading(true);
        setMessage('');

        const facultyData = {
            departmentId,
            honorific,
            name,
            cnic,
            email,
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
            const url = isEdit 
                ? `/api/faculty/${facultyId}`
                : `/api/faculty/department/${departmentId}`;
            
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(facultyData),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEdit ? 'update' : 'create'} faculty member`);
            }

            setMessage(`Faculty member ${isEdit ? 'updated' : 'created'} successfully!`);
            
            setTimeout(() => {
                router.push(`/Department/${departmentId}`);
            }, 1500);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }


    

    return (
        <CoordinatorLayout>
        <div className="max-w-8xl mx-auto w-full p-6">
            <form className="text-base" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Right Side (Instructions Box) */}
                    <div className="hidden lg:block border border-green-500 p-4 w-full">
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">Instructions</h2>
                        <div className="text-base text-red-600">
                            <p>1. Name & CNIC cannot be changed once added.</p>
                            <p>2. For Computing Faculty Types and Requirements/Criteria please visit the website.</p>
                            <p>3. Core Computing Teacher (Check Box) must be checked for computing faculty.</p>
                        </div>
                    </div>

                    {/* Left Side (Form Sections) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-2xl font-semibold text-green-600 mb-2">Personal Information</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-semibold mb-1">Honorific</label>
                                    <select 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={honorific} 
                                        onChange={(e) => setHonorific(e.target.value)}
                                    >
                                        <option>Mr</option>
                                        <option>Ms</option>
                                        <option>Mrs</option>
                                    </select>
                                    <ErrorMessage error={errors.honorific} />
                                </div>
                                

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={name}
                                        disabled={isEdit}
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.name} />
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
                                    <ErrorMessage error={errors.gender} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">email</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={email}
                                        disabled={isEdit}
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.email} />
                                </div>

                                <div>
            <label className="block text-xs font-semibold mb-1">CNIC</label>
            <input
                type="text"
                className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                value={cnic}
                onChange={handleCNICChange}
                disabled={isEdit}
            />
            <ErrorMessage error={errors.cnic} />
        </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-2xl font-semibold text-green-600 mb-2">Address Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Address</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.address} />
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
                                    <ErrorMessage error={errors.province} />
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
                                    <ErrorMessage error={errors.city} />
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="border border-green-500 p-4">
                            <h2 className="text-2xl font-semibold text-green-600 mb-2">Employment Details</h2>
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
                                    <ErrorMessage error={errors.contractType} />
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
                                    <ErrorMessage error={errors.academicRank} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Joining Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                                        value={joiningDate}
                                        onChange={(e) => setJoiningDate(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.joiningDate} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Leaving Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={leavingDate}
                                        onChange={(e) => setLeavingDate(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.leavingDate} />
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
                            <h2 className="text-2xl font-semibold text-green-600 mb-2">Last Academic Qualification</h2>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeName}
                                        onChange={(e) => setDegreeName(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeName} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeType}
                                        onChange={(e) => setDegreeType(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeType} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Field of Study</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={fieldOfStudy}
                                        onChange={(e) => setFieldOfStudy(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.fieldOfStudy} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Awarding Country</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeAwardingCountry}
                                        onChange={(e) => setDegreeAwardingCountry(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeAwardingCountry} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Awarding Institute</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeAwardingInstitute}
                                        onChange={(e) => setDegreeAwardingInstitute(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeAwardingInstitute} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeStartDate}
                                        onChange={(e) => setDegreeStartDate(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeStartDate} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold mb-1">Degree End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 border rounded-md text-sm min-h-[50px]" 
                                        value={degreeEndDate}
                                        onChange={(e) => setDegreeEndDate(e.target.value)} 
                                    />
                                    <ErrorMessage error={errors.degreeEndDate} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 flex flex-col items-center">
                        <button 
                            type="submit" 
                            className={`w-40 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-base font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : isEdit ? 'Update Faculty' : 'Add Faculty'}
                        </button>
                        {message && (
                            <div className={`mt-4 p-4 rounded-md text-base ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
        </CoordinatorLayout>
    );
}