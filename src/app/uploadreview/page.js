"use client";
import React, { useState } from "react";

const UploadReviews = () => {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [profilepic, setprofilepic] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUploadReview = async () => {
    if (!name || !review || !profilepic) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("review", review);
    formData.append("profilepic", profilepic);

    try {
      const response = await fetch("http://localhost:8001/uploadreviewimages", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      setSuccess("Successfully uploaded review");
    } catch (error) {
      setError("Fiiled to upload review", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setprofilepic(e.target.files[0])} // Fix here
      />
      <button onClick={handleUploadReview}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default UploadReviews;
