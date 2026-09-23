import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PartnersSection from '../components/PartnersSection';
import UpShiftRegistrationModal from '../components/UpShiftRegistrationModal';

export default function PartnersPage() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const handleNavigate = (sectionId) => {
    window.location.href = `/#${sectionId}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#111111] antialiased selection:bg-[#E91D2B] selection:text-white">
      {/* Main Floating Navbar */}
      <Navbar onOpenRegistration={() => setIsRegistrationOpen(true)} />

      {/* Partners Main Content */}
      <main className="flex-grow pt-24 pb-12 sm:pt-28 sm:pb-16">
        <PartnersSection />
      </main>

      {/* UpShift Registration Modal */}
      <UpShiftRegistrationModal 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
