import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { Services } from '@/sections/Services';
import { About } from '@/sections/About';
import { Booking } from '@/sections/Booking';
import { Testimonials } from '@/sections/Testimonials';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Admin } from '@/pages/Admin';
import { WhatsAppButton } from '@/components/WhatsAppButton';

function MainSite() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Booking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
        {/* Catch-all — redirect unknown routes to home */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
