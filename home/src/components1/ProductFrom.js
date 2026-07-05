import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductTable from './ProductTable';

const ProductForm = ({  onSubmit }) => {
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




    const [product, setProduct] = useState({ name: '', price: '', category: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setProduct(selectedProduct);  // Pre-fill form when editing
        } else {
            setProduct({ name: '', price: '', category: '' });  // Clear form when adding a new product
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(product);  // Call onSubmit with product details
        } else {
            console.error("onSubmit function is not defined");
        }
    };

    return (
        <>
            <h1>Add Product</h1><br /><br/>
            <center>
            <form onSubmit={handleSubmit}>
                <input name="name" value={product.name} onChange={handleChange} placeholder="Name" required /><br/><br/>
                <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" required /><br/><br/>
                <input name="category" value={product.category} onChange={handleChange} placeholder="Category" required /><br/>
                <button style={{width:"50%"}}type="submit">{selectedProduct ? 'Update' : 'Add'} Product</button>
            </form>
            </center>
            <br />
            <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
            <br /><br /><br /><br /><br />
        </>
    );
};

export default ProductForm;
