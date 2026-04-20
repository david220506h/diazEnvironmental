import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaSms, 
  FaEdit, 
  FaTimes, 
  FaCommentDots 
} from 'react-icons/fa';
import './FloatingContact.css';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contactRef = useRef(null);

  // Detect if it's a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
    
  // Close the menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      if (
        contactRef.current && 
        isOpen && 
        !contactRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Contact information
  const contactInfo = {
    phone: '+14804794507',
    email: 'diazcleaning.az@gmail.com',
  };

  return (
    <div 
      className={`floating-contact ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
      ref={contactRef}
    >
      <button 
        className="contact-toggle" 
        onClick={toggleMenu}
        aria-label="Open contact options"
      >
        {isOpen ? (
          <FaTimes />
        ) : (
          <FaCommentDots />
        )}
      </button>
      
      {isMobile && isOpen && (
        <div className="mobile-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className="contact-options">
        <a 
          href={`tel:${contactInfo.phone}`}
          className="contact-option phone-option"
          aria-label="Call by phone"
        >
          <FaPhone />
          <span className="option-label">Call</span>
        </a>

        <a 
          href={`mailto:${contactInfo.email}`}
          className="contact-option email-option"
          aria-label="Send email"
        >
          <FaEnvelope />
          <span className="option-label">Email</span>
        </a>

        <a 
          href={`sms:${contactInfo.phone}`}
          className="contact-option sms-option"
          aria-label="Send SMS message"
        >
          <FaSms />
          <span className="option-label">SMS</span>
        </a>
        
        <a 
          href="#contact"
          className="contact-option form-option"
          aria-label="Complete contact form"
        >
          <FaEdit />
          <span className="option-label">Form</span>
        </a>
      </div>

      <div className="contact-tooltip">
        How can we help you?
      </div>
    </div>
  );
};

export default FloatingContact;