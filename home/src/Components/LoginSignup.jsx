// import React, { useState, useEffect } from "react";
// import '../styles/LoginSignup.css';

// const LoginSignup = () => {
//   const initialValues = { username: "", email: "", password: "" };
//   const [formValues, setFormValues] = useState(initialValues);
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmit, setIsSubmit] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFormErrors(validate(formValues));
//     setIsSubmit(true);
//   };

//   useEffect(() => {
//     console.log(formErrors);
//     if (Object.keys(formErrors).length === 0 && isSubmit) {
//       console.log(formValues);
//     }
//   }, [formErrors]);
//   const validate = (values) => {
//     const errors = {};
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
//     if (!values.username) {
//       errors.username = "Username is required!";
//     }
//     if (!values.email) {
//       errors.email = "Email is required!";
//     } else if (!regex.test(values.email)) {
//       errors.email = "This is not a valid email format!";
//     }
//     if (!values.password) {
//       errors.password = "Password is required";
//     } else if (values.password.length < 4) {
//       errors.password = "Password must be more than 4 characters";
//     } else if (values.password.length > 10) {
//       errors.password = "Password cannot exceed more than 10 characters";
//     }
//     return errors;
//   };

//   return (
//     <div className="container">
//       {/*{Object.keys(formErrors).length === 0 && isSubmit ? (
//         <div className="ui message success">Signed in successfully</div>
//       ) : (
//         <pre>{JSON.stringify(formValues, undefined, 2)}</pre>
//       )}*/}

//       <form onSubmit={handleSubmit}>
//         <h1>Login Form</h1>
//         <div className="ui-divider"></div>
//         <div className="ui-form">
//           <div className="field">
//             <label>Username : </label> &nbsp;
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formValues.username}
//               onChange={handleChange}
//             />
//           </div>
//           <p style={{color:"red",fontSize:"25px",fontStyle:"bold"}}>{formErrors.username}</p>
//           <div className="field">
//             <label>Email : </label> &nbsp;
//             <input
//               type="text"
//               name="email"
//               placeholder="Email"
//               value={formValues.email}
//               onChange={handleChange}
//             />
//           </div>
//           <p style={{color:"red",fontSize:"25px",fontStyle:"bold"}}>{formErrors.email}</p>
//           <div className="field">
//             <label>Password : </label> &nbsp;
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formValues.password}
//               onChange={handleChange}
//             />
//           </div>
//           <p style={{color:"red",fontSize:"25px",fontStyle:"bold"}}>{formErrors.password}</p>
//           <button className="btn">Submit</button>
//         </div>
//       </form>
//     </div>
//   );
// }

//  export default LoginSignup;

import { Link } from 'react-router-dom';
import React, { useState ,useEffect} from "react";
import '../styles/LoginSignup.css';
 export default function  LoginSignup(){

       const initialvalues ={username:"",password:""};
       const [formvalues , setFrormvalues] =useState(initialvalues);
       const [formerrors , setFormerrors] =useState({});
       const [isSubmit ,setIsSubmit]=useState(false);
       const handleChange = (e) =>{
            const {name ,value}=e.target;
            setFrormvalues({ ...formvalues,[name]:value});
       }
       const handleSubmit =(e) =>{
        e.preventDefault();
        setFormerrors(validate(formvalues));
        setIsSubmit(true);
       }
       useEffect(()=>{
        console.log(formerrors);
        if(Object.keys(formerrors).lenght === 0 && isSubmit)
        {
            console.log(formvalues);
           <p>form submited</p>
        }
       })
       
       const validate =(values)=>{
        let Admin_name="aqsa";
        let Admin_password="aqsa1234";
        let flag=1;
            const errors ={}
            if(!values.username)
            {
                errors.username ="Username is required!";
                flag=0;
            }
            else
            {
                flag=1;
            }
            if(!values.password)
            {
                errors.password="Password is required!";
                flag=0;
            }
            else if(values.password.length < 8)
            {
                errors.password="Password must be more than 8 characters";
                flag=0;
            }
            else
            {
                flag=1;
            }

            if(values.username==Admin_name && values.password==Admin_password)
            {
                alert("Login successfull...");
                window.location.href = "/adminpage";
            }
            else if(flag==1)
            {
                alert("Login successfull...");
                 window.location.href = "/";
            }
            return errors 
            }
    return(
        <div className='container'>
            <br/><br/><br/><br/>
            <form onSubmit={handleSubmit}>      
            <div>
                <h1>Sign In!</h1>
                <p style={{color:"red"}}>Please Enter Data into Fields</p>
                <div>
                    <label>Username : </label> &nbsp;
                    <input type="text" name="username" placeholder="Username" style={{borderRadius:"20px",borderColor:"gray"}} value={formvalues.username} onChange={handleChange}/>
                    <p style={{color:"red"}}>{formerrors.username}</p>             
                    <label>Password : </label> &nbsp;
                    <input type="password" name="password" placeholder="Password" style={{borderRadius:"20px",borderColor:"grey"}} value={formvalues.password} onChange={handleChange}/>
                    <p style={{color:"red"}}>{formerrors.password}</p>             
                </div>
                <button style={{align:"right"}} className='btnsub'>Submit</button> 
                <Link to='/adminpage'><button className="btn">Log Out</button></Link>
                </div>
            </form>
            <br/><br/><br/><br/>
        </div>
    )
};