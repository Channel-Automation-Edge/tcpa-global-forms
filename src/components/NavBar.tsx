"use client";
import {motion} from 'framer-motion';

const NavBar = () => {
  return (
    <motion.nav initial={{
            opacity: 0,
            y:5,
        }}
        animate={{
            opacity: 1,
            y: 1,
        }} 
        transition={{
            delay: 0.5,
        }}        
    className=''>
        <header className="">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12 ">
            <a className="block text-accent" href="#">
              <span className="sr-only">Home</span>
              <img src="/images/logo.svg" alt="Logo" className="h-24" />
            </a>
          </div>

            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    </motion.nav>
  )
}

export default NavBar
