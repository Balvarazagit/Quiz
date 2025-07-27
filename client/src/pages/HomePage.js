import React from 'react';
import Navbar from '../components/Layout/Navbar/Navbar';
import HeroSection from '../components/HeroSection/HeroSection';
import Features from '../components/Features/Features';
import Footer from '../components/Layout/Footer/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        {/* Add more sections as needed */}
      </main>
      <Footer />
    </>
  );
};

export default HomePage;