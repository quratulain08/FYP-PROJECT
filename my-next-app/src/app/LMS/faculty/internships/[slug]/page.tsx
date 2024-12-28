"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import  FacultyLayout from "@/app/FacultySupervisor/FacultyLayout";

interface Task {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  time?: string;
  marks: number;
  weightage: number;
  assignedStudents: string[];

}
interface InternshipInvolvement {
  taskTitle: string;
  totalMarks: number;
  obtainedMarks: string | number;
}


interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedFaculty: string;
  assignedStudents: string;
}

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
  section: string;
  email: string;
}

const InternshipDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;
  const [internship, setInternships] = useState<Internship[]>([]);
  const [student, setStudents] = useState<Student[]>([]);
  const [involvement, setInvolvement] = useState<InternshipInvolvement[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]); // List of assigned tasks
  const [activeTab, setActiveTab] = useState<"dashboard" | "classwork" | "students">("dashboard");

  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    deadline: "",
    time: "",
    marks: 0,
    weightage: 0,
    assignedStudents: [],
  });

  // Fetch tasks from API for faculty
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/taskForFaculty/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const FetchAssignedStudent = async () => {
    try {
      const response = await fetch(`/api/internships/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch internship");

      const data = await response.json();
      setInternships(data);

      // Ensure that assignedStudents is an array of strings (student IDs)
      const assignedStudents: string[] = data.assignedStudents;

      if (assignedStudents && assignedStudents.length > 0) {
        await FetchStudentfinal(assignedStudents);
      } else {
        console.log("No students assigned to this internship");
      }

    } catch (error) {
      console.error("Error fetching internship:", error);
    }
  };

  const FetchStudentfinal = async (assignedStudents: string[]) => {
    try {
      const studentPromises = assignedStudents.map(async (studentId) => {
        const response = await fetch(`/api/students/${studentId}`);
        if (!response.ok) throw new Error(`Failed to fetch student with ID ${studentId}`);

        const data: Student = await response.json();
        return data;
      });

      const studentsData = await Promise.all(studentPromises);
      setStudents(studentsData);

    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };


  const openModal = async (student: Student) => {
    setLoading(true); // Ensure loading starts before the fetch
  
    try {
      const response = await fetch(`/api/gradeReport/${slug}/${student._id}`); // Use student.id
      if (!response.ok) {
        throw new Error("Failed to fetch involvement data");
      }
  
      const data: InternshipInvolvement[] = await response.json();
      setInvolvement(data);
      setSelectedStudent(student);  // Ensure selected student is set
      setIsModalOpen(true); // Open modal after data is loaded
    } catch (error) {
      console.error("Error fetching student internship data:", error);
    } finally {
      setLoading(false); // Always stop loading, even if there’s an error
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };



  const handleCheckboxChange = (studentId: string, isChecked: boolean) => {
    if (isChecked) {
      // Add the student to the assignedStudents array
      setTask((prevTask) => ({
        ...prevTask,
        assignedStudents: [...prevTask.assignedStudents, studentId],
      }));
    } else {
      // Remove the student from the assignedStudents array
      setTask((prevTask) => ({
        ...prevTask,
        assignedStudents: prevTask.assignedStudents.filter(
          (id) => id !== studentId
        ),
      }));
    }
  };
  

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      // Add all students to the assignedStudents array
      const allStudentIds = student.map((s) => s._id);
      setTask((prevTask) => ({
        ...prevTask,
        assignedStudents: allStudentIds,
      }));
    } else {
      // Clear the assignedStudents array
      setTask((prevTask) => ({
        ...prevTask,
        assignedStudents: [],
      }));
    }
  };
  



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.deadline) {
      alert("Title, description, and deadline are required.");
      return;
    }

    const deadlineWithTime = `${task.deadline}T${task.time || "00:00"}`;

    try {
      const response = await fetch(`/api/taskForFaculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, deadline: deadlineWithTime, internshipId: slug }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask.task]);
        setTask({ title: "", description: "", deadline: "", time: "", marks: 0, weightage: 0 ,assignedStudents: []});
        alert("Task assigned successfully!");
      } else {
        const { error } = await response.json();
        alert(`Failed to assign task: ${error}`);
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while assigning the task.");
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/LMS/faculty/tasks/${taskId}`);
  };

  useEffect(() => {
    if (activeTab === "classwork" && slug) {
      fetchTasks();
      FetchAssignedStudent();
    }
  }, [activeTab, slug]);

  return (
  <FacultyLayout>
    <div className="max-w-4xl mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="flex justify-between border-b mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-2 px-4 ${activeTab === "dashboard" ? "border-b-2 border-green-500 text-green-600 font-bold" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("classwork")}
          className={`py-2 px-4 ${activeTab === "classwork" ? "border-b-2 border-green-500  text-green-600 font-bold" : ""}`}
        >
          Classwork
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`py-2 px-4 ${activeTab === "students" ? "border-b-2 border-green-500   text-green-600 font-bold" : ""}`}
        >
          Students
        </button>
      </div>

      {/* Dashboard: Assign Tasks */}
      {activeTab === "dashboard" && (
         <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white mb-6">
         <h2 className="text-2xl font-semibold mb-4 text-green-600">Assign Task</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Task Title */}
           <div>
             <label className="block font-medium">Task Title</label>
             <textarea
               className="w-full border border-gray-300 p-2 rounded-lg"
               rows={2}
               value={task.title}
               onChange={(e) => setTask({ ...task, title: e.target.value })}
               required
             />
           </div>
       
           {/* Task Description */}
           <div>
             <label className="block font-medium">Task Description</label>
             <textarea
               className="w-full border border-gray-300 p-2 rounded-lg"
               rows={4}
               value={task.description}
               onChange={(e) => setTask({ ...task, description: e.target.value })}
               required
             />
           </div>
       
           {/* Deadline */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block font-medium">Deadline (Date)</label>
               <input
                 type="date"
                 className="w-full border border-gray-300 p-2 rounded-lg"
                 value={task.deadline}
                 onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                 required
               />
             </div>
             <div>
               <label className="block font-medium">Deadline (Time)</label>
               <input
                 type="time"
                 className="w-full border border-gray-300 p-2 rounded-lg"
                 value={task.time || ""}
                 onChange={(e) => setTask({ ...task, time: e.target.value })}
                 required
               />
             </div>
           </div>
       
           {/* Marks and Weightage */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block font-medium">Marks</label>
               <input
                 type="number"
                 className="w-full border border-gray-300 p-2 rounded-lg"
                 value={task.marks}
                 onChange={(e) => setTask({ ...task, marks: parseInt(e.target.value) })}
                 required
               />
             </div>
             <div>
               <label className="block font-medium">Weightage (%)</label>
               <input
                 type="number"
                 className="w-full border border-gray-300 p-2 rounded-lg"
                 value={task.weightage}
                 onChange={(e) =>
                   setTask({ ...task, weightage: parseInt(e.target.value) })
                 }
                 required
               />
             </div>
           </div>
       
           {/* Assign Students */}
           <div>
             <label className="block font-medium mb-2">Assign to:</label>
             <div className="space-y-2">
               {student.length === 0 ? (
                 <p>No students available</p>
               ) : (
                 <>
                   {student.map((student) => (
                     <div key={student._id} className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         id={`student-${student._id}`}
                         value={student._id}
                         checked={task.assignedStudents.includes(student._id)}
                         onChange={(e) =>
                           handleCheckboxChange(student._id, e.target.checked)
                         }
                         className="form-checkbox"
                       />
                       <label htmlFor={`student-${student._id}`} className="text-sm">
                         {student.registrationNumber}
                       </label>
                     </div>
                   ))}
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="select-all"
                       onChange={(e) => handleSelectAll(e.target.checked)}
                       className="form-checkbox"
                     />
                     <label htmlFor="select-all" className="text-sm">
                       All
                     </label>
                   </div>
                 </>
               )}
             </div>
           </div>
       
           {/* Submit Button */}
           <button
             type="submit"
             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
           >
             Assign Task
           </button>
         </form>
       </div>
       
       )}
      {/* Classwork: Display Tasks Assigned by Faculty */}
      {activeTab === "classwork" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-green-600 font-semibold mb-4">Assigned Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li
                  key={task._id}
                  onClick={() => handleTaskClick(task._id!)}
                  className="p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium text-green-600 hover:underline">Task {index + 1}</p>
                  <p> <strong>Title:</strong> {task.title}</p>

                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    {/* Students: Display Enrolled Students */}
    {activeTab === "students" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-green-600 font-semibold mb-4">Enrolled Students</h2>
          {student.length === 0 ? (
            <p>No students are enrolled in this internship.</p>
          ) : (
            <ul className="space-y-2">
            {student.map((student) => (
              <li
                key={student._id}
                onClick={() => openModal(student)}
                className="cursor-pointer hover:text-green-700 mb-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
              >
                <p className="font-medium">
                  <strong>{student.name}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Department:</strong> {student.department}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Batch:</strong> {student.batch}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Section:</strong> {student.section}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Did Internship:</strong> {student.didInternship ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Registration Number:</strong> {student.registrationNumber}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {student.email}
                </p>
              </li>
            ))}
          </ul>
          )}
        </div>
      )}

  {isModalOpen && selectedStudent && (
  <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="modal-content bg-white p-6 rounded-lg shadow-lg relative max-w-3xl w-full">
      {/* Close Button */}
      <button
        onClick={closeModal}
        aria-label="Close modal"
        className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-red-600"
      >
        &times;
      </button>

      {/* Modal Title */}
      <h2 className="text-2xl font-semibold mb-4 text-green-600 border-b-2 border-green-600 pb-2">
        {selectedStudent.name}'s Grade Report
      </h2>

      <div className="border p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Student Internship Involvement</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
          <th className="border border-gray-300 px-4 py-2">Task No</th>
            <th className="border border-gray-300 px-4 py-2">Task Title</th>
            <th className="border border-gray-300 px-4 py-2">Total Marks</th>
            <th className="border border-gray-300 px-4 py-2">Obtained Marks</th>
          </tr>
        </thead>
        <tbody>
          {involvement.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{index+1}</td>
              <td className="border border-gray-300 px-4 py-2">{row.taskTitle}</td>
              <td className="border border-gray-300 px-4 py-2">{row.totalMarks}</td>
              <td className="border border-gray-300 px-4 py-2">{row.obtainedMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

     
    </div>
  </div>
)}

    </div>

    </FacultyLayout>
    );
};

export default InternshipDetails;
