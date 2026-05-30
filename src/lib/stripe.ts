import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-05-27.dahlia',
});

export default stripe;

export const STRIPE_PRODUCTS = {
  pro: {
    name: 'SiteCheck Pro',
    description: 'Unlimited website audits + detailed reports',
    price: 1900, // $19.00 in cents
    features: [
      'Unlimited website audits',
      'Detailed PDF reports',
      'Competitor analysis',
      'Priority support',
      'Export to CSV/PDF'
    ]
  },
  agency: {
    name: 'SiteCheck Agency',
    description: 'Multi-store management + white-label',
    price: 4900, // $49.00 in cents
    features: [
      'Everything in Pro',
      'Up to 50 stores',
      'White-label reports',
      'API access',
      'Team collaboration',
      'Custom branding'
    ]
  }
};
