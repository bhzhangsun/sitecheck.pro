import { NextRequest, NextResponse } from 'next/server';
import stripe, { STRIPE_PRODUCTS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const { plan, email } = await request.json();

    if (!plan || !email) {
      return NextResponse.json(
        { error: 'Plan and email are required' },
        { status: 400 }
      );
    }

    const product = STRIPE_PRODUCTS[plan as keyof typeof STRIPE_PRODUCTS];
    
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/`,
      metadata: {
        plan,
        email,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      status: session.payment_status,
      customer: session.customer_details,
      plan: session.metadata?.plan,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
