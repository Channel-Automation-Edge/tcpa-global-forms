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
        <div className="flex h-28 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12 ">
            <a className="block text-accent" href="#">
              <span className="sr-only">Home</span>
              <img src="/images/logo.svg" alt="Logo" className="h-20" />
            </a>
          </div>

          

          <div className="flex items-center gap-4">
            

            <div className="block md:hidden">
              
            </div>
          </div>
        </div>
      </div>
    </header>
    </motion.nav>
  )
}

export default NavBar
