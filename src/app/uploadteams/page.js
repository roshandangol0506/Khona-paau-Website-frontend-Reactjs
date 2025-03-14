"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const UploadTeamsPage = () => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [teamimages, setteamimages] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/checkAuth", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          router.push("/login");
        } else {
          setUser({
            userId: data.userId,
            username: data.username,
            email: data.email,
          });
          setIsLoading(false);
        }
      });
  }, [router]);

  const handleUploadTeam = async () => {
    if (!name || !profession || !teamimages) {
      setError("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("profession", profession);
    formData.append("teamimages", teamimages);

    try {
      const response = await fetch("http://localhost:8001/uploadteamimages", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      setSuccess("Successfully uploaded");
    } catch (error) {
      setError("Error uploading team:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

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
        placeholder="Enter Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setteamimages(e.target.files[0])} // Fix here
      />
      <button onClick={handleUploadTeam}>Submit</button>
      {user?.email}
      {user?.userId}
      {user?.username}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default UploadTeamsPage;
