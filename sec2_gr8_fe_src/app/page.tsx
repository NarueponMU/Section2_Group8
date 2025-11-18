"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import shop from "../public/images/HomePage/About.png";
import americano from "../public/images/coffeemenu/americano.png";
import icaramelmac from "../public/images/HomePage/icaramelmac.png";
import promotion from "../public/images/HomePage/promotion.png";
import mtchlatte from "../public/images/HomePage/mtchlatte.png";


import "./style/home.css";
import LoadingScene from "./components/loadingScene";


const API = "http://localhost:5050"; // <<< FIXED URL (ไม่ใช้ env)

type CoffeeQuoteType = {
  quote: string;
  author: string;
  coffeeName: string;
  coffeeImage: string;
};

const localImageMap: any = {
  "Americano": americano,
  "Cappuccino": icaramelmac,
  "Matcha Latte": mtchlatte,
};

export default function Home() {
  const popularItems = [
    { id: 1, title: "Americano", desc: "A bold and aromatic black coffee made from 100% premium beans.", image: americano },
    { id: 2, title: "Cappuccino", desc: "A rich espresso blended with fresh milk and silky foam.", image: icaramelmac },
    { id: 3, title: "Matcha Latte", desc: "Japanese matcha mixed with creamy milk for a smooth earthy taste.", image: mtchlatte },
  ];

  const [loading, setLoading] = useState(true);
  const [coffeeQuote, setCoffeeQuote] = useState<CoffeeQuoteType | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const fetchCoffeeQuote = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/coffee-quote");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      const finalImage =
        localImageMap[data.coffeeName] !== undefined
          ? localImageMap[data.coffeeName]
          : data.coffeeImage;

      setCoffeeQuote({
        quote: data.quote,
        author: data.author,
        coffeeName: data.coffeeName,
        coffeeImage: finalImage,
      });

      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch quote:", err);

      setCoffeeQuote({
        quote: "Coffee is always a good idea.",
        author: "Anonymous",
        coffeeName: "Americano",
        coffeeImage: americano.src
      });

      setShowModal(true);
    }
  };

  if (loading) return <LoadingScene />;

  return (
    <main className="space-y-10">

      {/* ================== ABOUT SECTION ================== */}
      <section
        aria-labelledby="about-title"
        className="about-section"
      >
        <div className="flex flex-col lg:flex-row items-center gap-10">

          <figure className="lg:w-1/2 w-full">
            <Image
              src={shop}
              alt="Coffee shop interior"
              width={800}
              height={800}
              className="rounded-lg object-cover"
            />
          </figure>

          <article className="flex flex-col lg:w-1/2 text-justify">
            <header>
              <h1 id="about-title" className="text-5xl font-bold">About</h1>
              <p className="mt-5 text-2xl">
                DUDE TEE NHEE — Where Every Cup Comes with a Story
              </p>
            </header>

            <div className=" text-lg leading-relaxed space-y-6">
  <p>
    Our café was born from a deep passion for coffee, blended with our love for technology as ICT students.
    The idea began during countless late nights spent at cafés near our university,
    where we noticed that many of our friends also relied on coffee as a source of motivation for studying and working.
    That inspired us to create a small space that connects the flavor of coffee with the digital world.
  </p>

  <p>
    We started by exploring coffee beans and their origins, which inspired us to create an online platform that makes quality coffee more accessible.
    Using our ICT knowledge, we built everything from the website to backend systems.
  </p>

  <p>
    DUDE TEE NHEE represents our passion for connecting coffee with technology.
    Every bean is carefully selected and roasted with attention to taste and quality.
  </p>


</div>


            <Link
              href="/contact"
              className="text-2xl underline underline-offset-4 hover:text-blue-600 transition mt-4"
            >
              👥 Meet Our Teams
            </Link>
          </article>

        </div>
      </section>

      {/* ================== POPULAR SECTION ================== */}
      <section
        aria-labelledby="popular-title"
        className="ml-10 mr-10 max-w-8xl mx-auto px-20 py-20 rounded-lg bg-[#fff2d8]"
      >
        <h1 id="popular-title" className="text-5xl font-extrabold mb-8 text-black">
          Popular
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-10">
          {popularItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md flex-1 p-4 text-justify hover:shadow-5xl transition-transform transform hover:-translate-y-2 cursor-pointer"
            >
              <figure>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={400}
                  className="rounded-lg w-full h-auto object-cover"
                />
                <figcaption className="mt-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </section>

      {/* ================== PROMOTION SECTION ================== */}
      <section
        aria-labelledby="promotion-title"
        className="ml-10 mr-10 mb-10 max-w-8xl mx-auto px-20 py-20 rounded-lg bg-[#fff2d8]"
      >
        <h1 id="promotion-title" className="text-5xl font-extrabold mb-10 text-black">
          Promotion
        </h1>

        <figure>
          <Image
            alt="Promotion Banner"
            src={promotion}
            className="object-cover rounded-lg"
          />
        </figure>
      </section>

      {/* ================== COFFEE QUOTE BUTTON ================== */}
      <section className="ml-10 mr-10 mb-10 max-w-8xl mx-auto px-20 py-20 rounded-2xl bg-[#fff2d8] shadow-md border border-[#f5e4c6] text-center">
        <h1 className="text-4xl font-extrabold mb-8 text-[#5a3e2b] tracking-wide">
          ☕ Coffee Quote
        </h1>

        <button
          onClick={fetchCoffeeQuote}
          className="px-7 py-3 bg-gradient-to-r from-[#a06ee1] to-[#7b4dde] text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          ✨ Get Your Coffee Quote
        </button>
      </section>

      {/* ================== MODAL ================== */}
      {showModal && coffeeQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white rounded-2xl p-10 shadow-2xl max-w-lg w-full z-10 animate-[fadeIn_0.25s_ease-out]">
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black transition"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <p className="text-2xl mb-3 text-center text-[#4a3728] font-medium">
              "{coffeeQuote.quote}"
            </p>

            <p className="text-lg mb-6 font-light text-center text-[#7e6b5d]">
              — {coffeeQuote.author}
            </p>

            <h2 className="text-3xl font-semibold mb-4 text-center text-[#5a3e2b]">
              Recommended Coffee: {coffeeQuote.coffeeName}
            </h2>

            <Image
              src={coffeeQuote.coffeeImage}
              alt={coffeeQuote.coffeeName}
              width={300}
              height={300}
              className="rounded-xl mx-auto shadow-md"
            />
          </div>
        </div>
      )}
    </main>
  );
}
