import {
  BookOpen, BarChart3, TrendingUp, Shield, Target, Brain,
  CheckCircle2, ArrowRight, AlertCircle, Zap, Clock,
  Users, Star, DollarSign, Activity, LineChart, PieChart,
  Eye, Lock, Smartphone, Globe, ChevronDown, X, Check
} from "lucide-react";
import Link from "next/link";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function LandingPage() {
  const stats = [
    { number: "50K+", label: "Active Traders" },
    { number: "2M+", label: "Trades Logged" },
    { number: "94%", label: "Win Rate Improved" },
    { number: "4.9/5", label: "User Rating" }
  ];

  const problems = [
    {
      icon: AlertCircle,
      title: "No Trade History",
      description: "Can't remember what worked or what didn't. Making the same mistakes repeatedly."
    },
    {
      icon: Brain,
      title: "Emotional Trading",
      description: "Trading based on feelings instead of data. Unable to identify emotional patterns."
    },
    {
      icon: Target,
      title: "No Accountability",
      description: "No system to track and review performance. Hard to measure actual progress."
    },
    {
      icon: TrendingUp,
      title: "Missed Patterns",
      description: "Can't see winning strategies or losing habits. Flying blind without insights."
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Journal",
      description: "Log every trade with prices, emotions, strategies, and screenshots. Never forget a trade again."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track win rate, profit factor, expectancy, and more. See exactly what's working."
    },
    {
      icon: LineChart,
      title: "Equity Curve",
      description: "Visualize your account growth over time. Spot trends and drawdowns instantly."
    },
    {
      icon: Brain,
      title: "Psychology Tracking",
      description: "Monitor emotions and confidence levels. Understand your mental game."
    },
    {
      icon: Target,
      title: "Risk Management",
      description: "Calculate R:R ratios automatically. Manage position sizing effectively."
    },
    {
      icon: PieChart,
      title: "Performance Charts",
      description: "Interactive visualizations for win/loss, market performance, and strategy breakdown."
    },
    {
      icon: Clock,
      title: "Time Analysis",
      description: "Discover which trading sessions and timeframes work best for you."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level encryption. Your trading data stays completely private."
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Access your journal anywhere. Responsive design for all devices."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Log Your Trades",
      description: "Enter trade details including entry, exit, stop loss, target, and emotions. Takes less than 2 minutes per trade."
    },
    {
      step: "2",
      title: "Automatic Calculations",
      description: "Our system calculates P&L, win rate, risk-reward, and profit factor automatically. No spreadsheets needed."
    },
    {
      step: "3",
      title: "Analyze Performance",
      description: "Review charts, identify patterns, and discover what strategies work best for your trading style."
    },
    {
      step: "4",
      title: "Improve Consistently",
      description: "Use insights to refine your edge, eliminate mistakes, and become a consistently profitable trader."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Day Trader",
      content: "This journal changed my trading completely. I finally understand my patterns and my win rate improved from 45% to 68% in 3 months.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Swing Trader",
      content: "The psychology tracking is a game-changer. I can now see exactly when I'm trading emotionally and avoid those trades.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Crypto Trader",
      content: "Best trading tool I've ever used. The analytics are incredibly detailed and the interface is super intuitive.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Do I need to be an experienced trader?",
      answer: "No! TradeJournal works for traders of all levels. Whether you're just starting or have years of experience, journaling will improve your trading."
    },
    {
      question: "What markets are supported?",
      answer: "We support all markets: Stocks, Forex, Crypto, Futures, and Options. Track any asset class you trade."
    },
    {
      question: "Can I import existing trades?",
      answer: "Yes! You can import trades via CSV from your broker or other platforms (coming soon)."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption and never share your data. Your trading journal is completely private."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! Export your trades to CSV anytime. You own your data."
    },
    {
      question: "Do you offer a mobile app?",
      answer: "The web app is fully responsive and works perfectly on mobile. A dedicated mobile app is coming soon."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              🚀 Join 50,000+ Profitable Traders
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              Turn Your Trading Into a
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Science</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The #1 trading journal used by professional traders to track, analyze, and improve their performance.
              Stop guessing. Start winning.
            </p>

            <div className="flex justify-center gap-4 flex-wrap mb-12">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-border px-8 py-4 text-lg font-semibold hover:bg-muted transition-colors"
              >
                <Eye className="h-5 w-5" />
                View Demo
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Free forever plan</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why 90% of Traders Fail
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Without proper tracking and analysis, you're trading blind. These problems hold most traders back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <div key={index} className="p-6 rounded-xl border-2 border-red-200 bg-card hover:shadow-lg transition-shadow">
                <problem.icon className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                  The Solution
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Your Trading Edge, Quantified
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  TradeJournal gives you the clarity and insights professional traders use to stay profitable.
                  Every trade logged. Every mistake tracked. Every pattern revealed.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Data-Driven Decisions</div>
                      <div className="text-muted-foreground">Stop trading on gut feeling. See exactly what works with real data.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Eliminate Emotional Trading</div>
                      <div className="text-muted-foreground">Track your psychology and identify when emotions are driving your decisions.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Consistent Improvement</div>
                      <div className="text-muted-foreground">Review, refine, and improve your edge every single week.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl border-4 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Win Rate</div>
                          <div className="text-2xl font-bold text-green-600">72.5%</div>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm">↑ 18%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Total P&L</div>
                          <div className="text-2xl font-bold text-blue-600">$24,750</div>
                        </div>
                      </div>
                      <div className="text-blue-600 text-sm">↑ 42%</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Avg R:R</div>
                          <div className="text-2xl font-bold text-purple-600">2.8</div>
                        </div>
                      </div>
                      <div className="text-purple-600 text-sm">↑ 23%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools that make journaling effortless and insights actionable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-xl border bg-card hover:shadow-xl hover:border-primary/50 transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start improving your trading in 4 simple steps
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-lg text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by Traders Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what professional traders are saying about TradeJournal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 rounded-xl border bg-card shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about TradeJournal
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 50,000+ traders who have improved their performance with TradeJournal.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-background text-foreground px-10 py-5 text-lg font-semibold hover:bg-background/90 transition-all shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-foreground/30 px-10 py-5 text-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              <Eye className="h-5 w-5" />
              View Demo
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TradeJournal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The #1 trading journal for professional traders worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></div>
                <div><Link href="/journal" className="hover:text-foreground">Journal</Link></div>
                <div><Link href="/analytics" className="hover:text-foreground">Analytics</Link></div>
                <div><Link href="/pricing" className="hover:text-foreground">Pricing</Link></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link href="/blog" className="hover:text-foreground">Blog</Link></div>
                <div><Link href="/guides" className="hover:text-foreground">Trading Guides</Link></div>
                <div><Link href="/help" className="hover:text-foreground">Help Center</Link></div>
                <div><Link href="/api" className="hover:text-foreground">API Docs</Link></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link href="/about" className="hover:text-foreground">About Us</Link></div>
                <div><Link href="/contact" className="hover:text-foreground">Contact</Link></div>
                <div><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></div>
                <div><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></div>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 TradeJournal. All rights reserved. Made with ❤️ for traders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
