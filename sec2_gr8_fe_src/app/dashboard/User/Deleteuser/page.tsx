"use client";

import React, { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../../style/deleteuser.css"

export default function DeleteUserAccount() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  // รูปโปรไฟล์
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ฟอร์มข้อมูล
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

  // ==============================
  // 1) โหลดข้อมูลผู้ใช้
  // ==============================
  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  async function loadUser() {
    try {
      const res = await fetch(`${API}/api/users/search?userID=${userId}`);
      const data = await res.json();

      if (data.length === 0) {
        alert("User not found");
        return;
      }

      const u = data[0];

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

      // โหลดรูปจาก backend
      if (u.Profile_Image) {
        setImagePreview(u.Profile_Image);
      }
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  }

  // ==============================
  // 2) ลบผู้ใช้
  // ==============================
  async function handleDelete() {
    if (!userId) return alert("Missing user ID");

    try {
      const res = await fetch(`${API}/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert("Delete failed: " + data.message);
        return;
      }

      alert("User deleted successfully!");
      router.push("/dashboard/User");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Cannot connect to backend");
    }
  }

  // ==============================
  // 3) CANCEL
  // ==============================
  const handleCancel = () => {
    router.push("/dashboard/User");
  };

  // ==============================
  // 4) TYPE-SAFE: เปลี่ยนรูปโปรไฟล์
  // ==============================
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ==============================
  // 5) TYPE-SAFE: เปลี่ยนค่าฟอร์ม
  // ==============================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <main className="flex min-h-screen w-full bg-gray-700">
      {/* SIDEBAR */}
      <aside className="w-80"></aside>

      {/* CONTENT */}
      <section className="flex-1 p-8 flex flex-col">
        {/* PAGE HEADER */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl">Delete User Account</h1>
          <h2 className="text-white text-3xl">User Account Management</h2>
        </header>

        <hr className="mb-6 border-white" />

        {/* USER INFO CARD */}
        <article className="bg-white rounded-3xl p-8">
          <section className="bg-gray-300 rounded-2xl p-8">

            {/* Title */}
            <header className="flex items-center gap-3 mb-6">
              <div className="bg-black p-3 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl">User Information</h3>
            </header>

            {/* Profile Picture */}
            <figure className="flex justify-center mb-3">
              <div className="relative">
                <div className="w-60 h-60 rounded-full bg-indigo-400 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-white" />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </figure>

            <hr className="mb-6 border-gray-400" />

            {/* FORM */}
            <section className="grid grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-6">
                <label className="block font-semibold text-lg">
                  Firstname
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Date of Birth
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Phone Number
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Username
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <label className="block font-semibold text-lg">
                  Lastname
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Address
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0 h-64 resize-none"
                    readOnly
                  />
                </label>

                <label className="block font-semibold text-lg">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    readOnly
                  />
                </label>
              </div>
            </section>

            {/* BUTTONS */}
            <footer className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleDelete}
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-3 rounded-lg font-semibold transition"
              >
                DELETE
              </button>

              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-lg font-semibold transition"
              >
                CANCEL
              </button>
            </footer>
          </section>
        </article>
      </section>
    </main>
  );
}
