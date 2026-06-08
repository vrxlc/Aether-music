'use client';

import React, { useState } from 'react';
import { Check, CreditCard, Music, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started.',
    features: ['Ad-supported listening', 'Standard audio quality', 'Online only'],
    icon: <Music className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$10.99',
    description: 'The best music experience.',
    features: ['Ad-free music', 'High-fidelity audio', 'Offline downloads', 'Unlimited skips'],
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    popular: true,
  },
  {
    id: 'family',
    name: 'Family',
    price: '$16.99',
    description: 'For everyone in your home.',
    features: ['Up to 6 accounts', 'Block explicit music', 'Family Mix', 'All Premium features'],
    icon: <Users className="w-6 h-6 text-pink-500" />,
  },
];

export default function BillingSection() {
  const router = useRouter();
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(() => {
      alert(`Success! You have upgraded to Aether ${selectedPlan.name}.`);
      router.push('/?section=profile');
    }, 1500);
  };

  if (step === 'payment') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={() => setStep('plans')}
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4 transition-colors"
        >
          ← Back to plans
        </button>
        <h2 className="text-2xl font-bold mb-2">Add Payment Method</h2>
        <p className="text-zinc-500 mb-6">You are subscribing to the <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedPlan.name}</span> plan.</p>
        
        <form className="space-y-4" onSubmit={handleConfirmPayment}>
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input required type="text" className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-md" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <div className="relative">
              <input required type="text" className="w-full p-2 pl-10 bg-zinc-100 dark:bg-zinc-800 border-none rounded-md" placeholder="0000 0000 0000 0000" />
              <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input required type="text" className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-md" placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVC</label>
              <input required type="text" className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-md" placeholder="123" />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md mt-4 transition-all"
          >
            {isProcessing ? 'Processing...' : `Confirm & Pay ${selectedPlan.price}`}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Choose Your Plan</h1>
        <p className="text-lg text-zinc-500">Upgrade to Premium for an uninterrupted music experience.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-2xl border transition-all hover:shadow-xl ${
              plan.popular ? 'border-blue-500 scale-105 shadow-md' : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            
            <div className="mb-6">
              <div className="mb-4">{plan.icon}</div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-xl font-medium text-zinc-500">/mo</span>
              </div>
              <p className="mt-4 text-zinc-500 text-sm">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-sm">
                  <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                plan.popular 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}