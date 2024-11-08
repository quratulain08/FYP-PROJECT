"use client";

import { useState } from 'react';


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
    address: '',
    province: '',
    city: '',
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

    try {
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
        address: '',
        province: '',
        city: '',
      }); // Reset the form after successful submission
    } catch (error) {
      console.error(error);
      setStatusMessage('Failed to create department. Please try again.');
    } finally {
      setIsSubmitting(false); // End submission process
    }
  };

  return (
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

            {/* Address Information */}
            <div className="border border-green-500 p-4">
              <h2 className="text-green-600 font-semibold mb-2">Address Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={department.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Province</label>
                  <select
                    name="province"
                    value={department.province}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">City</label>
                  <select
                    name="city"
                    value={department.city}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border rounded-md text-sm min-h-[50px]"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
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
  );
};

export default DepartmentDashboard;
