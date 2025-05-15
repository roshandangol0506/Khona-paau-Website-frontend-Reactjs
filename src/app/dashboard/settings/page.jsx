"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [generalSetting, setGeneralSetting] = useState({
    name: "",
    subtitle: "",
    description: "",
    currency: "",
    timezone: "",
    maintenance_mode: false,
  });
  const [adminprofile, setAdminProfile] = useState({
    name: "",
    username: "",
    email: "",
    phoneno: "",
  });
  const [securitySetting, setSecuritySetting] = useState({
    currentPassword: "",
    newPassword: "",
    conformNewPassword: "",
    twoFactorialAuthentication: false,
    sessionManagement: "never",
  });
  const [logoPreview, setlogoPreview] = useState(null);
  const [logo, setlogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState("general");
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    setSuccess(false);

    // Simulate API call
    console.log("tabvalue hai", tabValue);

    setLoading(false);
    setSuccess(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleSubmitGeneralSetting = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (!generalSetting.name) {
        throw new Error("Name is required");
      }

      const generalData = new FormData();
      generalData.append("name", generalSetting.name);
      generalData.append("subtitle", generalSetting.subtitle);
      generalData.append("description", generalSetting.description);
      generalData.append("currency", generalSetting.currency);
      generalData.append("timezone", generalSetting.timezone);
      generalData.append("maintenance_mode", generalSetting.maintenance_mode);

      if (logo) {
        generalData.append("logo", logo);
      }

      const response = await fetch(`http://localhost:8001/editgeneralsetting`, {
        method: "POST",
        credentials: "include",
        body: generalData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update General Setting");
      }

      router.push("/dashboard/settings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSuccess(true);
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleSubmitAdminProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (
        !adminprofile.name ||
        !adminprofile.username ||
        !adminprofile.email ||
        !adminprofile.phoneno
      ) {
        throw new Error("All fields are required");
      }

      const response = await fetch(`http://localhost:8001/user/editadmin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminprofile),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update Admin Profile");
      }

      router.push("/dashboard/settings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSuccess(true);
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!securitySetting.currentPassword) {
      setError("Current password is required");
      setLoading(false);
      return;
    }

    if (!securitySetting.newPassword) {
      setError("New password is required");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(securitySetting.newPassword)) {
      setError(
        "Password must be at least 8 characters long and include 1 special character and 1 digit"
      );
      setLoading(false);
      return;
    }

    if (securitySetting.newPassword !== securitySetting.conformNewPassword) {
      setError("New Passwords do not match with confirm new password");
      setLoading(false);
      return;
    }

    try {
      if (!securitySetting.currentPassword || !securitySetting.newPassword) {
        throw new Error("Current Password and New Password are required");
      }
      if (!securitySetting.sessionManagement) {
        throw new Error("Session Management is required");
      }

      const response = await fetch(
        `http://localhost:8001/user/changepassword`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(securitySetting),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update Admin Profile");
      }
      setSuccess(true); // ✅ only set success here when all is good
      router.push("/dashboard/settings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 3000);
  };

  const fetchGeneralSetting = async () => {
    try {
      const response = await fetch(`http://localhost:8001/generalsetting`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generalsetting = data.data;

      setGeneralSetting({
        name: generalsetting.name || "",
        subtitle: generalsetting.subtitle || "",
        description: generalsetting.description || "",
        currency: generalsetting.currency || "rs",
        timezone: generalsetting.timezone || "kathmandu",
        maintenance_mode: generalsetting.maintenance_mode ?? false,
      });

      if (generalsetting.logo) {
        setlogoPreview(`http://localhost:8001/logo/${generalsetting.logo}`);
      }
    } catch (error) {
      console.error("Error fetching General Setting:", error);
      setError("Failed to load General Setting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8001/user/getadmin`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const admin_profile = data.data;

      setAdminProfile({
        name: admin_profile.name || "",
        username: admin_profile.username || "",
        email: admin_profile.email || "",
        phoneno: admin_profile.phoneno || "",
      });

      setSecuritySetting({
        twoFactorialAuthentication:
          admin_profile.twoFactorialAuthentication ?? false,
        sessionManagement: admin_profile.sessionManagement ?? "never",
      });
    } catch (error) {
      console.error("Error fetching General Setting:", error);
      setError("Failed to load General Setting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneralSetting();
    fetchAdminProfile();
  }, []);

  const handleResetGeneralSetting = () => {
    setGeneralSetting({
      name: "Khona Paau",
      subtitle: "Discover Authentic Khokana Flavors",
      description:
        "Experience the taste of tradition with our handcrafted Titaura from Khokana's Women Group. Khona Paau enhances your shopping experience by making it effortless to purchase traditional products with just a few clicks.",
      currency: "rs",
      timezone: "kathmandu",
      maintenance_mode: false,
    });
  };

  const handleResetAdminProfile = () => {
    setAdminProfile({
      name: "Roshan Dangol",
      username: "roshan@gmail.com",
      email: "roshan@gmail.com",
      phoneno: "9864260404",
    });
  };

  const handleGeneralSettingChange = (e) => {
    const { name, value } = e.target;
    setGeneralSetting({
      ...generalSetting,
      [name]: value,
    });
  };

  const handleAdminProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile({
      ...adminprofile,
      [name]: value,
    });
  };

  const handleSecuritySettingChange = (e) => {
    const { name, value } = e.target;
    setSecuritySetting({
      ...securitySetting,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setlogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setlogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings {tabValue}</h1>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>
                Manage your store settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  name="name"
                  onChange={handleGeneralSettingChange}
                  value={generalSetting.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-subtitle">Store Subtitle</Label>
                <Input
                  id="store-subtitle"
                  name="subtitle"
                  onChange={handleGeneralSettingChange}
                  value={generalSetting.subtitle}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Store Description</Label>
                <Textarea
                  id="store-description"
                  name="description"
                  onChange={handleGeneralSettingChange}
                  value={generalSetting.description}
                  rows={4}
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center max-w-96">
                {logoPreview ? (
                  <div className="relative text-center">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="mx-auto max-h-[200px] object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => fileInputRef.current.click()} // 👈 trigger file input
                    >
                      {logo ? "Remove New Logo" : "Change Logo"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => fileInputRef.current.click()} // 👈 trigger file input
                    >
                      Select Image
                    </Button>
                  </div>
                )}

                {/* Hidden input (always available) */}
                <Input
                  ref={fileInputRef}
                  id="logp"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange} // 👈 your existing logic
                  className="hidden"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Store Preferences</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="currency" className="text-base">
                      Currency
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Set your store's default currency
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <select
                      id="currency"
                      name="currency"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      onChange={handleGeneralSettingChange}
                      value={generalSetting.currency}
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="rs">RS (रु)</option>
                      <option value="jyp">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="timezone" className="text-base">
                      Timezone
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Set your store's timezone
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <select
                      id="timezone"
                      name="timezone"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      onChange={handleGeneralSettingChange}
                      value={generalSetting.timezone}
                    >
                      <option value="australia">
                        Australia Time (UTC+10:00)
                      </option>
                      <option value="kathmandu">Kathmandu (UTC+05:45)</option>
                      <option value="america">
                        America Central Time (UTC-6)
                      </option>
                      <option value="india">India (UTC+5:30)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="text-base">
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Put your store in maintenance mode
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={generalSetting.maintenance_mode}
                    onCheckedChange={(checked) =>
                      setGeneralSetting({
                        ...generalSetting,
                        maintenance_mode: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleResetGeneralSetting} variant="outline">
                Reset
              </Button>
              <Button onClick={handleSubmitGeneralSetting} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  onChange={handleAdminProfileChange}
                  value={adminprofile.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="email"
                  name="username"
                  onChange={handleAdminProfileChange}
                  value={adminprofile.username}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleAdminProfileChange}
                  value={adminprofile.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phoneno"
                  type="tel"
                  name="phoneno"
                  onChange={handleAdminProfileChange}
                  value={adminprofile.phoneno}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleResetAdminProfile} variant="outline">
                Reset
              </Button>
              <Button onClick={handleSubmitAdminProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Change Password</h3>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    name="currentPassword"
                    onChange={handleSecuritySettingChange}
                    value={securitySetting.currentPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    name="newPassword"
                    onChange={handleSecuritySettingChange}
                    value={securitySetting.newPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    name="conformNewPassword"
                    onChange={handleSecuritySettingChange}
                    value={securitySetting.conformNewPassword}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor" className="text-base">
                      Enable Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={securitySetting.twoFactorialAuthentication}
                    onCheckedChange={(checked) =>
                      setSecuritySetting({
                        ...securitySetting,
                        twoFactorialAuthentication: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-logout" className="text-base">
                      Auto Logout
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <select
                      id="auto-logout"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      name="sessionManagement"
                      onChange={handleSecuritySettingChange}
                      value={securitySetting.sessionManagement}
                    >
                      <option value="never">Never</option>
                      <option value="15">After 15 minutes</option>
                      <option value="30">After 30 minutes</option>
                      <option value="60">After 1 hour</option>
                      <option value="120">After 2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSavePassword} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-md">
            Settings saved successfully!
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
      </Tabs>
    </div>
  );
}
