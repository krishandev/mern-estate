import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking} from 'react-icons/fa'
import Contact from '../components/Contact'

const Listing = () => {
    const {currentUser} =useSelector((state)=>state.user)
    SwiperCore.use([Navigation])
    const [listing, setListing]=useState(null);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(false)
    const [contact, setContact]=useState(false)
    const params=useParams();
    

    useEffect(()=>{
        const fetchListing=async()=>{
            try {
                setLoading(true)
                const res=await fetch(`/api/listing/get/${params.listingId}`)
                const data=await res.json();
                if(data.success===false){
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }

        }
        fetchListing()
    }, [params.listingId])

  return (
    <main>
        {
            loading && <p className=' text-center my-7 text-2xl'>Loading...</p>
        }

        {
            listing && !error && !loading && (
                <div>
                    <Swiper navigation autoplay>
                        {listing.imageUrls.map((url)=>(
                            <SwiperSlide key={url} >
                                <div className=' h-[550px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}>

                                </div>

                            </SwiperSlide>
                        ))}

                    </Swiper>

                    <div className='flex items-center justify-center'>
                    <div className='flex flex-col items-center justify-center p-3 w-full max-w-[900px]'>
                        <h1 className=' text-2xl font-semibold'>{listing.name} -${' '} {listing.offer ? listing.discountPrice.toLocaleString('hi-IN'):listing.regularPrice.toLocaleString('hi-IN')} <span className=' text-green-700'>OFF</span> {listing.type==='rent' && ' / month'}</h1>
                        
                        <div className=' mt-10'>
                        <p className='flex items-center justify-center gap-3'>
                            <FaMapMarkerAlt/>
                            {listing.address}
                        </p>
                        </div>

                        <div className=' flex gap-4 mt-10 border w-full items-center justify-center'>
                            <p className=' bg-red-900 text-white w-full max-w-[200px] p-1 rounded text-center'>
                            {
                                listing.type==='rent' ? 'For Rent' : 'For Sale'
                            }
                            </p>
                            {
                                listing.offer && (
                                    <p className=' bg-green-900 text-white w-full max-w-[200px] p-1 rounded text-center'>
                                        <span>Price:{' '}</span>${+listing.regularPrice - listing.discountPrice} 
                                    </p>
                                )
                            }
                        </div>

                        <div>
                            <p className='p-3'>
                                <span className=' font-semibold'>Description:</span>
                                {listing.description}
                            </p>
                        </div>

                        <div>
                            <ul className=' flex text-green-900 font-semibold text-sm gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaBed/>
                                    {listing.bedrooms>1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                                    
                                </li>

                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaBath/>
                                    {listing.bathrooms>1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                                    
                                </li>

                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaParking/>
                                    {listing.parking ? 'Parking Spot' :'No Parking'}
                                </li>

                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaChair/>
                                    {listing.furnished? 'Furnished' : 'UnFurnished'}
                                </li>

                            </ul>
                        </div>
<div className='  w-full'>

{
                            currentUser && listing.userRef !== currentUser._id && !contact && (
                                <button onClick={()=>setContact(true)} className=' w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact Landlord</button>
                            )
                        }
                        {
                            contact && <Contact listing={listing}/>
                        }

</div>
                    </div>
                    </div>
                </div>
                
            )
        }
    </main>
  )
}

export default Listing