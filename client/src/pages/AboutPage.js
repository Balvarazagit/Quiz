import React from 'react';
import AboutUs from '../components/AboutUs/AboutUs';
import Navbar from '../components/Layout/Navbar/Navbar';
import Footer from '../components/Layout/Footer/Footer';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <AboutUs />
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;