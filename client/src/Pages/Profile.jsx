import {useRef, useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {useSelector, useDispatch} from 'react-redux'
import {app} from '../firebase'
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutUserStart, signoutFailure, signoutUserSuccess} from '../redux/user/userSlice.js'
import { Link } from 'react-router-dom'
import UserListings from '../components/UserListings.jsx'


const Profile = () => {
  const fileRef=useRef(null);
  const {currentUser, loading, error}=useSelector((state)=>state.user)
  const [file, setFile]=useState(undefined)
  const [filePerc, setFilePerc]=useState(0);
  const [fileUploadError, setFileUploadError]=useState(false)
   const [showListingError, setShowListingError]=useState(false);
   const [userListings, setUserListings]=useState([]);
  console.log(file)
  console.log(filePerc);
  const [formData, setFormData]=useState({});
  const [updateSuccess, setUpdateSuccess]=useState(false)
  const dispatch=useDispatch();
console.log(formData)
  // allow read; 
  // allow write: if 
  // request.resource.size<2*1024*1024 && 
  // request.resource.contentType.matches('image/.*')

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload=(file)=>{
       const storage=getStorage(app);
       const fileName=new Date().getTime()+file.name;
       const storageRef=ref(storage, fileName);
       const uploadTask=uploadBytesResumable(storageRef, file);
       uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setFormData({ ...formData, avatar: downloadURL })
          );
        }
      );
    };

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.id]:e.target.value})
    }

    const handleSubmit= async(e)=>{
          e.preventDefault();
          try {
            dispatch(updateUserStart());
            const res=await fetch(`/api/user/update/${currentUser._id}`, {
              method:'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify(formData)
            })
            const data=await res.json();
            if(data.success===false){
              dispatch(updateUserFailure(data.message));
              return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
          } catch (error) {
            dispatch(updateUserFailure(error.message))
          }
    }

    const handleDeleteUser=async()=>{
      try {
        dispatch(deleteUserStart());
        const res=await fetch(`/api/user/delete/${currentUser._id}`, {
          method:'DELETE',

        })

        const data=await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data.message))
          return;
        }
        dispatch(deleteUserSuccess(data))
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }

    }

    const handleSignout=async()=>{
      try {
        dispatch(signoutUserStart())
        const res=await fetch(`/api/auth/signout`);
        const data=await res.json();
        if(data.success===false){
          dispatch(signoutFailure(data.message));
          return;
        }
        dispatch(signoutUserSuccess(data));
      } catch (error) {
        dispatch(signoutFailure(error))
      }
    }

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
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl font-semibold text-center'>Profile</h1>
      <form className=' flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref={fileRef} accept='images/*' hidden/>
      <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} className=' object-cover cursor-pointer self-center w-24 h-24 rounded-full mt-2' alt='profile'/>
      <p className=' text-sm self-center'>
        {
          fileUploadError ?(
            <span className=' text-red-700'>Error Image Upload (Image Must be less Than 2 MB)</span>
          ):filePerc>0 && filePerc < 100 ? (
            <span className=' text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ):filePerc===100?(
            <span className=' text-green-700'>Image Successfully Uploaded!</span>
          ):('')
        }
      </p>
      <input type='text' placeholder='Username' id='username' className=' border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange}/>
      <input type='text' placeholder='email' id='email' className=' border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange}/>
      <input type='password' placeholder='password' id='password' className=' border p-3 rounded-lg' onChange={handleChange}/>
      <button disabled={loading} className=' bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-85 cursor-pointer uppercase'>
        {
          loading?'Loading...':'Update'
        }
      </button>
      <Link className=' bg-green-700 text-white p-3 text-center uppercase hover:opacity-95 rounded-lg' to='/create-listing'>
      Create Listing
      </Link>

      </form>
      <div className='flex justify-between mt-3'>
        <span onClick={handleDeleteUser} className=' text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className=' text-red-700 cursor-pointer'>SignOut</span>
      </div>
      <p className=' text-red-700 mt-5'>{error?error:''}</p>
      <p className=' text-green-700 mt-3'>{updateSuccess?'User is Updated Successfully':''}</p>

            <button onClick={handleShowListing} className=' bg-green-700 w-full p-3 rounded-lg text-white'>Show Listings</button>
      <p className=' text-red-700 mt-5'>{showListingError? 'Error Showing Listing' :''}</p>

      <div>
      
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

                <Link to={`/update-listing/${listing._id}`}>
                <button className=' text-red-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))
        }
      
    </div>
    }

      
      </div>
    </div>


  )
}

export default Profile