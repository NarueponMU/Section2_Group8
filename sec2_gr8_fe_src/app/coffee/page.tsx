"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingScene from "../components/loadingScene";
import Image from "next/image";
import "../style/coffee.css";

interface Product {
  Product_ID: string;
  Product_Name: string;
  Product_Source: string;
  Roast_Level: string;
  Size: string;
  Price_per_kg: number;
  Image_URL: string | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/coffee`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load products");

        const data: Product[] = await res.json();
        data.sort((a, b) => a.Product_Name.localeCompare(b.Product_Name));
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API]);

  if (loading) return <LoadingScene />;

  const purchasePage = (id: string) => {
    router.push(`/coffee/${id}`);
  };

  return (
    <div className="min-h-screen py-8 px-6">
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found 😢</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {products.map((item) => (
            <article
              key={item.Product_ID}
              onClick={() => purchasePage(item.Product_ID)}
              className="w-full max-w-sm bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer coffee-card"
            >
              <div className="flex flex-col">

                {item.Image_URL ? (
                  <Image
                    src={item.Image_URL}
                    alt={item.Product_Name}
                    width={500}
                    height={600}
                    className="rounded-t-lg object-cover w-full coffee-image"
                    unoptimized
                  />
                ) : (
                  <div className="rounded-t-lg bg-gray-300 w-full h-[300px] flex items-center justify-center text-gray-600 coffee-image-placeholder">
                    No Image
                  </div>
                )}

                <div className="px-4 py-4 coffee-info">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {item.Product_Name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 detail">
                    {item.Size} • From: {item.Product_Source} <br />
                    {item.Roast_Level} Roast
                  </p>
                  <div className="mt-3 text-right">
                    <p className="text-lg font-bold text-orange-600 coffee-price">
                      ฿{item.Price_per_kg}
                    </p>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
