import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the product")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs sm:text-sm md:text-base uppercase text-gray-700">
            <tr>
              <th className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">Name</th>
              <th className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">Price</th>
              <th className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">SKU</th>
              <th className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">${product.price}</td>
                  <td className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">{product.sku}</td>
                  <td className="py-1 px-1 sm:px-2 sm:py-2 md:px-4 md:py-3">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-1 py-1 sm:px-2 sm:py-1 md:px-2 md:py-1 rounded mr-1 sm:mr-2 md:mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-1 py-1 sm:px-2 sm:py-1 md:px-2 md:py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6 text-center">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;