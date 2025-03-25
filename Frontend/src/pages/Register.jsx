import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.webp';
import { registerUser} from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const redirect = new URLSearchParams(location.search).get('redirect') ||  '/';
    const isCheckoutRedirect = redirect.includes('checkout');

    useEffect(() => {
        if (user) {
          if (cart?.products.length > 0 && guestId) {
            dispatch(mergeCart({ guestId, user })).then(() => {
              navigate(isCheckoutRedirect ? "/checkout" : "/");
            });
          } else {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          }
        }
      }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }));
    };

    return (
        <div className='flex '>
            {/* Left Side - Form */}
            <div className='w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12'>
                <form onSubmit={handleSubmit} className='w-full max-w-md bg-white rounded-lg border shadow-lg p-6'>
                    <div className='flex justify-center mb-6'>
                        <h2 className='text-xl font-medium'>FShop</h2>
                    </div>
                    <h2 className='text-2xl font-bold text-center mb-3'>Hey there! 👋</h2>
                    <p className='text-center mb-6 text-gray-600'>Enter your email password and name to Signup</p>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-1 text-gray-700'>Name</label>
                        <input type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className='w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            placeholder='Enter your name' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-1 text-gray-700'>Email</label>
                        <input type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className='w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            placeholder='Enter your email address' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-semibold mb-1 text-gray-700'>Password</label>
                        <input type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Enter your password' />
                    </div>

                    <button type="submit" className="w-full bg-black text-white p-3 font-semibold rounded-lg mt-4 hover:bg-gray-600 transition">
                        Sign Up
                    </button>
                    <p className='mt-6 text-center text-sm'>
                        Don't have an account?
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>login</Link>
                    </p>
                </form>
            </div>

            {/* Right Side - Image */}
            <div className='hidden md:block w-1/2'>
               <div className='h-full flex flex-col justify-center items-center'>
               <img src={register} alt="Login Image" className="w-full h-[600px] object-cover" />
               </div>
            </div>
        </div>
    )
}

export default Register;