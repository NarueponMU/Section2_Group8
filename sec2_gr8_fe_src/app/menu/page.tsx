"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingScene from "../components/loadingScene";

// External CSS
import "../style/menu.css";

// ===== Import รูปเมนูทั้งหมด =====
import affogato from "../../public/images/coffeemenu/affogato.png";
import americano from "../../public/images/coffeemenu/americano.png";
import chocolate from "../../public/images/coffeemenu/chocolate.png";
import crmmlk from "../../public/images/coffeemenu/crmmlk.png";
import dirtydoff from "../../public/images/coffeemenu/dirtydoff.png";
import espresso from "../../public/images/coffeemenu/espresso.png";
import icapucino from "../../public/images/coffeemenu/icapucino.png";
import ilatte from "../../public/images/coffeemenu/ilatte.png";
import imocha from "../../public/images/coffeemenu/imocha.png";
import iorangeamericano from "../../public/images/coffeemenu/iorangeamericano.png";
import mtchlatte from "../../public/images/coffeemenu/mtchlatte.png";
import pnkmlk from "../../public/images/coffeemenu/pnkmlk.png";

import Image from "next/image";

export default function SearchPage() {
  const router = useRouter();

  // ===============================
  // Loading state (โชว์ animation)
  // ===============================
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScene />;

  // ===============================
  // รายการเมนูทั้งหมด (ชื่อ + รูป)
  // ===============================
  const menuItems = [
    { img: affogato, name: "Affogato" },
    { img: americano, name: "Americano" },
    { img: chocolate, name: "Chocolate" },
    { img: crmmlk, name: "Caramel Milk" },
    { img: dirtydoff, name: "Dirty" },
    { img: espresso, name: "Espresso" },
    { img: icapucino, name: "Cappuccino" },
    { img: ilatte, name: "Latte" },
    { img: imocha, name: "Mocha" },
    { img: iorangeamericano, name: "Orange Americano" },
    { img: mtchlatte, name: "Matcha Latte" },
    { img: pnkmlk, name: "Pink Milk" },
  ];

  return (
    //  main = โครงสร้างใหญ่ของหน้าเว็บ
    <main id="menu-page" className="min-h-screen">

      {/* ===============================
           ส่วนหัวของหน้าเมนู
      =============================== */}
      <header id="menu-header" className="menu-header">
        <h1 id="menu-title" className="menu-title">Menu</h1>
      </header>

      {/* ===============================
           ส่วนแสดงรายการเมนูทั้งหมด
      =============================== */}
      <section
        id="menu-section"
        aria-labelledby="menu-title"
        className="menu-grid"
      >
        {menuItems.map((item, index) => (
          <article
            key={index}
            id={`menu-item-${index}`}
            className="menu-card"
          >
            <div className="flex flex-col">

              {/*  รูปเมนู */}
              <Image
                src={item.img}
                alt={item.name}
                width={350}
                className="menu-img"
              />

              {/*  ชื่อเมนู */}
              <p className="menu-name">{item.name}</p>
            </div>
          </article>
        ))}
      </section>

    </main>
  );
}
