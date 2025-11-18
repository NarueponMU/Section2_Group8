"use client";
import React, { useState, useEffect } from "react";
import { Search, User, Plus, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "../../style/userpage.css";   // ✅ External CSS

export default function UserManagement() {
  const router = useRouter();

  // ============================
  // Navigation functions
  // ============================
  const gotoAdduser = () => router.push("/dashboard/User/Adduser");
  const gotoEdituser = (id: string) =>
    router.push(`/dashboard/User/Edituser?id=${id}`);
  const gotoDeleteuser = (id: string) =>
    router.push(`/dashboard/User/Deleteuser?id=${id}`);

  // ============================
  // Search Form State
  // ============================
  const [searchForm, setSearchForm] = useState({
    userId: "",
    userName: "",
    email: "",
  });

  // ============================
  // Users data
  // ============================
  const [users, setUsers] = useState<any[]>([]);
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  // ============================
  // Load users on mount
  // ============================
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // ดึง Users ทั้งหมด
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Fetch users error:", err);
    }
  };

  // อัปเดตค่าฟอร์ม Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // กดปุ่ม Search → เรียก Backend
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();

      if (searchForm.userId.trim()) params.append("userID", searchForm.userId.trim());
      if (searchForm.userName.trim()) params.append("username", searchForm.userName.trim());
      if (searchForm.email.trim()) params.append("email", searchForm.email.trim());

      const res = await fetch(`${API}/api/users/search?${params.toString()}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Search error:", err);
    }
  };

  return (
    // ============================
    // MAIN LAYOUT
    // ============================
    <main className="flex min-h-screen w-full bg-gray-700 user-main">
      <aside className="w-80"></aside>

      <section className="flex-1 p-8 flex flex-col user-container">
        {/* HEADER */}
        <header className="user-header">
          <h2 className="text-white text-3xl mb-6">User Account Management</h2>
          <hr className="mb-6 border-white" />
        </header>

        {/* WRAPPER */}
        <section className="bg-white rounded-3xl p-8 flex-1 user-wrapper">

          {/* SEARCH AREA */}
          <section className="bg-gray-300 rounded-2xl p-6 mb-6 user-search-box">

            <header className="flex items-center gap-3 mb-6">
              <div className="bg-black p-3 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-xl">Search</span>
            </header>

            {/* Search Input Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">User ID</label>
                <input
                  type="text"
                  name="userId"
                  value={searchForm.userId}
                  onChange={handleSearchChange}
                  placeholder="User ID"
                  className="w-full px-4 py-2 rounded-lg bg-white border-0 user-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">UserName</label>
                <input
                  type="text"
                  name="userName"
                  value={searchForm.userName}
                  onChange={handleSearchChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg bg-white border-0 user-input"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="text"
                  name="email"
                  value={searchForm.email}
                  onChange={handleSearchChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-white border-0 user-input"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className="bg-black text-white px-8 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition user-search-btn"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </section>

          {/* Users Table */}
          <section className="bg-gray-300 rounded-2xl p-6 user-table-box">

            <header className="flex items-center gap-3 mb-6">
              <div className="bg-black p-3 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-xl">User Information</span>
            </header>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b-2 border-gray-400 user-table-header">
              <div className="col-span-2 font-semibold">User ID</div>
              <div className="col-span-2 font-semibold">UserName</div>
              <div className="col-span-3 font-semibold">Email</div>
              <div className="col-span-2 font-semibold">FirstName</div>
              <div className="col-span-1 font-semibold">LastName</div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={gotoAdduser}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition user-add-btn"
                >
                  <Plus className="w-4 h-4" /> ADD
                </button>
              </div>
            </div>

            {/* User Rows */}
            {users.map((u, index) => (
              <article
                key={index}
                className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-400 user-row"
              >
                <div className="col-span-2 text-gray-600">{u.User_ID}</div>
                <div className="col-span-2 text-gray-600">{u.Username}</div>
                <div className="col-span-3 text-gray-600">{u.Email}</div>
                <div className="col-span-2 text-gray-600">{u.First_Name}</div>
                <div className="col-span-1 text-gray-600">{u.Last_Name}</div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => gotoEdituser(u.User_ID)}
                    className="p-2 hover:bg-gray-400 rounded-lg transition user-edit-btn"
                  >
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={() => gotoDeleteuser(u.User_ID)}
                    className="p-2 hover:bg-gray-400 rounded-lg transition user-delete-btn"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </article>
            ))}

            {users.length === 0 && (
              <p className="text-center py-4 text-gray-600 user-no-results">
                No results found.
              </p>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
