"use client";
import React, { useState, useEffect } from "react";
import { Search, Coffee, Plus, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "../../style/productpage.css";

export default function ProductManagement() {
  const router = useRouter();

  const gotoAddProduct = () => router.push("/dashboard/Product/Addproduct");
  const gotoEditProduct = (id: string) =>
    router.push(`/dashboard/Product/Editproduct?id=${id}`);
  const gotoDeleteProduct = (id: string) =>
    router.push(`/dashboard/Product/Deleteproduct?id=${id}`);

  // state ตรงกับ DB
  const [searchForm, setSearchForm] = useState({
    Product_ID: "",
    Product_Name: "",
    Price_per_kg: "",
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดสินค้าทั้งหมด
  useEffect(() => {
    fetch("http://localhost:5050/api/coffee")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  //  UPDATE STATE ถูกต้อง
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SEARCH — map state → params backend
  const handleSearch = async () => {
    const params = new URLSearchParams();

    //  แปลง Product_ID → ตัวเลขก่อนส่ง
    if (searchForm.Product_ID.trim() !== "") {
      const cleanID = String(Number(searchForm.Product_ID.trim()));
      params.append("id", cleanID);
    }

    if (searchForm.Product_Name.trim() !== "")
      params.append("name", searchForm.Product_Name.trim());

    if (searchForm.Price_per_kg.trim() !== "")
      params.append("minPrice", searchForm.Price_per_kg.trim());

    const url = `http://localhost:5050/product/search?${params.toString()}`;

    console.log("ส่ง request:", url);

    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
  };


  return (
    <main className="flex min-h-screen w-full bg-gray-700 product-main">

      {/* Sidebar */}
      <aside className="w-80"></aside>

      {/* CONTENT หลัก */}
      <div className="flex-1 p-8 flex flex-col product-container">

        {/* Header */}
        <header className="product-header">
          <h2 className="text-white text-3xl mb-6">Product Management</h2>
          <hr className="mb-6 border-white" />
        </header>

        {/* WRAPPER : Search + Product List */}
        <section className="bg-white rounded-3xl p-8 flex-1 product-wrapper">

          {/* 🔍 SEARCH SECTION */}
          <section className="bg-gray-300 rounded-2xl p-6 mb-6 product-search-box">
            <header className="flex items-center gap-3 mb-6">
              <div className="bg-black p-3 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">Search</span>
            </header>

            {/* Search Inputs */}
            <div className="grid grid-cols-3 gap-4 mb-4">

              <input
                type="text"
                name="Product_ID"
                value={searchForm.Product_ID}
                onChange={handleSearchChange}
                placeholder="Product ID"
                className="w-full px-4 py-2 rounded-lg bg-white border-0 product-input"
              />

              <input
                type="text"
                name="Product_Name"
                value={searchForm.Product_Name}
                onChange={handleSearchChange}
                placeholder="Product Name"
                className="w-full px-4 py-2 rounded-lg bg-white border-0 product-input"
              />

              <input
                type="text"
                name="Price_per_kg"
                value={searchForm.Price_per_kg}
                onChange={handleSearchChange}
                placeholder="Price per kg"
                className="w-full px-4 py-2 rounded-lg bg-white border-0 product-input"
              />

            </div>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSearch}
                className="bg-black text-white px-8 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition product-search-btn"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </section>

          {/* PRODUCT LIST */}
          <section className="bg-gray-300 rounded-2xl p-6 product-list-box">

            {/* Title */}
            <header className="flex items-center gap-3 mb-6">
              <div className="bg-black p-3 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-xl">Product Information</span>
            </header>

            {/* === TABLE HEADER === */}
            <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b-2 border-gray-400 product-table-header">
              <div className="col-span-2 font-semibold">Image</div>
              <div className="col-span-3 font-semibold">Product ID</div>
              <div className="col-span-4 font-semibold">Product Name</div>
              <div className="col-span-2 font-semibold">Price (Baht)</div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={gotoAddProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 product-add-btn"
                >
                  <Plus className="w-4 h-4" />
                  ADD
                </button>
              </div>
            </div>

            {/* PRODUCT ROWS (<article>) */}
            {!loading && products.map((product, index) => (
              <article
                key={index}
                className="grid grid-cols-12 gap-4 py-4 border-b border-gray-400 items-center product-row"
              >
                <div className="col-span-2">
                  <img
                    src={product.Image_URL}
                    className="w-28 h-28 object-cover rounded-xl product-img"
                  />
                </div>

                <div className="col-span-3 text-gray-700">{product.Product_ID}</div>
                <div className="col-span-4 text-gray-700">{product.Product_Name}</div>
                <div className="col-span-2 text-gray-700">{product.Price_per_kg}</div>

                {/* Edit / Delete */}
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => gotoEditProduct(product.Product_ID)}
                    className="p-2 hover:bg-gray-400 rounded-lg transition product-edit-btn"
                  >
                    <Edit2 className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={() => gotoDeleteProduct(product.Product_ID)}
                    className="p-2 hover:bg-gray-400 rounded-lg transition product-delete-btn"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </article>
            ))}

            {/* No Products */}
            {!loading && products.length === 0 && (
              <div className="text-center py-4 text-gray-600 product-no-data">
                No products found.
              </div>
            )}
          </section>

        </section>
      </div>
    </main>
  );
}
