// pages/StudentsPage.js

import Layout from '@/app/components/Layout';
import InstituteProfile from '@/app/components/InstituteProfileForm';
import DepartmentListiInStudents from '@/app/components/departmentInStudents'
import Navbar from '@/app/Coordinator/navbar/page';
import CoordinatorLayout from './../CoordinatorLayout';

const StudentsPagee = () => {
    return (
        <CoordinatorLayout>
         <div className="min-h-screen"> {/* Ensures the page takes full height */}
         {/* Navbar */}

         {/* The content of the page */}
         <div className="container mx-auto px-4 py-8 mt-20"> {/* Adjust mt-20 as needed */}
             <DepartmentListiInStudents />
         </div>
     </div>
     </CoordinatorLayout>
    );
};

export default StudentsPagee;
