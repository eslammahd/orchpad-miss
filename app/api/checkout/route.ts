import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { slotId, name, email, phone, notes } = await req.json();
    if (!slotId || !name || !email || !phone) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    // Check slot still available
    const { data: slot } = await supabase
      .from('slots')
      .select('*')
      .eq('id', slotId)
      .eq('is_available', true)
      .single();

    if (!slot) {
      return NextResponse.json({ error: 'الموعد ده مش متاح' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'egp',
          product_data: {
            name: `استشارة نفسية — د. سعد المهدي`,
            description: `${slot.date} الساعة ${slot.time.slice(0, 5)}`
          },
          unit_amount: 30000
        },
        quantity: 1
      }],
      customer_email: email,
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      metadata: { slotId, name, email, phone, notes: notes || '' }
    });

    // Insert booking as pending
    await supabase.from('bookings').insert({
      slot_id: slotId,
      patient_name: name,
      patient_email: email,
      patient_phone: phone,
      notes: notes || '',
      payment_status: 'pending',
      stripe_session_id: session.id
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
