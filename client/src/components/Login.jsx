import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [currState,setCurrState] = useState("Login")
    const {setShowLogin,backendUrl,token,setToken,setUser} =useContext(AppContext);

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const onSubmitHandler = async (e) =>{
        e.preventDefault();

        try {
           if (currState === 'Login') {
            const {data} =  await axios.post(backendUrl+'/api/user/login',{email,password})
            
              if (data.success) {
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('token',data.token)
                setShowLogin(false)
              }else{
                toast.error(data.message)
              }

            }else{
              const {data} =  await axios.post(backendUrl+'/api/user/register',{name,email,password})
            
              if (data.success) {
                setToken(data.token)
                setUser(data.user)
                localStorage.setItem('token',data.token)
                setShowLogin(false)
              }else{
                toast.error(data.message)
              }
            }

        } catch (error) {
          toast.error(error.message)
        }
    }

    useEffect(()=>{
      document.body.style.overflow='hidden';

      return ()=>{
        document.body.style.overflow='unset';
      }
    })
  return (
    <div className=' fixed top-0 left-0 right-0 bottom-0 z-10 
    backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700
            font-medium'>{currState}</h1>
            <p className='text-sm'>Welcome back !Please sign in to continue</p>
            {currState==="Login"?<></>:
            <div className=' border px-6 py-2 flex items-center gap-2
            rounded-full mt-5'>
                <img src={assets.user_icon} alt="" />
                <input onChange={e => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
            </div>
            }
            <div className=' border px-6 py-2 flex items-center gap-2
            rounded-full mt-5'>
                <img src={assets.email_icon} alt="" />
                <input onChange={e => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required />
            </div>

            <div className=' border px-6 py-2 flex items-center gap-2
            rounded-full mt-5'>
                <img src={assets.lock_icon} alt="" />
                <input onChange={e => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='password' required />
            </div>

            <p className='text-sm text-blue-600 my-4 cursor-pointer '>Forget password</p>
            <button className='bg-blue-600 w-full text-white py-2
            rounded-full'>create account</button>
            {currState === "Login"?<p className='mt-5 text-center'>Don't have an account ?
                <span className=' text-blue-600 cursor-pointer' onClick={()=>setCurrState("Sign Up")}>Sign up</span></p>:
                 <p className='mt-5 text-center'>Already have an account?
                <span className=' text-blue-600 cursor-pointer'onClick={()=>setCurrState("Login")}>Login</span></p>}
               <img src={assets.cross_icon} onClick={()=>setShowLogin(false)} className='absolute top-5
               right-5 cursor-pointer w-4'  alt="" />                
      </form>
    </div>
  )
}

export default Login
