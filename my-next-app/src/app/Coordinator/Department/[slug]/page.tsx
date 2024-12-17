"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, Pencil, Trash2,Mail } from "lucide-react";
import CoordinatorLayout from "../../CoordinatorLayout";

// Custom notification component
const Notification = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error'; 
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between ${
        type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-sm hover:opacity-75"
      >
        ×
      </button>
    </div>
  );
};

interface Department {
  id: string;
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

interface Faculty {
  _id: string;
  departmentId: string;
  honorific: string;
  name: string;
  gender: string;
  cnic: string;
  address: string;
  province: string;
  city: string;
  contractType: string;
  academicRank: string;
  joiningDate: string;
  email:string;
  leavingDate?: string;
  isCoreComputingTeacher: boolean;
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

// Custom modal component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DepartmentDetail() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    facultyId?: string;
  }>({ isOpen: false });
  
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string;

  const checkResponseType = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON response but got ${contentType}\nResponse: ${text}`);
    }
    return response;
  };

  const fetchWithErrorHandling = async (url: string) => {
    const response = await fetch(url);
    await checkResponseType(response);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        if (!id) {
          setError({ message: "Department ID is missing" });
          return;
        }

        setLoading(true);

        const [deptData, facultyData] = await Promise.all([
          fetchWithErrorHandling(`/api/department/${id}`),
          fetchWithErrorHandling(`/api/faculty/department/${id}`)
        ]);

        if (mounted) {
          setDepartment(deptData);
          setFacultyMembers(facultyData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error:', err);
          setError({
            message: err instanceof Error ? err.message : 'Error fetching data',
            details: err instanceof Error ? err.stack : ''
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddFaculty = () => {
    if (department) {
      router.push(`/Coordinator/FacultyForm/${id}`);
    } else {
      setError({ message: "Department information is not available" });
    }
  };

  const handleEditFaculty = (faculty: Faculty) => {
    console.log('Editing faculty:', faculty);

    if (!faculty._id) {
      setNotification({
        type: 'error',
        message: 'Invalid faculty ID'
      });
      return;
    }
    
    const editUrl = `/Coordinator/FacultyForm/${encodeURIComponent(id)}?edit=true&facultyId=${encodeURIComponent(faculty._id)}&readOnlyName=${encodeURIComponent(faculty.name)}&readOnlyCnic=${encodeURIComponent(faculty.cnic)}`;
    router.push(editUrl);
  };

  const handleViewFaculty = (faculty: Faculty) => {
    router.push(`/Coordinator/FacultyView/${faculty._id}`);
  };

  const confirmDelete = (facultyId: string) => {
    setModalData({ isOpen: true, facultyId });
  };

 // Register Focal Person with a random password
// sendEmail function to handle registration and email sending
const sendEmail = async (email: string ) => {
  try {
    const generateRandomPassword = () => {
      return Math.random().toString(36).slice(-8);
    };
  
    // Generate passwords for Coordinator and Focal Person
    const FacultyPassword = generateRandomPassword();
  
    // Register Focal Person with a random password
    const facultyResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: FacultyPassword,
        role: 'Faculty',
      }),
    });

    if (!facultyResponse.ok) {
      throw new Error('Error registering faculty Person');
    }
    console.log('faclty Person registered');

    // Send email notifications for both users
    const emailResponse = await fetch('/api/sendEmail-Faculty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FacultyEmail: email,
        FacultyPassword: FacultyPassword,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Error sending email');
    }
    console.log('Emails sent successfully');
  } catch (error) {
    console.error(error.message);
  }
};



  const handleDeleteFaculty = async (facultyId: string) => {
    if (!facultyId) {
      setNotification({
        type: 'error',
        message: 'Invalid faculty ID'
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Deleting faculty with ID:', facultyId);

      const response = await fetch(`/api/faculty/${facultyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete faculty member');
      }

      const result = await response.json();
      console.log('Delete result:', result);

      setFacultyMembers(prevMembers => 
        prevMembers.filter(member => member._id !== facultyId)
      );

      setNotification({
        type: 'success',
        message: 'Faculty member deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting faculty member:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to delete faculty member'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-2">{error.message}</p>
          {error.details && (
            <details className="mt-2">
              <summary className="text-red-500 cursor-pointer">Technical Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {error.details}
              </pre>
            </details>
          )}
          <button 
            onClick={handleRetry}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Department not found</p>
      </div>
    );
  }

  return (
    <CoordinatorLayout>
    <div className="max-w-6xl mx-auto p-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <ConfirmationModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ isOpen: false })}
        onConfirm={() => {
          if (modalData.facultyId) {
            handleDeleteFaculty(modalData.facultyId);
          }
          setModalData({ isOpen: false });
        }}
        title="Confirm Delete"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
      />

      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500 mb-8">
        <div className="flex flex-col mb-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={handleAddFaculty}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium w-40"
            >
              Add New Faculty
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-green-600 mb-2">
              {department.name}
            </h1>
            <p className="text-xl text-gray-600">
              Head of Department: {department.honorific} {department.hodName}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="department-info">
            <p className="mb-3 text-base">
              <span className="font-semibold">Category:</span> {department.category}
            </p>
            <p className="mb-3 text-base">
              <span className="font-semibold">Start Date:</span> {department.startDate}
            </p>
            <p className="mb-3 text-base">
              <span className="font-semibold">CNIC:</span> {department.cnic}
            </p>
            <p className="mb-3 text-base">
              <span className="font-semibold">Email:</span> {department.email}
            </p>
          </div>
          
          <div className="department-info">
            <p className="mb-3 text-base">
              <span className="font-semibold">Phone:</span> {department.phone}
            </p>
            {department.landLine && (
              <p className="mb-3 text-base">
                <span className="font-semibold">Land Line:</span> {department.landLine}
              </p>
            )}
             <p className="mb-3">
                <span className="font-bold">Focal Person Name:</span> {department.focalPersonHonorific} {department.focalPersonName}
              </p>
              <p className="mb-3">
                <span className="font-bold">Focal Person cnic:</span>{department.focalPersonCnic}
              </p>
              <p className="mb-3">
                <span className="font-bold">Focal Person Email:</span>{department.focalPersonEmail}
              </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500">
        <h2 className="text-2xl font-semibold text-green-600 mb-6">Faculty Members</h2>
        {facultyMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-base">No faculty members found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase tracking-wider">
                    CNIC
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase tracking-wider">
                    Contract Type
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase tracking-wider">
                    Academic Rank
                  </th>
                  
                  <th className="px-6 py-3 text-right text-base font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facultyMembers.map((faculty, index) => (
                  <tr key={faculty._id || `faculty-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">
                        {faculty.honorific} {faculty.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-900">
                        {faculty.cnic}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-900">
                        {faculty.contractType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-900">
                        {faculty.academicRank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewFaculty(faculty)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditFaculty(faculty)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                          disabled={loading}
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => sendEmail(faculty.email)}
                          className="text-red-600 hover:text-red-900"
                          title="sendMail"
                          disabled={loading}
                        >
                          <Mail size={20} />
                        </button>
                        <button
                          onClick={() => confirmDelete(faculty._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </CoordinatorLayout>
  );
}