"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file.");
  
    setUploading(true);
  
    try {
      // Parse the Excel file to JSON
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      // Prepare form data to send with file
      const formData = new FormData();
      formData.append("file", file);
  
      // Attach the student data (jsonData) as JSON in the form data
      formData.append("students", JSON.stringify(jsonData));
  
      // Upload the formData
      const response = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error(`Failed to upload students: ${error.message}`);
      }
  
      alert("Data uploaded successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload data.");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Student Data</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadPage;
