
import Layout from '../../components/Layout';
import DepartmentList from "@/app/components/DepartmentList"
import CoordinatorLayout from './../CoordinatorLayout';

const FacultyPage = () => {
    return (
        <CoordinatorLayout>
        <div className="min-h-screen"> {/* Ensures the page takes full height */}
        {/* Navbar */}

        {/* The content of the page */}
        <div className="container mx-auto px-4 py-8 mt-20"> {/* Adjust mt-20 as needed */}
            <DepartmentList />
        </div>
    </div>
    </CoordinatorLayout>
           
    );
};

export default FacultyPage;
