import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, similarProducts as fetchSimilarProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice"; 

const ProductsDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId })); 
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both color and size.");
      return;
    }

    setIsButtonDisabled(true);
    toast.success("Item added to cart successfully!");

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage?.url === image.url ? "border-gray-800" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
            <div className="md:w-1/2">
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText || "Selected Product"}
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}
            </div>
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <p className="text-gray-600">{selectedProduct.description}</p>
              <div>
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(prevColor => (prevColor === color ? "" : color))}
                      className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Sizes:</h3>
                <div className="flex space-x-2 mt-2">
                  {selectedProduct.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(prevSize => (prevSize === size ? "" : size))}
                      className={`px-3 py-1 rounded border ${selectedSize === size ? "bg-black text-white" : "border-gray-400 text-black bg-gray-100"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-gray-700">Quantity:</h3>
                <div className="flex space-x-2 mt-2">
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
                  <span className="text-lg px-4">{quantity}</span>
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setQuantity(prev => prev + 1)}>+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className="py-2 px-6 rounded w-full mb-4 text-white bg-black" disabled={isButtonDisabled}>
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr><td className="pr-4 font-semibold">Brand</td><td>{selectedProduct.brand}</td></tr>
                    <tr><td className="pr-4 font-semibold">Material</td><td>{selectedProduct.material}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
            <ProductGrid products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDetail;
