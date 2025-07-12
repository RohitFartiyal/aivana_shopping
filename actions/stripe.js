'use server'

import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession(simplifiedCart, userCartData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {

    const line_items = simplifiedCart.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert to paisa
      },
      quantity: item.quantity,
    }));


     // Add delivery charge as a separate line item
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Charge',
        },
        unit_amount: userCartData.delivery * 100, // Convert to paisa
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add your preferred methods
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        userId: simplifiedCart[0]?.userId,
        cart: JSON.stringify(simplifiedCart),
        userCart: JSON.stringify(userCartData),
      },
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error('Stripe Error:', error)
    return { error: error.message }
  }
}

