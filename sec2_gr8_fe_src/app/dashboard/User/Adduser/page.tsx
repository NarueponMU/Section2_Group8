"use client";
import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';
import "../../../style/adduser.css";   // External CSS

export default function AddUserAccount() {

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    email: '',
    username: '',
    password: ''
  });

  // ============================
  // Upload Image
  // ============================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ============================
  // Input Change
  // ============================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ============================
  // Save User
  // ============================
  async function handleSave() {
    const API = "http://localhost:5050";

    const userData = {
      First_Name: formData.firstname.trim(),
      Last_Name: formData.lastname.trim(),
      Date_of_Birth: formData.dateOfBirth,
      Phone_Number: formData.phoneNumber.trim(),
      Address: formData.address.trim(),
      Email: formData.email.trim(),
      Username: formData.username.trim(),
      Password: formData.password.trim(),
      Profile_Image: imagePreview   // เพิ่มในกรณีต้องการเก็บรูป
    };

    try {
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Add failed: " + data.message);
        return;
      }

      alert(`User Added! New ID = ${data.User_ID}`);
      handleCancel();

    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  // ============================
  // Cancel
  // ============================
  const handleCancel = () => {
    setFormData({
      firstname: '',
      lastname: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      email: '',
      username: '',
      password: ''
    });
    setImagePreview(null);
  };

  return (
    <main className="adduser-page flex min-h-screen w-full bg-gray-700">

      {/* Sidebar */}
      <aside className="w-80"></aside>

      <section className="flex-1 p-8 flex flex-col adduser-container">

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl">Add User Account</h1>
          <h2 className="text-white text-3xl">User Account Management</h2>
        </header>

        <hr className="mb-6 border-white"/>

        <article className="bg-white rounded-3xl p-8 adduser-card">
          <section className="bg-gray-300 rounded-2xl p-8">

            {/* Section Header */}
            <header className="flex items-center gap-3 mb-4">
              <div className="bg-black p-3 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl">User Information</h3>
            </header>

            {/* Profile Image */}
            <section className="flex justify-center mb-3 adduser-image-section">
              <div className="relative">
                <div className="w-60 h-60 rounded-full bg-indigo-400 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-white" />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition image-upload-btn">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            <hr className="mb-6 border-gray-400" />

            {/* FORM */}
            <form className="grid grid-cols-2 gap-6" aria-label="Add User Form">

              {/* LEFT */}
              <div className="space-y-6">

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Firstname</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="ENTER FIRSTNAME"
                    className="adduser-input"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="adduser-input"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Phone number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="ENTER PHONE NUMBER"
                    className="adduser-input"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ENTER EMAIL"
                    className="adduser-input"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="ENTER USERNAME"
                    className="adduser-input"
                  />
                </fieldset>

              </div>

              {/* RIGHT */}
              <div className="space-y-6">

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Lastname</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="ENTER LASTNAME"
                    className="adduser-input"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="ENTER ADDRESS"
                    className="adduser-input h-64 resize-none"
                  />
                </fieldset>

                <fieldset>
                  <label className="block font-semibold mb-2 text-lg">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="ENTER PASSWORD"
                    className="adduser-input"
                  />
                </fieldset>

              </div>

            </form>

            {/* BUTTONS */}
            <footer className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={handleSave}
                className="adduser-btn-save"
              >
                SAVE
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="adduser-btn-cancel"
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
