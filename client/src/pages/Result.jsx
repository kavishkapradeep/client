import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { delay, motion } from "motion/react"
const Result = () => {
  const [image,setImage] = useState(assets.sample_img_1)
  const [isImageLoaded,setIsImageLoaded] = useState(true)
  const [loading,setLoading] = useState(false)
  const [input ,setInput] =useState('')

  const onSubmitHandler = async (e)=>{

  }

  return (
    <motion.form 
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center' >
    <div>
      
      <div className=' relative'>
          <img src={image} alt="" className=' max-w-sm rounded' />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 
          ${loading ? 'w-full transition-all duration-[10s]':'w-0'}`}></span>          
      </div>
      <p className={!loading ? 'hidden':''}>Loading.....</p>
      </div >
      {!isImageLoaded &&
      <div className='flex w-full max-w-xl bg-neutral-500 text-white 
       text-sm p-0.5 mt-10 rounded-full'>
      <input onChange={e=>setInput(e.target.value)} value={input} 
      type="text" placeholder='Describe what you want to generate'
      className=' flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
      <motion.button
      whileHover={{scale:1.05}}
      whileTap={{scale:0.95}}
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{default:{duration:0.5},opacity:{delay:0.8},duration:1}} type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</motion.button>
    </div>
    }
    {isImageLoaded &&
    <div className='flex gap-2 flex-wrap justify-center text-white
    text-sm p-0.5 mt-10 rounded-full'>
        <motion.p onClick={()=>{setIsImageLoaded(false)}}
        whileHover={{scale:1.05}}
                         whileTap={{scale:0.95}}
                         initial={{opacity:0}}
                         animate={{opacity:1}}
                         transition={{default:{duration:0.5},opacity:{delay:0.8},duration:1}}
                         className='bg-transparent border border-zinc-900 text-black
        px-8 py-3 rounded-full cursor-pointer' >Generate Another</motion.p>
        {/*image download */}
        <motion.a 
        whileHover={{scale:1.05}}
                         whileTap={{scale:0.95}}
                         initial={{opacity:0}}
                         animate={{opacity:1}}
                         transition={{default:{duration:0.5},opacity:{delay:0.8},duration:1}}
                         href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</motion.a>
    </div>
    }
    </motion.form>
  )
}

export default Result
