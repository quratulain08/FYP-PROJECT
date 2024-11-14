// pages/StudentsPage.js

import Layout from '../components/Layout';
import InstituteProfile from '../components/InstituteProfileForm';
import DepartmentListiInStudents from '@/app/components/departmentInStudents'

const StudentsPagee = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <DepartmentListiInStudents/>
            </div>
        </Layout>
    );
};

export default StudentsPagee;
