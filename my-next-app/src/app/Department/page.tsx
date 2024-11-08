// pages/faculty.js
import DepartmentDashboard from '../components/departmentForm';
import DepartmentInfo from '../components/DepartmentInfo';
import Layout from '../components/Layout';

const FacultyPage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <DepartmentInfo />
            </div>
        </Layout>
    );
};

export default FacultyPage;
