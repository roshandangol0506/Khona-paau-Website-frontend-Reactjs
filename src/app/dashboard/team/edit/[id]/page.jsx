"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`http://localhost:8001/team/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const member = data.data;

        setFormData({
          name: member.name || "",
          profession: member.profession || "",
        });

        if (member.teamimage) {
          setPhotoPreview(`http://localhost:8001/uploads/${member.teamimage}`);
        }
      } catch (error) {
        console.error("Error fetching team member:", error);
        setError("Failed to load team member data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name) {
        throw new Error("Name is required");
      }

      // Create form data for file upload
      const teamData = new FormData();
      teamData.append("name", formData.name);
      teamData.append("profession", formData.profession);

      // Only append photo if a new one was selected
      if (photo) {
        teamData.append("photo", photo);
      }

      // Send to API
      const response = await fetch(`http://localhost:8001/editteam/${id}`, {
        method: "PUT",
        credentials: "include",
        body: teamData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update team member");
      }

      // Redirect to team page on success
      router.push("/dashboard/team");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading team member data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/team" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Team Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team member name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Enter profession or role"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Team member preview"
                    className="mx-auto max-h-[200px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setPhoto(null);
                      // Only clear preview if it's not from the server
                      if (!photoPreview.includes("http://localhost:8001")) {
                        setPhotoPreview(null);
                      }
                    }}
                  >
                    {photo ? "Remove New Image" : "Change Image"}
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("photo").click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/team")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating Team Member..." : "Update Team Member"}
          </Button>
        </div>
      </form>
    </div>
  );
}
