import React, { useContext } from 'react'
import {assets, plans} from '../assets/assets'
import {AppContext} from '../context/AppContext'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Stripe from 'stripe'
const BuyCredit = () => {
  const {user,backendUrl,token,loadCreditsData,setShowLogin} =useContext(AppContext)
  const navigate = useNavigate()
  
  const initpay = async (order)=>{
      const options= {
        key:import.meta.env.STRIPE_SECRET_KEY,
        amount:order.currency,
        name:"Credits Payment",
        description:"Credits Payment",
        order_id:order.id,
        receipt:order.receipt,
        handler: async (response)=>{
          console.log(response);
        }
      }
     
  }

  const paymentStripe = async (planId)=>{
    try {
      if (!user) {
        setShowLogin(true)
      }

      const {data} =  await axios.post(backendUrl+'/api/user/pay-stripe',{planId},
        {headers:{token}}
      )

      if (data.success) {
        initpay(data.order)
        const {session_url} =data
        window.location.replace(session_url)
        toast.success(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
     className='min-h-[80vh] text-center pt-14 mb-10'>
        <button className=' border border-gray-400 px-10 py-2
        rounded-full mb-6'>Our Plans</button>
        <h1 className=' text-center text-3xl font-medium mb-6
        sm:mb-10'>Choose the Plan</h1>
        <motion.div
              initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{default:{duration:0.5},opacity:{delay:0.6},duration:1}} className='flex flex-wrap justify-center gap-6 text-left'>
          {plans.map((item,index)=>(
            <div key={index}
            className=' bg-white drop-shadow-sm border rounded-lg py-12
            px-8 text-gray-600 hover:scale-105  transition-all duration-500'>
                <img width={40} src={assets.logo_icon} alt="" />
                <p className=' mt-3 mb-1 font-semibold'>{item.id}</p>
                <p className='text-sm'>{item.desc}</p>
                <p className='mt-6'>
                  <span className='text-3xl font-medium'>${item.price} </span>/ {item.credits} credits</p>
            <button onClick={()=>paymentStripe(item.id)}
             className=' w-full bg-gray-800 text-white mt-8
            text-sm rounded-md py-2.5 min-w-52'>{user?'purchase':'Get Started'}</button>
            </div>
          ))}
        </motion.div>
    </motion.div>
  )
}

export default BuyCredit
