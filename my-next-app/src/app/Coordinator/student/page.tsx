// pages/StudentsPage.js
"use client";
//import CoordinatorLayout from './../CoordinatorLayout';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
    
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
    CoordinatorName: string,
    CoordinatorHonorific: 'Mr.',
    CoordinatorCnic: '',
    CoordinatorEmail: '',
    CoordinatorPhone: '',

  }
const StudentsPagee = () => {
    const router = useRouter();
    // const [profile, setProfile] = useState<Department | null>(null);
    // const [loading, setLoading] = useState(true); // Track loading state
    const loading = useState(true);
    const [error, setError] = useState<string | null>(null); // Track errors
    useEffect(() => {
        const fetchAndNavigate = async () => {
           const CoordinatorEmail = localStorage.getItem("email")

            try {
                const response = await fetch(`/api/ProfileForCoordinator?CoordinatorEmail=${CoordinatorEmail}`);
                if (response.ok) {
                  const data: Department = await response.json();
                //   setProfile(data);
                  
                    if (data && data._id) { 
                        // Navigate directly to the department detail page
                        router.push(`/Coordinator/Batch/${data._id}`);
                    } else {
                        console.error("Department not found.");
                    }
                } else {
                    console.error("Failed to fetch department:", await response.json());
                }
            } catch (error) {
                console.error("Error fetching department:", error);
            }
        };

        fetchAndNavigate();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return null; 
};

export default StudentsPagee;
