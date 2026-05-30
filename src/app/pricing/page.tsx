"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    features: [
      "3 audits per month",
      "Basic performance check",
      "SEO overview",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious store owners",
    features: [
      "Unlimited audits",
      "Detailed PDF reports",
      "Competitor analysis",
      "Priority support",
      "Export to CSV/PDF",
      "API access",
    ],
    cta: "Get Pro Access",
    popular: true,
    plan: "pro",
  },
  {
    name: "Agency",
    price: "$49",
    period: "/month",
    description: "For agencies & teams",
    features: [
      "Everything in Pro",
      "Up to 50 stores",
      "White-label reports",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Get Agency Access",
    popular: false,
    plan: "agency",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!email && plan !== "free") {
      setShowEmailInput(plan);
      return;
    }

    if (plan === "free") {
      window.location.href = "/";
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Choose the plan that&apos;s right for your business. Upgrade or downgrade anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-500">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {showEmailInput === plan.plan && (
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}

                <button
                  onClick={() => handleSubscribe(plan.plan || "free")}
                  disabled={loading === plan.plan}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {loading === plan.plan ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately."
              },
              {
                q: "Is there a free trial?",
                a: "Our Free plan gives you 3 audits per month forever. No credit card required."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards through Stripe secure payments."
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 14-day money-back guarantee if you're not satisfied."
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2024 SiteCheck Pro. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
