"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import LoadingScene from "./loadingScene";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const goCoffee = () => router.push("/coffee");
  const goMenu = () => router.push("/menu");
  const goContact = () => router.push("/contact");
  const BackHome = () => router.push("/");
  const goSearch = () => router.push("/SearchPage");
  const loginClick = () => router.push("/login");

  const logoutClick = () => {
    if (typeof document !== "undefined") {
      document.cookie = "session=; max-age=0; path=/";
    }
    setIsLogin(false);
    setTimeout(() => router.push("/"), 800);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsLogin(document.cookie.includes("session"));
    }
  }, []);



  return (
    <div
      className="flex justify-between list-none  text-black sticky top-0 z-50 bg-[#fff2d8]"
    >
      {/* Desktop menu */}
      <div className="flex text-xl">
        <ul className="flex items-center hidden md:flex cursor-pointer">
          <li className="m-2 p-2 text-3xl font-bold" onClick={BackHome}>
            <Image
              src="/images/coffee_cof/logos.png"
              alt="logo"
              width={80}
              height={80}
            />
          </li>

          {/* ใช้ class 'nav-item' แทน hover:underline */}
          <li className="nav-item" onClick={BackHome}>Home</li>
          <li className="nav-item" onClick={goCoffee}>Coffee</li>
          <li className="nav-item" onClick={goMenu}>Menu</li>
          <li className="nav-item" onClick={goContact}>Contact</li>
        </ul>
      </div>

      <div className="flex hidden text-center md:flex items-center">
        <div
          className="flex items-center m-2 p-5 nav-item"
          onClick={goSearch}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl mr-2" />
          <span className="text-xl">Search</span>
        </div>

        {!isLogin ? (
          <li
            className="m-2 p-5 rounded-xl bg-black text-white hover:cursor-pointer text-xl"
            onClick={loginClick}
          >
            Login
          </li>
        ) : (
          <li
            className="m-2 p-5 rounded-xl bg-black text-white hover:cursor-pointer text-xl"
            onClick={logoutClick}
          >
            Logout
          </li>
        )}
      </div>
    </div>
  );
}
