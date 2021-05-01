import axios from 'axios';
import { showAlert } from './alerts';

/* eslint-disable */
const stripe = Stripe(
  'pk_test_51IlKs9DqzEHZllqhWln0vN6gCAK10JgDnRerUk39IQUSF7zphGcG4qhcT52eeOqJSY0tVJE2MrWBtWqduVM0KFnr001FlTTmDV'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
