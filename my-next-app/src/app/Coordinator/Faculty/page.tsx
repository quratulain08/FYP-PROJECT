
import Layout from '../../components/Layout';
import Navbar from '@/app/Coordinator/navbar/page';
import DepartmentList from "@/app/components/DepartmentList"

const FacultyPage = () => {
    return (
        <div className="min-h-screen"> {/* Ensures the page takes full height */}
        {/* Navbar */}
        <Navbar />

        {/* The content of the page */}
        <div className="container mx-auto px-4 py-8 mt-20"> {/* Adjust mt-20 as needed */}
            <DepartmentList />
        </div>
    </div>
           
    );
};

export default FacultyPage;
