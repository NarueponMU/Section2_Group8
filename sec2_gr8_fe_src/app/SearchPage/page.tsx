"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingScene from "../components/loadingScene";
import "../style/searchpage.css";   // ✅ External CSS

// ===============================
// 🔎 Search Coffee Page (Semantic + Comments)
// ===============================
export default function SearchPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  // --- State สำหรับฟอร์มค้นหา ---
  const [productName, setProductName] = useState("");
  const [roast, setRoast] = useState("all");
  const [source, setSource] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  // --- State สำหรับผลลัพธ์ ---
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // ===============================
  // 🟦 เลือก Size แบบ checkbox
  // ===============================
  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  // ===============================
  // 🔍 กดปุ่ม Search
  // ===============================
  async function handleSearch() {
    setLoading(true);
    setShowResults(true);

    try {
      const params = new URLSearchParams();

      if (productName) params.append("name", productName);
      if (source) params.append("source", source);
      if (roast !== "all") params.append("roast", roast);
      if (sizes.length > 0) params.append("size", sizes.join(","));

      const url = `${API}/product/search?${params.toString()}`;
      console.log("FINAL SEARCH URL =", url);

      const res = await fetch(url);
      const data = await res.json();

      // Mapping result → Frontend UI structure
      const mapped = data.map((p: any) => ({
        id: p.Product_ID,
        title: p.Product_Name,
        price: `฿${p.Price_per_kg}`,
        img: p.Image_URL,
      }));

      setResults(mapped);
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen"> {/* ใช้ <main> เพื่อ semantic */}

      {/* Header Semantic */}
      <header className="text-center mt-10">
        <h1 className="font-bold text-7xl text-white">Search Coffee</h1>
      </header>

      {/* Search Form */}
      <section
        aria-labelledby="search-form"
        className="flex flex-col w-[90%] max-w-[1000px] mx-auto bg-white mt-10 mb-10 rounded-lg p-6 search-form"
      >
        <h2 id="search-form" className="sr-only">Search Form</h2>

        {/* Product Name */}
        <label className="mt-10 mb-2 text-xl block">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ex. Moonstones"
          className="p-4 bg-white border border-gray-200 rounded-lg w-full"
        />

        {/* Roast Level */}
        <label className="mt-4 mb-2 text-xl block">Roast Level</label>
        <select
          value={roast}
          onChange={(e) => setRoast(e.target.value)}
          className="p-4 bg-white border border-gray-200 rounded-lg w-full"
        >
          <option value="all">All Roast</option>
          <option value="D">Dark Roast</option>
          <option value="M">Medium Roast</option>
          <option value="L">Light Roast</option>
        </select>

        {/* Source */}
        <label className="mt-4 mb-2 text-xl block">Source</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Ex. Thailand, Japan"
          className="p-4 bg-white border border-gray-200 rounded-lg w-full"
        />

        {/* Size Filter */}
        <div className="flex flex-col md:flex-row justify-between mt-4 items-start md:items-center gap-4">
          <h2 className="text-xl">Size</h2>

          <div className="flex gap-6 mt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={sizes.includes("250 g")}
                onChange={() => toggleSize("250 g")}
              />
              <span>250 g</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={sizes.includes("500 g")}
                onChange={() => toggleSize("500 g")}
              />
              <span>500 g</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={sizes.includes("1 kg")}
                onChange={() => toggleSize("1 kg")}
              />
              <span>1 kg</span>
            </label>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="bg-black text-white p-4 rounded-lg w-full max-w-[600px] mt-7 search-button"
          >
            Search
          </button>
        </div>
      </section>

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center mt-10">
          <LoadingScene />
        </div>
      )}

      {/* Results */}
      {showResults && results.length > 0 && !loading && (
        <section
          aria-labelledby="search-results"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-20 mb-20 px-6 max-w-[1200px] mx-auto search-results"
        >
          <h2 id="search-results" className="sr-only">Search Results</h2>

          {results.map((r) => (
            <article
              key={r.id}
              className="w-full max-w-[320px] bg-white rounded-lg shadow cursor-pointer result-card"
              onClick={() => router.push(`/coffee/${r.id}`)}
            >
              <div className="m-5">
                <Image
                  src={
                    r.img
                      ? r.img.startsWith("http")
                        ? r.img
                        : r.img.startsWith("data:")
                        ? r.img
                        : `${API}${r.img.startsWith("/") ? r.img : "/" + r.img}`
                      : "/default.png"
                  }
                  alt={r.title}
                  width={300}
                  height={200}
                  className="rounded-md object-cover"
                />
              </div>

              <div className="flex justify-between items-center px-5 pb-5">
                <p className="text-lg font-medium">{r.title}</p>
                <p className="text-sm font-semibold">{r.price}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && !loading && (
        <p className="text-center text-gray-500 text-xl mb-10 no-results">
          No results found.
        </p>
      )}
    </main>
  );
}
