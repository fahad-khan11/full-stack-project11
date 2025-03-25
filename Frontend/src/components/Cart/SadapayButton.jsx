import React from "react";

const EasypaisaButton = ({ amount, onSuccess, onError }) => {
  const handleEasypaisaPayment = () => {
    const easypaisaPaymentLink = `https://easypaisa.com.pk/pay?phone=YOUR_PHONE_NUMBER&amount=${amount}`;

    // Simulating successful payment after redirection
    setTimeout(() => {
      onSuccess(); // Call the success callback after payment
    }, 3000);

    window.location.href = easypaisaPaymentLink;
  };

  return (
    <button
      onClick={handleEasypaisaPayment}
      className="w-full bg-green-500 text-white py-3 rounded shadow-md transition duration-300 hover:bg-green-700"
    >
      Pay with Easypaisa - ${amount}
    </button>
  );
};

export default EasypaisaButton;
