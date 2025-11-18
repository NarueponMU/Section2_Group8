"use client";
import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingScene from "./loadingScene";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPenToSquare,
  faTrash,
  faCircleUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const router = useRouter();
  const gotoHome = () => router.push('/');
  const gotoCoffee = () => router.push('/coffee');
  const gotoAddProduct = () => router.push('/dashboard/Product/Addproduct');
  const gotoEditProduct = () => router.push('/dashboard/Product');
  const gotoDeleteProduct = () => router.push('/dashboard/Product');
  const gotoProduct = () => router.push('/dashboard/Product');
  const gotoAddUser = () => router.push('/dashboard/User/Adduser');
  const gotoEditUser = () => router.push('/dashboard/User');
  const gotoDeleteUser = () => router.push('/dashboard/User');
  const gotoUser = () => router.push('/dashboard/User');


  return (
    <aside
      className="fixed left-2 top-2 bottom-2  w-[300px] rounded-lg bg-white"
      aria-label="Primary sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <button 
            onClick={gotoHome}
        className="flex items-center justify-center m-2">
          <Image
              src="/images/coffee_cof/logos.png"
              alt="logo"
              width={100}
              height={100}
              />
        </button>

        {/* Profile */}
        <section className="p-5 border-b border-gray-100" aria-labelledby="profile-heading">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faCircleUser} className="text-4xl text-gray-400" />
            <div>
              <h2 id="profile-heading" className="text-lg font-semibold text-gray-800">
                Admin
              </h2>
              <p className="text-sm text-gray-600">
                admin@coffee.com
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <div className="mt-4 mb-2">
          <div className="w-full bg-gray-800 text-white text-3xl text-center py-3">
            DASHBOARD
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 mt-4" aria-labelledby="main-navigation">
          {/* User Management */}
          <div className="space-y-2">
            <button 
                onClick={gotoUser}
            className="text-base font-semibold w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              User Account Management
            </button>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={gotoAddUser}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors">
                  <FontAwesomeIcon icon={faSquarePlus} className="text-green-500 w-4" />
                  <span className="text-sm text-gray-700">Add User Account</span>
                </button>
              </li>
              <li>
                <button 
                    onClick={gotoEditUser}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors">
                  <FontAwesomeIcon icon={faPenToSquare} className="text-blue-500 w-4" />
                  <span className="text-sm text-gray-700">Edit User Account</span>
                </button>
              </li>
              <li>
                <button 
                    onClick={gotoDeleteUser}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="text-red-500 w-4" />
                  <span className="text-sm text-gray-700">Delete User Account</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Product Management */}
          <div className="space-y-2 mt-3">
            <button 
                onClick={gotoProduct}
                className="text-base font-semibold w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
              Product Management
            </button>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={gotoAddProduct}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faSquarePlus} className="text-green-500 w-4" />
                  <span className="text-sm text-gray-700">Add Product/Service</span>
                </button>
              </li>
              <li>
                <button 
                    onClick={gotoEditProduct}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors">
                  <FontAwesomeIcon icon={faPenToSquare} className="text-blue-500 w-4" />
                  <span className="text-sm text-gray-700">Edit Product/Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={gotoDeleteProduct}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-red-500 w-4" />
                  <span className="text-sm text-gray-700">Delete Product/Service</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100">
          <button onClick={gotoCoffee} className="w-full py-3 text-3xl font-semibold text-gray-800 hover:text-red-600 transition-colors">
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
}