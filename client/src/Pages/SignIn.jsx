import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'


const SignIn = () => {
  const [formData, setFormData]=useState({});
  const {loading, error}=useSelector((state)=>state.user);
const navigate=useNavigate();
const dispatch=useDispatch();
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })

  }
  const  handleSubmit=async(e)=>{
       e.preventDefault();
       
       try {
        dispatch(signInStart());
        const res=await fetch('/api/auth/signin', {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
         });
         const data=await res.json();
         if(data.success===false){
          dispatch(signInFailure(data.message));
          return;
         }
         dispatch(signInSuccess(data))
         navigate('/')
         
       } catch (error) {
         dispatch(signInFailure(error.message))
       }
  }
  console.log(formData)
  return (
    <div className=' max-w-lg mx-auto mt-10'>
      <h1 className=' text-3xl font-semibold p-3 text-center'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input className='border p-3 rounded-lg' type='text' placeholder='Email' id='email' onChange={handleChange}/>
        <input className='border p-3 rounded-lg' type='text' placeholder='Password' id='password' onChange={handleChange}/>
        <button disabled={loading} className=' bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85'>{loading?'Loading...':'SignIn'}</button>
        <OAuth/>
      </form>
      <div className='mt-3 gap-3 flex'>
        <p>Dont Have an Account?</p> 
        <span><Link to='/sign-up' className=' text-blue-700'>Sign Up</Link></span>
      </div>
      {
        error && <p className=' text-red-500 mt-5'>{error}</p>
      }

    </div>
  )
}

export default SignIn