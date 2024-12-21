
import React from 'react'
import Home from './home/Home'
import Movies from './movies/Movies'
import VerifyEmail from './components/Emailverify'
import { Routes,Route } from "react-router-dom"
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast';
import ResetPassword from './components/Resetpassword'
import ForgetPassword from './components/Forgetpassword'
import Favourites from './favourite/Favourites'
// Import the FavoriteProvider

import Videoplayer from './Videoplayer/Videoplayer'
import AdminDashboards from './adminDashboard/AdminDashboards'
import SearchResult from './SearchResults/SearchResult'







function App() {

 
  return (
    <>
   
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/movies' element={<Movies/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/forget-password' element={<ForgetPassword/>}/>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/favourites' element={<Favourites/>}/>
      <Route path='/video-player/:id' element={<Videoplayer/>}/>
      <Route path='/admin' element={< AdminDashboards/>}/>
      <Route path='/search-results' element={< SearchResult/>}/>
      
    </Routes>

   
    <Toaster/>
    </>
  )
}

export default App

