// pages/faculty.js

import Layout from '../components/Layout';
import InstituteProfile from '../components/InstituteProfileForm';

const FacultyPage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <InstituteProfile/>
            </div>
        </Layout>
    );
};

export default FacultyPage;
