import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductTable from './ProductTable';
import ProductForm from './ProductFrom';
  // Now rendered in AdminPage

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddOrUpdateProduct = async (product) => {
        try {
            if (selectedProduct) {
                // Update product
                await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, product);
            } else {
                // Add new product
                await axios.post('http://localhost:5000/api/products', product);
            }
            setSelectedProduct(null);  // Clear the form
            fetchProducts();  // Reload product list
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);  // Pass the selected product to the form
    };

    return (
        <div>
            <h1>Admin Product Management</h1>
            <ProductForm selectedProduct={selectedProduct} onSubmit={handleAddOrUpdateProduct} />
            <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
        </div>
    );
};

export default AdminPage;
