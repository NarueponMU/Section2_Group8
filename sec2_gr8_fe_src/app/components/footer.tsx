'use client'
import Image from "next/image";
export default function Footer() {
  return (
    <footer className=" text-sm text-gray-700 mt-auto p-1 bg-[#fff2d8]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 py-2 px-2">
        <p>@ 59/9 Salakrang Bangkruai Nonthaburi 11130</p>
        <p>© 2025 All rights reserved</p>
        <Image
              src="/images/coffee_cof/logos.png"
              alt="logo"
              width={80}
              height={80}
              />
      </div>
    </footer>
  )
}
