import DepartmentDashboard from '../../components/departmentForm';
import Internships from '@/app/components/ViewInternships';
import Navbar from '@/app/Coordinator/navbar/page';

const internshipPage = () => {
    return (
        <div className="min-h-screen"> {/* Ensures the page takes full height */}
            {/* Navbar */}
            <Navbar />

            {/* The content of the page */}
            <div className="container mx-auto px-4 py-8 mt-20"> {/* Adjust mt-20 as needed */}
                <Internships />
            </div>
        </div>
    );
};

export default internshipPage;
