import React from 'react';

export default function CheckoutWizard({ activeStep = 0, className }) {
  return (
    <div>
      <div className="overflow-hidden rounded-full bg-gray-200">
        <div className={`h-2 rounded-full bg-blue-500 ${className}`}></div>
      </div>
      <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
        {['Shipping Address', 'Payment Method', 'Place Order'].map(
          (step, index) => (
            <li
              key={step}
              className={`flex-1 border-b-2  
          text-center 
       ${
         index <= activeStep
           ? 'border-indigo-500   text-indigo-500'
           : 'border-gray-400 text-gray-400'
       }
          
       `}
            >
              {step}
            </li>
          )
        )}
      </ol>
    </div>
  );
}
