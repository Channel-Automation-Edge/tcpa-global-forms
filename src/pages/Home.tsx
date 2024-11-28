import Hero from '../components/Hero';

import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import TabSection from '@/components/TabSection';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';


const Home = () => {
  return (
    <div>
        
        <Hero/>
        
        <HowItWorks />
        <Services />

        
       
        <Testimonials />
        <Benefits />

        <TabSection/> 
        <FAQ />

        <Footer />
    </div>
  )
}

export default Home
