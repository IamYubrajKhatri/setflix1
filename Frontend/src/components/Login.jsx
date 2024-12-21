import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Login({onLoginSuccess}) {
  {/* to submit the form on browser hook form*/}
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit=async (data) => {
  const userInfoLogin={
    email:data.email,
    password:data.password
  }

try {
  const res = await axios.post("/api/auth/login",userInfoLogin,{
    withCredentials: true })// Enables sending/receiving cookies
    if(res.data){
      console.log(res.data)

      if(res.data.success){
        toast.success('Login Successfull!');
        onLoginSuccess(res.data.user); // Notify parent Navbar about logged-in user
         // Close the modal
         document.getElementById("my_modal_3").close();
         //then navigate
        navigate("/");
        localStorage.setItem("LoggedinUser",JSON.stringify(res.data.user));
      }
      

    }
} catch (err) {
  if(err.response){
    console.log(err)
    toast.error("Login unsuccessfull: "+ err.response.data.message);
    {/* this message is in backend signup definded by us */}
  }
}

  
}




  return (
    <>
      
      <div>
      <dialog id="my_modal_3" className="modal">
      <div className="modal-box">


      {/* to submit the form on browser hook form*/}
     <form onSubmit={handleSubmit(onSubmit)}  method="dialog">


      {/*  there is a button in form, it will close the modal */}
      <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> document.getElementById("my_modal_3").closest()}
      >✕</Link>
      <h3 className="font-bold text-lg">Login</h3>


      <div className='mt-4 space-y-2 py-1'>
      <span>Email</span>
      <br />
      <input type='email' placeholder='Please enter your Email' className='w-80 px-10 py-3 border rounded-md outline-none'
      {...register("email", { required: true })}/>
      <br />
      {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
      {/* to submit the form on browser hook form*/}
      </div>


     <div className='mt-4 space-y-2 py-1'>
     <span>Password</span>
     <br />
     <input type='password' placeholder='Please enter your Password' className='w-80 px-10 py-3 border rounded-md outline-none'
     {...register("password", { required: true })}/>
     <br />
     {errors.password && <span className='text-sm text-red-500'>This field is  required</span>}
     </div>


     {/* Button */}
     <div className=' flex justify-around mt-4'>
      <button className="btn btn-error  text-white hover:text-black  ">
        Login</button>
        </div>
        <div className='flex justify-around mt-4'>
        <p className='py-3 '> Forget Password? {" "} 
          <Link to="/forget-password" className='underline text-blue-500 cursor-pointer  '>
          Reset</Link>{" "}
        </p>
        <p className='py-3 justify-around'> No account? {" "} 
          <Link to="/signup" className='underline text-blue-500 cursor-pointer  '>
          Signup</Link>{" "}
        </p>
        </div>
        

     </form>  


      </div >
      </dialog>
      </div>
    </>
  )
}

export default Login
