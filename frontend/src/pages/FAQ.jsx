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
      <div className="page">
        <Navbar />
        <section className="faq-section">
          <div className="faq-content">
            <h1 className="faq-title">
              Frequently Asked <span className="accent">Questions</span>
            </h1>
            <p className="faq-subtitle">
              Find answers to common queries about our services, cars, and more.
            </p>
            <div className="faq-list">
              {faqData.map((item, index) => (
                <article
                  key={index}
                  className={`faq-card ${openIndex === index ? 'open' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="faq-question">{item.question}</div>
                  {openIndex === index && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
      <style jsx>{`
        :root {
          --bg: #020617;
          --card-bg: rgba(15, 23, 42, 0.96);
          --card-border: rgba(148, 163, 184, 0.35);
          --accent: #22d3ee;
          --accent-strong: #e11d48;
          --text-main: #e5e7eb;
          --text-muted: #9ca3af;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 55%),
            radial-gradient(circle at bottom right, rgba(244, 63, 94, 0.22), transparent 60%),
            var(--bg);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-section {
          width: 100%;
          padding: 4rem clamp(1.5rem, 6vw, 4rem) 2rem;
          animation: fadeUp 0.7s ease-out;
        }

        .faq-content {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .faq-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 1rem;
          border-radius: 999px;
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.7);
          color: var(--text-muted);
          backdrop-filter: blur(18px);
          width: fit-content;
        }

        .faq-title {
          font-size: clamp(2.5rem, 4.8vw, 3.4rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #f9fafb;
        }

        .faq-title .accent {
          background: linear-gradient(120deg, var(--accent), var(--accent-strong));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .faq-subtitle {
          font-size: 0.96rem;
          color: var(--text-muted);
          max-width: 520px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .faq-card {
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 60%),
            var(--card-bg);
          border-radius: 1.2rem;
          border: 1px solid var(--card-border);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.98);
          cursor: pointer;
          padding: 1.2rem 1.5rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .faq-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.75);
          box-shadow: 0 26px 65px rgba(15, 23, 42, 1);
        }

        .faq-card.open {
          transform: scale(1.02);
          border-color: var(--accent);
        }

        .faq-question {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f9fafb;
        }

        .faq-answer {
          margin-top: 0.75rem;
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {
          .faq-section {
            padding: 3rem 1.4rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 2.5rem 1.1rem 1.8rem;
          }

          .faq-title {
            font-size: 2.2rem;
          }

          .faq-subtitle {
            font-size: 0.9rem;
          }

          .faq-card {
            padding: 1rem 1.2rem;
          }

          .faq-question {
            font-size: 1rem;
          }

          .faq-answer {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .faq-title {
            font-size: 1.9rem;
          }

          .faq-subtitle {
            font-size: 0.84rem;
          }

          .faq-card {
            padding: 0.9rem 1rem;
          }

          .faq-question {
            font-size: 0.95rem;
          }

          .faq-answer {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default FAQ;