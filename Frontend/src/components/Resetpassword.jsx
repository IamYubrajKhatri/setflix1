import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    //to navigate to other page 
    const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
 {/* left side the name from backend ,right side from frontend */}
  const onSubmit = async (data) => {
    try {
        //we send server or backend a post req with the given user credientals
        //we put user given email and code with data.email data.code
        //left side is like postman variable we created in backend(email,code) 
      const res = await axios.post("/api/auth/reset-password", {
        
        
        resetPasswordOtp:data.code,
        newPassword:data.password
      });
    //it checks if server/backend response and contains data
    //it holds a payload sent by backend after our post req.
    //if res.data is truthly then it is finished or eamil is verified

      if (res.data) {
        toast.success("Password reseted successfully!");
        // Optionally redirect to the login page
        navigate("/"); // Redirect to home page where we login
      }
    } catch (err) {
      if (err.response) {
        toast.error("Password reset failed: " + err.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
<>
    

   

    <div className="flex h-screen items-center justify-center bg-[url('background.jpg')] bg-cover bg-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-100 p-8 rounded-xl border shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

        <div className="mb-4">
          <label className="block mb-2">Verification Code</label>
          <input
            type="text"
            placeholder="Enter verification code"
            className="w-full px-4 py-2 border rounded"
            {...register("code", { required: "Verification code is required" })}
          />
          {errors.code && (
            <span className="text-red-500 text-sm">{errors.code.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">New Password</label>
          <input
            type="text"
            placeholder="Enter a new Password"
            className="w-full px-4 py-2 border rounded"
            {...register("password", { required: "Password is required" })}
          />
          {errors.code && (
            <span className="text-red-500 text-sm">{errors.code.message}</span>
          )}
        </div>

        <button
          type="submit"
         className="btn btn-error  text-white hover:text-black"
        >
          Reset Password
        </button>
      </form>
    </div>

    
    </>
  );
}

export default ResetPassword;
