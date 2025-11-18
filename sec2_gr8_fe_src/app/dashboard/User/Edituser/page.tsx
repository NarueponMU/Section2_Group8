"use client";

import React, { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../style/edituser.css"; // External CSS

export default function EditUserAccount() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  async function loadUser() {
    try {
      const res = await fetch(`${API}/api/users/${userId}`);
      if (!res.ok) {
        alert("User not found");
        return;
      }

      const u = await res.json();

      setFormData({
        firstname: u.First_Name || "",
        lastname: u.Last_Name || "",
        dateOfBirth: u.Date_of_Birth?.substring(0, 10) || "",
        phoneNumber: u.Phone_Number || "",
        address: u.Address || "",
        email: u.Email || "",
        username: u.Username || "",
        password: "",
      });

      setImagePreview(u.Profile_Image || null);
    } catch (err) {
      console.error("ERROR loading user:", err);
    }
  }

  async function handleSave() {
    if (!userId) return alert("Missing user ID");

    const bodyData = {
      First_Name: formData.firstname,
      Last_Name: formData.lastname,
      Date_of_Birth: formData.dateOfBirth,
      Phone_Number: formData.phoneNumber,
      Address: formData.address,
      Email: formData.email,
      Username: formData.username,
      Password: formData.password,
      Profile_Image: imagePreview,
    };

    try {
      const res = await fetch(`${API}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Update failed: " + data.message);
        return;
      }

      alert("User updated successfully!");
      router.push("/dashboard/User");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Cannot connect to backend");
    }
  }

  function handleCancel() {
    router.push("/dashboard/User");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="edituser-page">

      <aside className="w-80"></aside>

      <section className="flex-1 p-8 flex flex-col edituser-container">

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl">Edit User Account</h1>
          <h2 className="text-white text-3xl">User Account Management</h2>
        </header>

        <hr className="mb-6 border-white" />

        <article className="bg-white rounded-3xl p-8 edituser-card">

          <section className="bg-gray-300 rounded-2xl p-8 edituser-inner">

            <header className="flex items-center gap-3 mb-6 edituser-title">
              <div className="bg-black p-3 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl">User Information</h3>
            </header>

            <div className="flex justify-center mb-4 edituser-image-section">
              <div className="relative">
                <figure className="edituser-img-box">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-white" />
                  )}
                </figure>

                <label className="edituser-upload-btn">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <hr className="my-6 border-gray-400" />

            <section className="edituser-grid">

              <div className="space-y-6">
                <label className="block">
                  <span className="font-semibold text-lg">Firstname</span>
                  <input name="firstname" value={formData.firstname} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Date of Birth</span>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Phone Number</span>
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Email</span>
                  <input name="email" value={formData.email} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Username</span>
                  <input name="username" value={formData.username} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>
              </div>

              <div className="space-y-6">
                <label className="block">
                  <span className="font-semibold text-lg">Lastname</span>
                  <input name="lastname" value={formData.lastname} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Address</span>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className="edituser-textarea mt-2" />
                </label>

                <label className="block">
                  <span className="font-semibold text-lg">Password</span>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="edituser-input mt-2" />
                </label>
              </div>
            </section>

            <footer className="flex justify-center gap-4 mt-10">
              <button onClick={handleSave} className="edituser-btn-update">UPDATE</button>
              <button onClick={handleCancel} className="edituser-btn-cancel">CANCEL</button>
            </footer>

          </section>
        </article>

      </section>
    </main>
  );
}
