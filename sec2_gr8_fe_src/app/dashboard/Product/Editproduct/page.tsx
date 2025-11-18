"use client";
import { Coffee } from 'lucide-react';
import React, { useRef, useState } from "react";
import "../../../style/editproduct.css";

export default function EditProductPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const API = "http://localhost:5050";

  const [productId, setProductId] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    size: "",
    tasteNote: "",
    source: "",
    roastLevel: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleInputChange(e: any) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleLoadProduct() {
    if (!productId) return alert("Please enter Product ID");

    const res = await fetch(`${API}/api/coffee/${productId}`);
    if (!res.ok) return alert("Product not found.");

    const data = await res.json();
    setFormData({
      productName: data.Product_Name,
      price: String(data.Price_per_kg),
      size: data.Size,
      tasteNote: data.Taste_Note,
      source: data.Product_Source,
      roastLevel: data.Roast_Level,
    });

    setImagePreview(data.Image_URL);
    alert("Product Loaded!");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!productId) return alert("Please enter Product ID first.");

    const productData = {
      Product_Name: formData.productName.trim(),
      Product_Source: formData.source.trim(),
      Roast_Level: formData.roastLevel || "M",
      Size: formData.size,
      Taste_Note: formData.tasteNote.trim(),
      Price_per_kg: Number(formData.price),
      Image_URL: imagePreview,
    };

    const res = await fetch(`${API}/product/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const result = await res.json();

    if (res.ok) alert("Product Updated!");
    else alert("Update Failed: " + (result.message || "unknown error"));
  }

  function handleCancel() {
    setProductId("");
    setFormData({
      productName: "",
      price: "",
      size: "",
      tasteNote: "",
      source: "",
      roastLevel: "",
    });
    setImagePreview(null);
  }

  return (
    <main className="editproduct-page flex min-h-screen w-full bg-gray-700">
      <div className="w-80"></div>

      <section className="editproduct-content flex-2 p-5 flex flex-col">

        {/* HEADER */}
        <header className="editproduct-header flex justify-between items-center mb-6">
          <h1 className="text-white text-3xl">Editing Product</h1>
          <h2 className="text-white text-3xl">Product Management</h2>
        </header>

        <hr className='mb-4 border-white' />

        <article className="bg-white rounded-3xl p-5 editproduct-card">
          <div className="flex gap-6">

            {/* LEFT COLUMN */}
            <aside className="editproduct-left flex-1 bg-gray-300 rounded-2xl p-6">
              {/* LOAD PRODUCT */}
              <div className="mb-4">
                <label className="block font-semibold mb-2">Product ID</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={productId}
                    onChange={e => setProductId(e.target.value)}
                    placeholder="Enter Product ID"
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                  <button
                    onClick={handleLoadProduct}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg"
                  >
                    LOAD
                  </button>
                </div>
              </div>

              {/* ICON + TITLE */}
              <header className="flex items-center gap-3 mb-6">
                <div className="bg-black p-3 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">Product Information</span>
              </header>

              {/* FORM */}
              <form className="space-y-4 editproduct-form">
                <div>
                  <label className="block font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Size</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    >
                      <option value="">Select Size</option>
                      <option value="250g">250 g</option>
                      <option value="500g">500 g</option>
                      <option value="1kg">1 kg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Taste Note</label>
                  <textarea
                    name="tasteNote"
                    value={formData.tasteNote}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0 h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Roast Level</label>
                  <input
                    type="text"
                    name="roastLevel"
                    value={formData.roastLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </div>
              </form>
            </aside>

            {/* RIGHT COLUMN */}
            <aside className="editproduct-right w-96 flex flex-col">

              <section className="editproduct-image flex-1 bg-gray-300 rounded-2xl p-6 mb-4 flex items-center justify-center min-h-[400px]">
                {imagePreview ? (
                  <img src={imagePreview} className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                  <div className="text-gray-500 text-center">Image Preview</div>
                )}
              </section>

              <div className="flex items-center justify-between mb-6">
                <span className="font-semibold">Image</span>
                <label className="bg-white px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  Upload File
                </label>
              </div>

              <footer className="flex gap-3 editproduct-buttons">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  UPDATE
                </button>

                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  CANCEL
                </button>
              </footer>

            </aside>
          </div>
        </article>
      </section>
    </main>
  );
}
