"use client"
import { ShippingFormInputs } from '@repo/types'
import { PaymentElement } from '@stripe/react-stripe-js/checkout';
import { ConfirmError } from '@stripe/stripe-js';
import React, { useState } from 'react'
import {useCheckout} from '@stripe/react-stripe-js/checkout';
import { Button } from './ui/button';
const CheckoutForm = ({shippingForm}:{shippingForm:ShippingFormInputs}) => {
  
  const checkoutState = useCheckout();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<ConfirmError | null>(null);
    
  const handleClick = async () => {
    setLoading(true);
     if (checkoutState.type !== 'success') {
      setLoading(false);
      return;
    }
    await checkoutState.checkout.updateEmail(shippingForm.email);
    await checkoutState.checkout.updateShippingAddress({
    
      name:"shipping_address",
      address:{
        line1:shippingForm.address,
        city:shippingForm.city,
        country:"US",
      }
    });
    const res = await checkoutState.checkout.confirm();
    if(res.type==="error"){
      setError(res.error)
    }
    setLoading(false);
  };
  return (
    <form>
        <PaymentElement options={{layout:'accordion'}}/>
        <Button 
        disabled={loading} 
        onClick={handleClick}
        className='w-full my-2 cursor-pointer'>
        {loading ? "Loading..." : "Pay "}
      </Button>
       {error && <div>{error.message}</div>}
    </form>
  )
}

export default CheckoutForm

