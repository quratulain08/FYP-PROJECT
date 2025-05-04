"use client";
import React, { useState, useEffect } from "react";

interface Student {
  _id: string;
  name: string;
}

interface InternshipInvolvement {
  studentId: string;
  taskTitle: string;
  totalMarks: number;
  obtainedMarks: string | number;
}

interface GradeReportsProps {
  internshipId: string;
}

const GradeReports: React.FC<GradeReportsProps> = ({ internshipId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [involvement, setInvolvement] = useState<InternshipInvolvement[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(false);

        // 1) fetch students
        const resStudents = await fetch(`/api/studentsInInternship/${internshipId}`);
        if (!resStudents.ok) throw new Error("Failed to fetch students");
        const studentsData: Student[] = await resStudents.json();
        setStudents(studentsData);

        // 2) fetch each student's grade report and build involvement
        const allInvolvement: InternshipInvolvement[] = [];
        await Promise.all(
          studentsData.map(async (s) => {
            const resReport = await fetch(`/api/gradeReport/${internshipId}/${s._id}`);
            if (!resReport.ok) return; // skip if error
            const reportData = await resReport.json();
            const records: any[] = Array.isArray(reportData)
              ? reportData
              : Array.isArray(reportData.tasks)
              ? reportData.tasks
              : [];
            records.forEach((rec) =>
              allInvolvement.push({
                studentId: s._id,
                taskTitle: rec.taskTitle ?? rec.name,
                totalMarks: rec.totalMarks,
                obtainedMarks: rec.obtainedMarks,
              })
            );
          })
        );

        setInvolvement(allInvolvement);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [internshipId]);

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (isError) return <div className="text-center py-4 text-red-600">Error loading grade reports.</div>;
  if (students.length === 0) return <div className="text-center py-4">No students found for this internship.</div>;

  return (
    <div className="p-4">
      {students.map((student) => (
        <details
          key={student._id}
          className="mb-4 border rounded"
          onToggle={(e: React.SyntheticEvent<HTMLElement>) => {
            if ((e.target as HTMLDetailsElement).open) {
              setSelectedStudentId(student._id);
            }
          }}
        >
          <summary className="px-4 py-2 font-semibold bg-gray-100 cursor-pointer">
            {student.name}
          </summary>

          <table className="w-full table-auto mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Task</th>
                <th className="px-4 py-2 border">Max Marks</th>
                <th className="px-4 py-2 border">Obtained</th>
              </tr>
            </thead>
            <tbody>
              {involvement.filter(i => i.studentId === student._id).length > 0 ? (
                involvement
                  .filter(i => i.studentId === student._id)
                  .map((task, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border">{task.taskTitle}</td>
                      <td className="px-4 py-2 border">{task.totalMarks}</td>
                      <td className="px-4 py-2 border">{task.obtainedMarks}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 border text-center">
                    No tasks assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
};

export default GradeReports;