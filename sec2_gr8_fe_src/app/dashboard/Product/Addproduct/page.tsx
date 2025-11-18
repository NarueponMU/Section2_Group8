"use client";
import { Coffee } from 'lucide-react';
import React, { useRef, useState } from "react";
import "../../../style/addproduct.css";

export default function AddProductPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const API = "http://localhost:5050";

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    size: "",
    tasteNote: "",
    source: "",
    roastLevel: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<any>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!formData.productName || !formData.price) {
      alert("Please fill product name and price");
      return;
    }
    try {
      const resList = await fetch(`${API}/api/coffee`);
      const allProducts = await resList.json();
      const lastId = Math.max(...allProducts.map((p: any) => Number(p.Product_ID)));
      const newId = String(lastId + 1);

      const productData = {
        Product_ID: newId,
        Product_Name: formData.productName.trim(),
        Product_Source: formData.source.trim(),
        Roast_Level: formData.roastLevel || "M",
        Size: formData.size,
        Taste_Note: formData.tasteNote.trim(),
        Price_per_kg: Number(formData.price),
        Image_URL: imagePreview,
      };

      const res = await fetch(`${API}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Added Successfully!");
        handleCancel();
      } else {
        alert("Add Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Cannot connect to backend");
    }
  }

  function handleCancel() {
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
    <main className="flex min-h-screen w-full bg-gray-700 addproduct-page">

      <div className="w-80"></div>

      <section className="flex-2 p-5 flex flex-col addproduct-section">

        <header className="flex justify-between items-center mb-6 addproduct-header">
          <h1 className="text-white text-3xl ">Add Product</h1>
          <h2 className="text-white text-3xl ">Product Management</h2>
        </header>

        <hr className='mb-4 border-white' />

        <div className="bg-white rounded-3xl p-5 addproduct-container">
          <div className="flex gap-6">

            <form className="flex-1 bg-gray-300 rounded-2xl p-6 addproduct-form" onSubmit={(e) => e.preventDefault()}>
              <header className="flex items-center gap-3 mb-6">
                <div className="bg-black p-3 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Product Information</h3>
              </header>

              <fieldset className="mb-4">
                <legend className="block font-semibold mb-2">Product Name</legend>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter Product"
                  className="w-full px-4 py-3 rounded-lg bg-white border-0"
                />
              </fieldset>

              <fieldset className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <legend className="block font-semibold mb-2">Price</legend>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter Price"
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </div>
                <div>
                  <legend className="block font-semibold mb-2">Size</legend>
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
              </fieldset>

              <fieldset className="mb-4">
                <legend className="block font-semibold mb-2">Taste Note</legend>
                <textarea
                  name="tasteNote"
                  value={formData.tasteNote}
                  onChange={handleInputChange}
                  placeholder="Description Taste Note"
                  className="w-full px-4 py-3 rounded-lg bg-white border-0 h-24 resize-none"
                />
              </fieldset>

              <fieldset className="mb-4">
                <legend className="block font-semibold mb-2">Source</legend>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Origin"
                  className="w-full px-4 py-3 rounded-lg bg-white border-0"
                />
              </fieldset>

              <fieldset className="mb-4">
                <legend className="block font-semibold mb-2">Roast Level</legend>
                <select
                  name="roastLevel"
                  value={formData.roastLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border-0"
                >
                  <option value="">Select Roast Level</option>
                  <option value="L">Light</option>
                  <option value="M">Medium</option>
                  <option value="D">Dark</option>
                </select>
              </fieldset>
            </form>

            <aside className="w-96 flex flex-col addproduct-image-area">
              <section className="flex-1 bg-gray-300 rounded-2xl p-6 mb-4 flex items-center justify-center min-h-[400px] addproduct-image-preview">
                {imagePreview ? (
                  <img src={imagePreview} className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                  <p className="text-gray-500 text-center">Image Preview</p>
                )}
              </section>

              <footer className="flex flex-col gap-3">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-semibold">Image</span>
                  <label className="bg-white px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    Upload File
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    SAVE
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    CANCEL
                  </button>
                </div>
              </footer>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
