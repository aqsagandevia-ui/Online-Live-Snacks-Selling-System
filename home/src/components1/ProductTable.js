// client/src/components/ProductTable.js
import React from 'react';

const ProductTable = ({ products = [], onEdit, onDelete }) => {

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                products.map((product) => (
                    <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                            <button onClick={() => onDelete(product._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>    
    );
};

export default ProductTable;
