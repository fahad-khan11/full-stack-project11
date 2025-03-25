import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
    if (loading) {
        console.log("Loading products:", products);
        return <p>Loading...</p>;
    }

    if (error) {
        console.log("Error loading products:", error);
        return <p>Error: {error}</p>;
    }

    if (!products || products.length === 0) {
        console.log("No products available to display.");
        return <p>No products available.</p>;
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1'>
            {products.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`}>
                    <div className='bg-white p-4 rounded-lg'>
                        <div className='w-full h-96 mb-4'>
                            <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.altText || product.name}
                                className='w-full h-full object-cover rounded-lg'
                            />
                        </div>
                        <h3 className='text-sm mb-2'>{product.name}</h3>
                        <p className='text-gray-500 font-medium text-sm tracking-tight'>${product.price}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;