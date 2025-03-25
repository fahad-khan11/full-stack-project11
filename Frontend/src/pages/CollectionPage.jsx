import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import ProductGrid from '../components/Products/ProductGrid';
import SortOption from './SortOption';
import { useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products); // Fixed state slice access
  const queryParams = Object.fromEntries([...searchParams]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  // Toggle Sidebar
  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close Sidebar When Clicking Outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Add Event Listener to Close Sidebar on Click Outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup Function to Remove Event Listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='flex flex-col lg:flex-row'>
      {/* Filter Button (Mobile) */}
      <button
        onClick={toggleSideBar}
        className='lg:hidden border p-2 flex justify-center items-center'
      >
        <FaFilter className='mr-2' />
        Filter
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
        lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* Product List */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Option */}
        <SortOption />
        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default CollectionPage;