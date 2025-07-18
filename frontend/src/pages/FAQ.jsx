import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar component
import Footer from '../components/Footer';  // Import Footer component
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import Font Awesome icons

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { question: 'What types of cars do you sell?', answer: 'We sell luxury, sports, budget-friendly, and electric cars from top brands like Tesla, BMW, Audi, Ford, and more.' },
    { question: 'Do you offer financing options?', answer: 'Yes, we partner with multiple financial institutions to offer flexible car loan and EMI options.' },
    { question: 'Can I trade in my current car?', answer: 'Absolutely! You can get an instant trade-in estimate and use it toward your next purchase.' },
    { question: 'Do the cars come with warranties?', answer: 'Yes, all our cars come with at least a 1-year limited warranty. Extended warranties are also available.' },
    { question: 'Can I test drive before buying?', answer: 'Yes, we encourage test drives. You can book one online or visit any of our showrooms.' },
    { question: 'What documents do I need to purchase a car?', answer: 'You need a valid driving license, proof of identity, and financial documents for loan processing (if applicable).' },
    { question: 'Do you deliver cars to other cities?', answer: 'Yes, we offer doorstep delivery across the country with tracking and insurance included.' },
    { question: 'How do I know the car is in good condition?', answer: 'Every car goes through a 200-point inspection by our certified mechanics before being listed.' },
    { question: 'What if I face an issue after buying?', answer: 'We have a 7-day return policy and dedicated after-sales support for your convenience.' },
    { question: 'How can I contact support?', answer: 'You can contact us through the Contact section, call our hotline, or email us at support@carzone.com.' },
    { question: 'Is there a return policy?', answer: 'Yes, you can return the car within 7 days if you face any critical issues covered under policy.' },
    { question: 'Do you charge delivery fees?', answer: 'For long-distance deliveries, a nominal fee is charged which includes insurance and handling.' },
    { question: 'Are the cars brand new?', answer: 'We sell both new and certified pre-owned cars. All are listed with full condition reports.' },
    { question: 'How long does delivery take?', answer: 'Typically 2-7 business days depending on your location and selected car.' },
    { question: 'Can I cancel my booking?', answer: 'Yes, you can cancel within 24 hours of booking. After that, cancellation fees may apply.' },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <>
      <Navbar/>
      <div className="faq-container">
        <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-card ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">{item.question}</div>
              {openIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Component */}
        <Footer /> {/* Adding Footer */}

        {/* Embedded CSS */}
        <style>{`
          .faq-container {
            background: linear-gradient(to bottom right, #00140aff, #000000);
            color: #fff;
            min-height: 100vh;
            padding: 2rem 1.5rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .back-button {
            background-color: transparent;
            color: #00ffff;
            font-size: 1rem;
            border: 1px solid #00ffff;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 1.5rem;
          }

          .back-button:hover {
            background-color: rgba(0, 255, 255, 0.1);
          }

          .faq-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #00ffff;
            border-bottom: 2px solid #00ffff66;
            padding-bottom: 1rem;
          }

          .faq-list {
            max-width: 800px;
            margin: 0 auto;
          }

          .faq-card {
            background-color: rgba(255, 255, 255, 0.05);
            padding: 1.2rem 1.5rem;
            margin-bottom: 1.2rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 255, 255, 0.15);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .faq-card.open {
            background-color: rgba(0, 255, 255, 0.07);
            box-shadow: 0 8px 24px rgba(0, 255, 255, 0.3);
          }

          .faq-question {
            font-size: 1.2rem;
            font-weight: bold;
            color: #00ffff;
          }

          .faq-answer {
            margin-top: 0.75rem;
            font-size: 1rem;
            color: #ccc;
            line-height: 1.5;
          }
        `}</style>
      </div>
    </>
  );
};

export default FAQ;
