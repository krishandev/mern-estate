import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


const Header = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const [searchTerm, setSearchTerm]=useState('');
  const navigate=useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between max-w-6xl items-center  p-3 mx-auto '>
            {/* left  */}
            <div className='flex font-semibold'>
                <Link to='/'>
                <h1 className=' text-sm sm:text-xl'>
                    <span>Krishan's</span>
                    <span>Estate</span>
                </h1>
                </Link>
                
            </div>
            {/* center */}
            <div>
          <form onSubmit={handleSubmit} className=' bg-slate-100 rounded-lg p-3 flex items-center'>
            <input type='text' placeholder='Search...' className=' bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
            <button>
            <FaSearch className=' text-stone-600'/>
            </button>
          </form>
            </div>
            {/* right */}
            <div>
            <ul className='flex gap-8'>
                <Link to='/'>
                <li className=' hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/search'>
                <li className=' hidden sm:inline text-slate-700 hover:underline'>Property Search</li>
                </Link>

                <Link to='/create-listing'>
                <li className=' hidden sm:inline text-slate-700 hover:underline'>Add New Property</li>
                </Link>

                <Link to='/about'>
                <li className=' hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                
                <Link to='/profile'>
                  {
                    currentUser ? (
                      <img className=' rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>
                    ) : (
                      <li className=' sm:inline text-slate-700 hover:underline'>Sign Up</li>
                    )
                  }
                
                </Link>
            </ul>
            </div>

        </div>

    </header>
  )
}

export default Header