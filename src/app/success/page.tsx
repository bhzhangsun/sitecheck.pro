"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Mail } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [plan, setPlan] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment?session_id=${sessionId}`);
        const data = await response.json();

        if (data.status === "paid") {
          setStatus("success");
          setPlan(data.plan || "pro");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    checkStatus();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Failed</h1>
          <p className="text-slate-600 mb-6">
            We couldn&apos;t verify your payment. Please contact support if you believe this is an error.
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Pricing
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Welcome to SiteCheck {plan === "agency" ? "Agency" : "Pro"}!
        </h1>
        <p className="text-slate-600 mb-6">
          Your payment was successful. You now have access to unlimited website audits and detailed reports.
        </p>

        <div className="bg-white rounded-xl shadow p-6 mb-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700">Check your email for access details</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Unlimited website audits
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Detailed PDF reports
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Priority support
            </li>
          </ul>
        </div>

        <a
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Your First Audit
        </a>
      </div>
    </main>
  );
}
