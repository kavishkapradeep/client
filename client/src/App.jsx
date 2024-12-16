import React from 'react'
import Home from './pages/Home.jsx'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import { Route, Routes } from 'react-router-dom'
import Navber from './components/Navber.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login.jsx'
const App = () => {
  return (
    <div className='px-4 sm:px-10 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 
     to-orange-50 '>
      <Navber/>
      <Login/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/buy' element={<BuyCredit/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App

