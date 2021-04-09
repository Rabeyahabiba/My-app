import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SimpleCardForm from './SimpleCardForm';
import SplitCardForm from './SplitCardForm';
const stripePromise = loadStripe('pk_test_51IeCAdBtD4Lbh5uAURJTMtpFjirBMX2VCYSj4H0BGo24vO40xBD6DRElAGapwSZ0igWqrT0EPh4BMlLipPhYmTx900nGUAi4VF');

const ProcessPayment = ({handlePayment}) => {
    return (
        <Elements stripe={stripePromise}>
            <SimpleCardForm handlePayment={handlePayment}></SimpleCardForm>
            {/* <SplitCardForm></SplitCardForm> */}
        </Elements>
    );
};

export default ProcessPayment;
