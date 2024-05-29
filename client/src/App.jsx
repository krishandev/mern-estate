import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute.jsx'
import CreateListing from './Pages/CreateListing.jsx'
import UpdateListing from './Pages/UpdateListing.jsx'
import Listing from './Pages/Listing.jsx'
import Search from './Pages/Search.jsx'
import Footer from './components/Footer.jsx'

const App = () => {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/sign-in' element={<SignIn/>}/>
    <Route path='/sign-up' element={<SignUp/>}/>
    <Route path='/listing/:listingId' element={<Listing/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/create-listing' element={<CreateListing/>}/>
    <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
    </Route>
  </Routes>
  <Footer/>
  </BrowserRouter>
}

export default App