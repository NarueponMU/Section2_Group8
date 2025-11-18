'use client';
import Image from "next/image";
import Link from "next/link";

// รูปภาพสมาชิก (import จาก public folder)
import potae from "../../public/images/contact/potae.png";
import Babu from "../../public/images/contact/Toy.jpg";
import ton from "../../public/images/contact/Ton.jpg";
import toy from "../../public/images/contact/babukub.jpg";

import { useState, useEffect } from "react";
import LoadingScene from "../components/loadingScene";

// External CSS ไฟล์ contact.css
import "../style/contact.css";

export default function Contact() {

  // ============================
  // รายชื่อสมาชิก Contact
  // ============================
  const contacts = [
    { id: 6787023, name: "Nattakit Kiewchaum", ig: "t.ntk", img: potae },
    { id: 6787040, name: "Naruepon Santipapchai", ig: "naruepon_ton", img: ton },
    { id: 6787045, name: "Phumat Kodsila", ig: "bbabu_pk", img: toy },
    { id: 6787068, name: "Thanamet Datharach", ig: "thaa_daaa", img: Babu },
  ];

  // ============================
  // Loading State (fake loading 0.5s)
  // ============================
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ⏳ แสดงหน้าโหลดก่อน
  if (loading) return <LoadingScene />;

  return (
    <section className="bg-gray-50 flex items-center justify-center p-5 contact-section">
      
      {/* Layout: Grid สมาชิก*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ml-5 mr-5 contact-grid">

        {/* Loop แสดงสมาชิกแต่ละคน */}
        {contacts.map((contact) => (
          
          <div 
            key={contact.id} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden contact-card"
          >

            {/* รูปสมาชิก (หมุนได้เมื่อ Hover) */}
            <Image
              src={contact.img}
              alt={contact.name}
              width={600}
              height={600}
              className="object-cover bg-gray-200 transition-transform duration-[15000ms] hover:rotate-[7200deg] hover:scale-105 cursor-pointer contact-img"
            />

            {/* กล่องข้อมูลสมาชิก */}
            <div className="p-5 text-center flex flex-col items-center gap-3 contact-info">
              
              {/* ชื่อสมาชิก */}
              <h4 className="text-lg font-semibold text-gray-800 contact-name">
                {contact.name}
              </h4>

              {/* ปุ่ม Instagram */}
              <Link
                href={`https://instagram.com/${contact.ig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 contact-ig"
              >
                {/* ไอคอน IG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>

                {/* IG username */}
                <span className="font-medium">@{contact.ig}</span>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
