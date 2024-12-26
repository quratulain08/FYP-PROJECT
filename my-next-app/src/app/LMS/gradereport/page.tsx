"use client";
import React, { useState } from 'react';

interface Grade {
  taskNo: number;
  taskTitle: string;
  totalMarks: number;
  marksObtained: number;
}

interface Student {
  id: number;
  name: string;
  grades: Grade[];
}

const gradereport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const students: Student[] = [
    {
      id: 1,
      name: 'John Doe',
      grades: [
        { taskNo: 1, taskTitle: 'Math Assignment', totalMarks: 100, marksObtained: 85 },
        { taskNo: 2, taskTitle: 'Science Project', totalMarks: 100, marksObtained: 90 },
        { taskNo: 3, taskTitle: 'English Essay', totalMarks: 50, marksObtained: 45 },
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      grades: [
        { taskNo: 1, taskTitle: 'Math Assignment', totalMarks: 100, marksObtained: 75 },
        { taskNo: 2, taskTitle: 'Science Project', totalMarks: 100, marksObtained: 85 },
        { taskNo: 3, taskTitle: 'English Essay', totalMarks: 50, marksObtained: 48 },
      ]
    }
  ];

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const calculateGrade = (marks: number, total: number) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold text-green-600 mb-6 border-b-2 border-green-600 pb-4">
        Select a Student to View Their Grade Report
      </h1>

      <div className="student-list mb-4">
        <ul className="list-none">
          {students.map((student) => (
            <li
              key={student.id}
              onClick={() => openModal(student)}
              className="cursor-pointer  hover:text-green-700 mb-3"
            >
              {student.name}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && selectedStudent && (
        <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-green-600 border-b-2 border-green-600 pb-2">
              {selectedStudent.name}'s Grade Report
            </h2>

            <table className="min-w-full table-auto border-collapse mb-4">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Task No</th>
                  <th className="px-4 py-2 text-left">Task Title</th>
                  <th className="px-4 py-2 text-left">Total Marks</th>
                  <th className="px-4 py-2 text-left">Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.grades.map((grade) => (
                  <tr key={grade.taskNo} className="border-b">
                    <td className="px-4 py-2">{grade.taskNo}</td>
                    <td className="px-4 py-2">{grade.taskTitle}</td>
                    <td className="px-4 py-2">{grade.totalMarks}</td>
                    <td className="px-4 py-2">{grade.marksObtained}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="font-semibold text-xl text-green-600">
              <p>
                Grade: {calculateGrade(selectedStudent.grades[0].marksObtained, selectedStudent.grades[0].totalMarks)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default gradereport;
