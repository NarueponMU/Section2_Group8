"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import "../../style/detailpage.css"; // External CSS
function LoadingScene() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-xl font-semibold text-gray-700">Loading...</div>
    </div>
  );
}

type Size = "200g" | "500g" | "1KG";

interface Product {
  Product_ID: string;
  Product_Name: string;
  Image_URL: string;
  Price_per_kg: number;
  Taste_Note: string;
  Product_Source: string;
  Roast_Level: string;
}

export default function DetailPage() {
  const { id } = useParams();
  const [favorite, setFavorite] = useState(false);
  const [size, setSize] = useState<Size>("200g");
  const [qty, setQty] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  useEffect(() => {
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/api/coffee/${productId}`);
        if (!res.ok) throw new Error("Failed to load product");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingScene />;
  if (!product)
    return (
      <div className="text-center py-20 text-gray-600">
        Product not found
      </div>
    );

  return (
    <main className="detailpage-main">

      {/* PRODUCT CARD */}
      <article className="detailpage-card">

        {/* PRODUCT IMAGE */}
        <figure className="detailpage-image-box">
          <button
            onClick={() => setFavorite((v) => !v)}
            className="detailpage-fav-btn"
            aria-label="Favorite Product"
          >
            {favorite ? "♥" : "♡"}
          </button>

          <img
            src={product.Image_URL}
            alt={product.Product_Name}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* =======================
          PRODUCT INFO
    ======================= */}
        <section className="flex flex-col justify-between gap-6">

          <header className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              {product.Product_Name}
            </h1>

            <p className="text-3xl font-bold text-orange-600 mt-4">
              ฿{product.Price_per_kg}
            </p>
          </header>

          {/* PRODUCT DETAILS */}
          <section className="text-gray-700 space-y-3">
            <p><strong>Taste Note:</strong> {product.Taste_Note}</p>
            <p><strong>Source:</strong> {product.Product_Source}</p>
            <p><strong>Roast Level:</strong> {product.Roast_Level}</p>
          </section>

          {/* SIZE PICKER */}
          <section>
            <h2 className="font-semibold text-lg mb-4">Size</h2>

            <div className="flex gap-3">
              {["200g", "500g", "1KG"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s as Size)}
                  className={`detailpage-size-btn ${size === s ? "detailpage-size-active" : ""
                    }`}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* QUANTITY */}
          <section className="flex items-center justify-center">
            <div className="detailpage-qty-box">

              <button
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                className="detailpage-qty-btn"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <div className="detailpage-qty-display" aria-live="polite">
                {qty}
              </div>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="detailpage-qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>
          </section>

          {/* BUY BUTTON */}
          <footer>
            <button
              onClick={() => {
                if (qty === 0) {
                  alert("⚠️ กรุณาเลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น");
                  return;
                }

                const total = product.Price_per_kg * qty;

                alert(
                  `🛒 ORDER SUMMARY\n\n` +
                  `สินค้า: ${product.Product_Name}\n` +
                  `ขนาด: ${size}\n` +
                  `จำนวน: ${qty}\n` +
                  `ราคาต่อหน่วย: ฿${product.Price_per_kg.toLocaleString()}\n` +
                  `----------------------------------\n` +
                  `รวมทั้งหมด: ฿${total.toLocaleString()}`
                );
              }}
              className="detailpage-buy-btn"
            >
              Buy Now
            </button>

          </footer>

        </section>
      </article>
    </main>
  );
}
