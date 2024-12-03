import DepartmentDashboard from '../../components/departmentForm';
import Internships from '@/app/components/ViewInternships';
import CoordinatorLayout from './../CoordinatorLayout';

const internshipPage = () => {
    return (
        <CoordinatorLayout>
        <div className="min-h-screen"> {/* Ensures the page takes full height */}
            {/* Navbar */}

            {/* The content of the page */}
            <div className="container mx-auto px-4 py-8 mt-20"> {/* Adjust mt-20 as needed */}
                <Internships />
            </div>
        </div>
        </CoordinatorLayout>
    );
};

export default internshipPage;
