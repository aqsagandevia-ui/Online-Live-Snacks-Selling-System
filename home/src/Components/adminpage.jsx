    import React from "react";
    export default function AdminPage(){
        return(
            <div>
                <h1>Admin page</h1><br></br>
                <a style={{fontSize:"40px",marginLeft:"400px"}}href="http://localhost:3003/">
                    <button style={{backgroundColor:"wheat",borderRadius:"5px"}}>User</button>
                </a><br></br>
                <br></br>
                <a style={{fontSize:"40px",marginLeft:"400px"}}href="http://localhost:3000/ProductForm">
                    <button style={{backgroundColor:"wheat",borderRadius:"5px"}}>Add Product</button>
                </a><br></br>
                <br></br>
            </div>
        )
    }

