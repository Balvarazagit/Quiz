import React from 'react';
import Contact from '../components/Contact/Contact';
import Navbar from '../components/Layout/Navbar/Navbar';
import Footer from '../components/Layout/Footer/Footer';

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;