import React from 'react';
import { FaCheck } from 'react-icons/fa';

const CheckoutSteps = ({ active }) => (
  <div className="checkout-steps" aria-label={`Checkout step ${active} of 3`}>
    {['Order details', 'Confirmation', 'Payment'].map((step, index) => (
      <React.Fragment key={step}>
        <div className={`checkout-step ${index + 1 <= active ? 'is-active' : ''}`}>
          <span>{index + 1 < active ? <FaCheck /> : index + 1}</span>
          <small>{step}</small>
        </div>
        {index < 2 && <i className={index + 1 < active ? 'is-active' : ''} />}
      </React.Fragment>
    ))}
  </div>
);

export default CheckoutSteps;
