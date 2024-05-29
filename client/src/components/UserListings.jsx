import { useState} from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'

const UserListings = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const [userListings, setUserListings]=useState([]);
  const [showListingError, setShowListingError]=useState(false);
  console.log(userListings)
  const handleShowListing=async()=>{
    try {
      setShowListingError(false)
      const res=await fetch(`/api/user/listings/${currentUser._id}`)
      const data=await res.json();
      if(data.success===false){
        setShowListingError(true)
        return
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true)
    }

  }

  const handleListingDelete=async(listingId)=>{
    try {
      const res=await fetch(`/api/listing/delete/${listingId}`, {
        method:'DELETE'
      })
      const data=await res.json();
      if(data.success===false){
        console.log(data.message)
        return
      }
      setUserListings((prev)=>prev.filter((listing)=>listing._id!==listingId))

    } catch (error) {
       console.log(error.message)
    }

  }

  return (
    <div>
      <div>
      <button onClick={handleShowListing} className=' bg-green-700 w-full p-3 rounded-lg text-white'>Show Listings</button>
      <p className=' text-red-700 mt-5'>{showListingError? 'Error Showing Listing' :''}</p>
      </div>

{
        userListings && userListings.length>0 && 
        <div className=' flex flex-col gap-4'>
          <h1 className=' text-2xl text-center mt-7'>Your Listings</h1>
        

        {
          userListings.map((listing)=>(
            <div key={listing._id} className=' border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing cover' className=' h-16 w-16 object-contain'/>
              </Link>
              <Link to={`/listing/${listing._id}`} className=' text-slate-700 font-semibold hover:underline flex-1 truncate'>
              <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
  
                <button onClick={()=>handleListingDelete(listing._id)} className=' text-red-700 uppercase'>Delete</button>
                <button className=' text-red-700 uppercase'>Edit</button>
              </div>
            </div>
          ))
        }
      
    </div>
    }
    </div>
  )
}

export default UserListings