import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const CartContents = ({ cart, userId, guestId }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.cart);

    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(updateCartItemQuantity({
                productId,
                quantity: newQuantity,
                guestId,
                userId,
                size,
                color
            }));
        }
    };

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(removeFromCart({ productId, guestId, userId, size, color }));
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : cart.products && cart.products.length > 0 ? (
                cart.products.map((product, index) => (
                    <div key={index} className='flex flex-col md:flex-row items-start py-4 border-b'>
                        <div className='flex items-start'>
                            <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4 rounded' />
                        </div>
                        <div className='flex-grow'>
                            <h3>{product.name}</h3>
                            <p className='text-sm text-gray-500'>
                                size: {product.size} | color: {product.color}
                            </p>
                            <div className='flex items-center mt-2'>
                                <button 
                                    onClick={() => handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)}
                                    className='border rounded px-2 py-1 text-xl font-medium'>-</button>
                                <span className='mx-4'>{product.quantity}</span>
                                <button 
                                    onClick={() => handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)}
                                    className='border rounded px-2 py-1 text-xl font-medium'>+</button>
                            </div>
                        </div>
                        <div className='flex flex-col items-end'>
                            <p className='font-medium'>${product.price.toLocaleString()}</p>
                            <button onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}>
                                <RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600' />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartContents;