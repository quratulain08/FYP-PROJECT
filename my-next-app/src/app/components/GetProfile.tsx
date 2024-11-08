import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Make sure you have this import

// Define the VocalPersonData interface
interface VocalPersonData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  designation: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<VocalPersonData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/vocalPersonProfile');
      if (!response.ok) {
        console.error('Failed to fetch profile');
        return;
      }
      const data = await response.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone}</p>
          <p>CNIC: {profile.cnic}</p>
          <p>Designation: {profile.designation}</p>
          <Link href="/edit-profile">Edit Profile</Link>
        </div>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default UserProfile;
