"use client";

import { useState } from "react";
import { Search, Zap, Shield, TrendingUp, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface AuditResult {
  url: string;
  score: number;
  performance: {
    score: number;
    loadTime: string;
    pageSize: string;
    issues: string[];
  };
  seo: {
    score: number;
    metaTags: boolean;
    headings: boolean;
    schemaMarkup: boolean;
    issues: string[];
  };
  mobile: {
    score: number;
    responsive: boolean;
    viewport: boolean;
    issues: string[];
  };
  conversion: {
    score: number;
    hasCart: boolean;
    hasReviews: boolean;
    hasTrustBadges: boolean;
    issues: string[];
  };
  security: {
    score: number;
    https: boolean;
    issues: string[];
  };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to audit website');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="text-white py-20 px-4" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Audit Your Shopify Store
            <span className="block text-blue-400">in 30 Seconds</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get actionable insights to boost your store&apos;s performance, SEO, and conversions. 
            Used by 2,000+ Shopify merchants.
          </p>

          {/* Search Form */}
          <form onSubmit={runAudit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your store URL (e.g., mystore.com)"
                className="flex-1 px-6 py-4 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Audit Now
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Overall Score */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Audit Results for {result.url}</h2>
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(result.score)}`}>
                <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
              </div>
              <p className="mt-4 text-slate-600">
                {result.score >= 80 ? "Great job! Your store is performing well." :
                 result.score >= 60 ? "Good start, but there's room for improvement." :
                 "Your store needs attention. Check the issues below."}
              </p>
            </div>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Performance</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.performance.score)}`}>
                      {result.performance.score}/100
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">Load: {result.performance.loadTime}</p>
                <p className="text-sm text-slate-600 mb-3">Size: {result.performance.pageSize}</p>
                <ul className="space-y-2">
                  {result.performance.issues.slice(0, 3).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      {issue.includes('good') || issue.includes('✓') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">SEO</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.seo.score)}`}>
                      {result.seo.score}/100
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span className={result.seo.metaTags ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-red-600 bg-red-50 px-2 py-1 rounded"}>
                    {result.seo.metaTags ? "✓ Meta" : "✗ Meta"}
                  </span>
                  <span className={result.seo.headings ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-red-600 bg-red-50 px-2 py-1 rounded"}>
                    {result.seo.headings ? "✓ H1" : "✗ H1"}
                  </span>
                  <span className={result.seo.schemaMarkup ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-amber-600 bg-amber-50 px-2 py-1 rounded"}>
                    {result.seo.schemaMarkup ? "✓ Schema" : "Schema"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {result.seo.issues.slice(0, 3).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      {issue.includes('covered') || issue.includes('good') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Mobile</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.mobile.score)}`}>
                      {result.mobile.score}/100
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {result.mobile.responsive ? "✓ Mobile responsive" : "✗ Not mobile responsive"}
                </p>
                <ul className="space-y-2">
                  {result.mobile.issues.slice(0, 3).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      {issue.includes('✓') || issue.includes('good') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conversion */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Conversion</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.conversion.score)}`}>
                      {result.conversion.score}/100
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span className={result.conversion.hasCart ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-red-600 bg-red-50 px-2 py-1 rounded"}>
                    {result.conversion.hasCart ? "✓ Cart" : "✗ Cart"}
                  </span>
                  <span className={result.conversion.hasReviews ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-amber-600 bg-amber-50 px-2 py-1 rounded"}>
                    {result.conversion.hasReviews ? "✓ Reviews" : "Reviews"}
                  </span>
                  <span className={result.conversion.hasTrustBadges ? "text-green-600 bg-green-50 px-2 py-1 rounded" : "text-amber-600 bg-amber-50 px-2 py-1 rounded"}>
                    {result.conversion.hasTrustBadges ? "✓ Trust" : "Trust"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {result.conversion.issues.slice(0, 3).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      {issue.includes('detected') || issue.includes('good') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Security</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(result.security.score)}`}>
                      {result.security.score}/100
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {result.security.https ? "✓ HTTPS enabled" : "✗ HTTPS not enabled"}
                </p>
                <ul className="space-y-2">
                  {result.security.issues.slice(0, 3).map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      {issue.includes('good') ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl p-8 text-center text-white" style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
              <h3 className="text-2xl font-bold mb-4">Get the Full Report + Action Plan</h3>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                Upgrade to Pro for detailed recommendations, competitor benchmarks, and a prioritized action plan to boost your store&apos;s performance.
              </p>
              <a href="/pricing" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Get Full Report - $19
              </a>
              <p className="mt-3 text-sm text-blue-200">One-time payment • Instant delivery</p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!result && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              What We Analyze
            </h2>
            <div className="grid md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Performance</h3>
                <p className="text-slate-600 text-sm">Load speed, image optimization, and Core Web Vitals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">SEO</h3>
                <p className="text-slate-600 text-sm">Meta tags, headings, and search engine visibility</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Mobile</h3>
                <p className="text-slate-600 text-sm">Responsive design and mobile usability</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Conversion</h3>
                <p className="text-slate-600 text-sm">Checkout flow, trust signals, and CTA optimization</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
                <p className="text-slate-600 text-sm">HTTPS, SSL certificates, and data protection</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">© 2024 SiteCheck Pro. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
