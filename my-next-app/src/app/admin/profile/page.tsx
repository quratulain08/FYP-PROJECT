// pages/faculty.js

import Layout from '@/app/components/Layout';
import VocalPerson from '@/app/components/profileForm';
import InstituteProfile from '@/app/components/profileForm';

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
