import Hero from '../components/Hero';

import Benefits from '@/components/Benefits';
import FAQ from '@/components/FAQ';
import TabSection from '@/components/TabSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';


const Home = () => {
  return (
    <div>
        
        <Hero/>
        <div className='bg-bxg'>

            <Testimonials />

            <TabSection/> 
          
          <HowItWorks />

            <Benefits />
            <FAQ />

          

        </div>
        

        <Footer />
    </div>
  )
}

export default Home
