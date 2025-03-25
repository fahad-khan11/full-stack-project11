import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, updateProduct } from "../../redux/slices/productSlice";
import axios from "axios";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-3">Edit Product</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-full">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              name="sizes"
              value={productData.sizes}
              onChange={(e) =>
                setProductData((prevData) => ({
                  ...prevData,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              name="colors"
              value={productData.colors}
              onChange={(e) =>
                setProductData((prevData) => ({
                  ...prevData,
                  colors: e.target.value.split(",").map((color) => color.trim()),
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            {uploading && <p>Uploading image...</p>}
            <div className="flex gap-4 mt-4 mb-3">
              {productData.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.url}
                    alt={image.altText || "Product Image"}
                    className="w-20 h-20 object-cover rounded-md shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;