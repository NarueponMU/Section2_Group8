"use client";
import { Coffee } from 'lucide-react';
import React, { useRef, useState } from "react";
import "../../../style/deleteproduct.css";

export default function DeleteProductPage() {
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
    if (!productId) return alert("Please enter product ID");

    const res = await fetch(`${API}/api/coffee/${productId}`);

    if (!res.ok) return alert("Product not found");

    const data = await res.json();

    setFormData({
      productName: data.Product_Name,
      price: data.Price_per_kg,
      size: data.Size,
      tasteNote: data.Taste_Note,
      source: data.Product_Source,
      roastLevel: data.Roast_Level,
    });

    setImagePreview(data.Image_URL);

    alert("Product Loaded!");
  }

  async function handleDelete() {
    if (!productId) return alert("Please enter product ID");

    const ok = confirm(`Are you sure you want to delete product ID: ${productId}?`);
    if (!ok) return;

    const res = await fetch(`${API}/product/${productId}`, { method: "DELETE" });

    if (res.ok) {
      alert("Product Deleted!");
      handleCancel();
    } else {
      alert("Delete Failed");
    }
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
    <main className="flex min-h-screen w-full bg-gray-700 deleteproduct-page">

      <div className="w-80"></div>

      <section className="flex-2 p-5 flex flex-col deleteproduct-main">

        {/* Page Header */}
        <header className="flex justify-between items-center mb-6 deleteproduct-header">
          <h1 className="text-white text-3xl ">Delete Product</h1>
          <h2 className="text-white text-3xl ">Product Management</h2>
        </header>

        <hr className='mb-4 border-white' />

        {/* Delete Card */}
        <article className="bg-white rounded-3xl p-5 deleteproduct-card">
          <div className="flex gap-6">

            {/* LEFT COLUMN */}
            <section className="flex-1 bg-gray-300 rounded-2xl p-6 deleteproduct-form">

              {/* Load Product */}
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
                    type="button"
                    onClick={handleLoadProduct}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg"
                  >
                    LOAD
                  </button>
                </div>
              </div>

              {/* Title */}
              <header className="flex items-center gap-3 mb-6 deleteproduct-info-header">
                <div className="bg-black p-3 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">Product Information</span>
              </header>

              {/* Product Info Fields */}
              <form>
                <fieldset className="mb-4">
                  <legend className="sr-only">Product Name</legend>
                  <label className="block font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </fieldset>

                <fieldset className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <legend className="sr-only">Price</legend>
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    />
                  </div>

                  <div>
                    <legend className="sr-only">Size</legend>
                    <label className="block font-semibold mb-2">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-white border-0"
                    />
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="sr-only">Taste Note</legend>
                  <label className="block font-semibold mb-2">Taste Note</label>
                  <textarea
                    name="tasteNote"
                    value={formData.tasteNote}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white border-0 h-24 resize-none"
                  />
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="sr-only">Source</legend>
                  <label className="block font-semibold mb-2">Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="sr-only">Roast Level</legend>
                  <label className="block font-semibold mb-2">Roast Level</label>
                  <input
                    type="text"
                    name="roastLevel"
                    value={formData.roastLevel}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white border-0"
                  />
                </fieldset>
              </form>

            </section>

            {/* RIGHT COLUMN */}
            <section className="w-96 flex flex-col deleteproduct-image-area">

              <div className="flex-1 bg-gray-300 rounded-2xl p-6 mb-4 flex items-center justify-center min-h-[400px] deleteproduct-image-preview">
                {imagePreview ? (
                  <img src={imagePreview} className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                  <div className="text-gray-500 text-center">Image Preview</div>
                )}
              </div>

              <footer className="flex gap-3 deleteproduct-buttons">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  DELETE
                </button>

                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  CANCEL
                </button>
              </footer>

            </section>

          </div>
        </article>

      </section>
    </main>
  );
}
