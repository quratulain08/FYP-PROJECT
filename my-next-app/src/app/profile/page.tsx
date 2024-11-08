// pages/faculty.js

import Layout from '../components/Layout';
import VocalPerson from '../components/profileForm';
import InstituteProfile from '../components/profileForm';

const FacultyPage = () => {
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <VocalPerson/>
            </div>
        </Layout>
    );
};

export default FacultyPage;
