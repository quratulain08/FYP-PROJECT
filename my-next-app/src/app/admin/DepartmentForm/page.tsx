"use client";

import { useState } from 'react';
import DepartmentInfo from '@/models/Department';
import Layout from "@/app/components/Layout";

const DepartmentDashboard: React.FC = () => {
  const [department, setDepartment] = useState({
    name: '',
    startDate: '',
    category: '',
    hodName: '',
    honorific: 'Mr.',
    cnic: '',
    email: '',
    phone: '',
    landLine: '',
    focalPersonName: '',
    focalPersonHonorific: 'Mr.',
    focalPersonCnic: '',
    focalPersonEmail: '',
    focalPersonPhone: '',
    CoordinatorName: '',
    CoordinatorHonorific: 'Mr.',
    CoordinatorCnic: '',
    CoordinatorEmail: '',
    CoordinatorPhone: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Computing',
    'Engineering',
    'Management Sciences',
    'Mathematics & Natural Sciences',
  ];

  const provinces = ['Sindh', 'Punjab', 'KPK', 'Balochistan'];
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start submission process
    setStatusMessage(''); // Reset status message
  
    // Helper function to generate random 8-digit password
    const generateRandomPassword = () => {
      return Math.random().toString(36).slice(-8);
    };
  
    // Generate passwords for Coordinator and Focal Person
    const coordinatorPassword = generateRandomPassword();
    const focalPersonPassword = generateRandomPassword();
  
    try {
      // Create department first
      const response = await fetch('/api/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
      });
  
      if (!response.ok) {
        throw new Error('Error creating department');
      }
  
      const result = await response.json();
      console.log('Department created:', result);
      setStatusMessage('Department created successfully!');
  
      // Register Coordinator with a random password
      const coordinatorResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: department.CoordinatorEmail,
          password: coordinatorPassword,
          role: 'Coordinator',
        }),
      });
  
      if (!coordinatorResponse.ok) {
        throw new Error('Error registering Coordinator');
      }
      console.log('Coordinator registered');
  
      // Register Focal Person with a random password
      const focalPersonResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: department.focalPersonEmail,
          password: focalPersonPassword,
          role: 'FocalPerson',
        }),
      });
  
      if (!focalPersonResponse.ok) {
        throw new Error('Error registering Focal Person');
      }
      console.log('Focal Person registered');
     
    // Send email notifications for both users
    const emailResponsee = await fetch('/api/sendEmail-Coordinator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinatorEmail: department.CoordinatorEmail,
        coordinatorPassword: coordinatorPassword,
      }),
    });

    if (!emailResponsee.ok) {
      throw new Error('Error sending email');
    }
    console.log('Emails sent successfully');


    // Send email notifications for both users
    const emailResponse = await fetch('/api/sendEmail-Focalperson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        focalPersonEmail: department.focalPersonEmail,
        focalPersonPassword: focalPersonPassword,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Error sending email');
    }
    console.log('Emails sent successfully');

        
      // Reset the form after successful submission
      setDepartment({
        name: '',
        startDate: '',
        category: '',
        hodName: '',
        honorific: 'Mr.',
        cnic: '',
        email: '',
        phone: '',
        landLine: '',
        focalPersonName: '',
        focalPersonHonorific: 'Mr.',
        focalPersonCnic: '',
        focalPersonEmail: '',
        focalPersonPhone: '',
        CoordinatorName: '',
        CoordinatorHonorific: 'Mr.',
        CoordinatorCnic: '',
        CoordinatorEmail: '',
        CoordinatorPhone: '',
      });
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to create department or register users. Please try again.');
    } finally {
      setIsSubmitting(false); // End submission process
    }
  };
  

  return (
    <Layout>
    <div className="max-w-8xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Add new Department</h1>
      </div>

      <form className="p-2 text-sm" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Side (Form Sections) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="border border-green-500 p-4">
              <h2 className="text-green-600 font-semibold mb-2">Basic Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Department Name</label>
                  <input
                    type="text"
                    name="name"
                    value={department.name}
                    onChange={handleChange}
                    placeholder="Department Name"
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={department.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    value={department.category}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* HoD Information */}
            <div className="border border-green-500 p-4">
              <h2 className="text-green-600 font-semibold mb-2">HoD Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Honorific</label>
                  <select
                    name="honorific"
                    value={department.honorific}
                    onChange={handleChange}
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">HoD Name</label>
                  <input
                    type="text"
                    name="hodName"
                    value={department.hodName}
                    onChange={handleChange}
                    placeholder="HoD Name"
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">CNIC</label>
                  <input
                    type="text"
                    name="cnic"
                    value={department.cnic}
                    onChange={handleChange}
                    placeholder="CNIC"
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={department.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Phone No.</label>
                  <input
                    type="text"
                    name="phone"
                    value={department.phone}
                    onChange={handleChange}
                    placeholder="Phone No."
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Land Line</label>
                  <input
                    type="text"
                    name="landLine"
                    value={department.landLine}
                    onChange={handleChange}
                    placeholder="Land Line"
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>
              </div>
            </div>

            {/* Focal Person Information */}
<div className="border border-green-500 p-4">
  <h2 className="text-green-600 font-semibold mb-2">Focal Person Information</h2>
  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-xs font-semibold mb-1">Honorific</label>
      <select
        name="focalPersonHonorific"
        value={department.focalPersonHonorific}
        onChange={handleChange}
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      >
        <option value="Mr.">Mr.</option>
        <option value="Ms.">Ms.</option>
        <option value="Dr.">Dr.</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Focal Person Name</label>
      <input
        type="text"
        name="focalPersonName"
        value={department.focalPersonName}
        onChange={handleChange}
        placeholder="Focal Person Name"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">CNIC</label>
      <input
        type="text"
        name="focalPersonCnic"
        value={department.focalPersonCnic}
        onChange={handleChange}
        placeholder="CNIC"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Email</label>
      <input
        type="email"
        name="focalPersonEmail"
        value={department.focalPersonEmail}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Phone No.</label>
      <input
        type="text"
        name="focalPersonPhone"
        value={department.focalPersonPhone}
        onChange={handleChange}
        placeholder="Phone No."
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>
  </div>
</div>

         {/* Coordinator Information */}
         <div className="border border-green-500 p-4">
  <h2 className="text-green-600 font-semibold mb-2">Coordinator Information</h2>
  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-xs font-semibold mb-1">Honorific</label>
      <select
        name="CoordinatorHonorific"
        value={department.CoordinatorHonorific}
        onChange={handleChange}
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      >
        <option value="Mr.">Mr.</option>
        <option value="Ms.">Ms.</option>
        <option value="Dr.">Dr.</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Coordinator Name</label>
      <input
        type="text"
        name="CoordinatorName"
        value={department.CoordinatorName}
        onChange={handleChange}
        placeholder="Coordinator Name"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">CNIC</label>
      <input
        type="text"
        name="CoordinatorCnic"
        value={department.CoordinatorCnic}
        onChange={handleChange}
        placeholder="CNIC"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Email</label>
      <input
        type="email"
        name="CoordinatorEmail"
        value={department.CoordinatorEmail}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Phone No.</label>
      <input
        type="text"
        name="CoordinatorPhone"
        value={department.CoordinatorPhone}
        onChange={handleChange}
        placeholder="Phone No."
        required
        className="w-full p-4 border rounded-md text-sm min-h-[50px]"
      />
    </div>
  </div>
</div>


          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 text-green-600">{statusMessage}</div>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-600 text-white py-2 px-4 rounded-md ${isSubmitting ? 'opacity-50' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Add Department'}
          </button>
        </div>
      </form>

     
    </div>
    </Layout>
  );
};

export default DepartmentDashboard;
