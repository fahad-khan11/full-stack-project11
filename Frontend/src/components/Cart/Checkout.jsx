import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SadapayButton from "./SadapayButton";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Casual Sneakers",
      size: "42",
      color: "White",
      price: 75,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 195,
};

// Function to generate Easypaisa payment link
const generateEasypaisaPaymentLink = (phoneNumber, amount) => {
  return `https://easypaisa.com.pk/pay?phone=${phoneNumber}&amount=${amount}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAdress, setShippingAdress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const phoneNumber = "03406218617"; // Your Easypaisa number
  const paymentLink = generateEasypaisaPaymentLink(
    phoneNumber,
    cart.totalPrice
  );

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(123);
  };

  const handlePaymentSuccess = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left Side (Checkout Form) */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6 font-semibold">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4 font-medium">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={shippingAdress.email}
              onChange={(e) =>
                setShippingAdress({ ...shippingAdress, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                value={shippingAdress.firstName}
                onChange={(e) =>
                  setShippingAdress({
                    ...shippingAdress,
                    firstName: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                value={shippingAdress.lastName}
                onChange={(e) =>
                  setShippingAdress({
                    ...shippingAdress,
                    lastName: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              value={shippingAdress.address}
              onChange={(e) =>
                setShippingAdress({
                  ...shippingAdress,
                  address: e.target.value,
                })
              }
              type="text"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                value={shippingAdress.city}
                onChange={(e) =>
                  setShippingAdress({ ...shippingAdress, city: e.target.value })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                value={shippingAdress.postalCode}
                onChange={(e) =>
                  setShippingAdress({
                    ...shippingAdress,
                    postalCode: e.target.value,
                  })
                }
                type="text"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              value={shippingAdress.country}
              onChange={(e) =>
                setShippingAdress({
                  ...shippingAdress,
                  country: e.target.value,
                })
              }
              type="text"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              value={shippingAdress.phone}
              onChange={(e) =>
                setShippingAdress({ ...shippingAdress, phone: e.target.value })
              }
              type="tel"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="bg-black text-white py-3 rounded w-full"
              >
                Checkout
              </button>
            ) : (
              <div className="text-center">
                <h3 className="text-lg mb-4">Complete Your Payment</h3>
                {/* Easypaisa Payment Button */}
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-3 rounded w-full block text-center mb-4"
                >
                  Pay with Easypaisa
                </a>
               
                <button
                  onClick={handlePaymentSuccess}
                   className="bg-orange-500 text-white py-3 rounded w-full block
                text-center mb-4"
                >
                  I have paid
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Side (Order Summary) */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg mb-4">Order Summary</h3>
        {cart.products.map((product, index) => (
          <div key={index} className="flex justify-between pb-2 mb-2">
            <div className="flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 mr-4"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500 text-sm">
                  Size: {product.size}, Color: {product.color}
                </p>
              </div>
            </div>
            <p className="font-semibold">${product.price}</p>
          </div>
        ))}
        <div className="flex justify-between font-semibold items-center text-lg mt-4 border-t pt-4">
          <span>Total:</span>
          <span>${cart.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
