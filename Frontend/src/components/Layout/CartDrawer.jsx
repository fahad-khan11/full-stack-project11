import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart, loading, error } = useSelector((state) => state.cart);
  const [localCart, setLocalCart] = useState(cart);

  const userId = user ? user._id : null;
  const location = useLocation();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (userId || guestId) {
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [dispatch, userId, guestId]);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching cart:", error);
    }
  }, [error]);

  const clearCart = () => {
    localStorage.removeItem("cart");
    console.log("Cart cleared!");
  };

  const handleCheckout = () => {
    clearCart();
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  const handleQuantityChange = (productId, quantity, size, color) => {
    const updatedCart = {
      ...localCart,
      products: localCart.products.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      ),
    };
    setLocalCart(updatedCart);
    dispatch(updateCartItemQuantity({ productId, quantity, guestId, userId, size, color }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        toggleCartDrawer();
      }
    };
    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerOpen) {
      toggleCartDrawer();
    }
  }, [location.pathname]);

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col pl-2 z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {loading ? (
          <p>Loading...</p>
        ) : localCart && localCart.products && localCart.products.length > 0 ? (
          <CartContents
            cart={localCart}
            userId={userId}
            guestId={guestId}
            onQuantityChange={handleQuantityChange}
          />
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="p-4 bg-white sticky bottom-0">
        {localCart && localCart?.products && localCart.products.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 text-center">
              Shipping, taxes, and discount codes calculated at checkout
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;