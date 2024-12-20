import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from 'react';



function Signup() {

  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || ""; // Get email from state or fallback to an empty string
  //location.state is where you can pass data when navigating between pages using useNavigate() or <Link>.
  const [email, setEmail] = useState(prefilledEmail); // Initialize email with the prefilled value


 {/* to store data from input in browser */}
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
   {/* to store the submitted data in database */}
  const onSubmit=async(data) => {
    {/* left side the name from backend ,right side from frontend */}

    const userInfo={
      username:data.username,
      email:data.email,
      password:data.password,
    }


    try { {/* do post req to backend and give these value fron userInfo like postman */}
      const res = await axios.post("/api/auth/signup", userInfo);
      console.log(res.data)
      if (res.data) {
        toast.success("Signup Successful! Check your email for the verification code.");
       //to save the created user in local storage of browser
       //stringify to show the user data as json format otherweise it only shows objects
        localStorage.setItem("Users",JSON.stringify(res.data.createdNewUser));
        navigate("/verify-email"); // Redirect to the email verification page

      }
    } catch (err) {
      if (err.response) {
        console.log(err)
        toast.error("Signup unsuccessful: " + err.response.data.message);
         {/* this message is in backend signup definded by us */}
      } else {
        toast.error("An unexpected error occurred.");
      }
    }

  }




  return (
    <>
    <div className="bg-[url('background.jpg')] bg-cover bg-center h-screen ">
    <div className='flex h-screen items-center justify-center border shadow-md  '>
    <div  className=" border shadow-xl rounded-xl p-5 bg-slate-100 ">
    <div className=" ">
  

    <form onSubmit={handleSubmit(onSubmit)} method="dialog">
      {/* if there is a ✕ button in form, it will close the modal or go to /route homeroute */}
      
      <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute md:right-60 lg:right-96 xl:right-2 right-12 top xl:top-2 bg-slate-100">✕
      </Link>
      <h3 className="font-bold text-2xl">Signup</h3>


      <div className='mt-4 space-y-2 py-1'>
      <span>Username</span>
      <br />
      <input type='text' placeholder='Please enter Username' className='w-80 px-10 py-3 border rounded-md outline-none'
      {...register("username", { required: true })}/>
      <br />
      {errors.username && <span className='text-sm text-red-500'>This field is required</span>}
      </div>


     <div className='mt-4 space-y-2 py-1'>
     <span>Email</span>
     <br />
     <input type='email' placeholder='Please enter your Email' className='w-80 px-10 py-3 border rounded-md outline-none'
     {...register("email", { required: true })}
     value={email} // Prefill the input
     onChange={(e) => setEmail(e.target.value)} // Update state when user types
     />
     <br />
     {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
     </div>


    <div className='mt-4 space-y-2 py-1'>
     <span>Password</span>
     <br />
     <input type='password' placeholder='Please enter your Password' className='w-80 px-10 py-3 border rounded-md outline-none'
     {...register("password", { required: true })}/>
     <br />
     {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
     </div>

 
     {/* Button */}
     
      <div className='flex justify-around mt-4'>
        <button className="btn btn-error  text-white hover:text-black  ">Signup
        </button>
      </div>
      
    </form>


    
      </div>
      </div>
      </div>
      </div>
    </>
  )
}

export default Signup
