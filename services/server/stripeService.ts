import StripeInstance from 'stripe';

const stripe = new StripeInstance(process.env.STRIPE_SECRET_KEY, { apiVersion: null });

export const isUserOnPremiumPlan = async (customerId: string): Promise<boolean> => {
  const subscriptionsRequest = await stripe.subscriptions.list({
    customer: customerId
  });

  // We need to cast this to any because TS seems convinced that there is no plan attr on
  // the returned subscriptions, which is incorrect.
  const subscriptions = subscriptionsRequest.data as any;
  return subscriptions.some(sub => sub.plan?.name === 'leerly Pro');
};
