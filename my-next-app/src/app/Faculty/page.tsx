import FacultyForm from '../components/FacultyForm';
import Layout from '../components/Layout';
import DepartmentList from "@/app/components/DepartmentList"
const FacultyPage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <DepartmentList/>
            </div>
        </Layout>
    );
};

export default FacultyPage;
