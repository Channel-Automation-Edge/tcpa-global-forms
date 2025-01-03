"use client";

const NavBar2 = () => {
  return (
    <div         
    className=''>
        <header className="">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-28 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12 ">
            <a className="block text-accent" href="/">
              <span className="sr-only">Home</span>
              <img src="/images/logodark.svg" alt="Logo" className="h-12 sm:h-14 lg:h-16" />
            </a>
          </div>

          <div className="flex items-center gap-4">
          <div className="sm:flex sm:gap-4">
              <a
                className="rounded-md bg-transparent px-5 py-2.5 text-sm font-medium text-gray-800 inline-flex items-center"
                href="/contractor-signup"
              >
                I'm a contractor
              </a>
            </div>
            <div className="sm:flex sm:gap-4">
              <a
                className="rounded-md bg-transparent px-5 py-2.5 text-sm font-medium text-gray-800 inline-flex items-center"
                href="tel:+18594075999"
              >
                <img
                  src="/images/phone.svg" // Replace with your image path
                  alt="+1 (859) 407-5999"
                  className="w-6 h-6 mr-2" // Adjust width and height as needed
                />
                Call Us
              </a>
            </div>


            {/* <div className="block md:hidden">
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
            </div> */}
          </div>

          
        </div>
      </div>
    </header>
    </div>
  )
}

export default NavBar2
