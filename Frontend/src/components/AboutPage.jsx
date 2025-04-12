"use client"

import { 
  Shield,
  Lock,
  Key,
  Globe,
  Users,
  Zap,
  Code,
  Heart
} from "lucide-react"

export function AboutPage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-emerald-500" />,
      title: "Military-Grade Security",
      description: "AES-256 encryption protects your data with the same standard used by governments and banks worldwide."
    },
    {
      icon: <Lock className="h-8 w-8 text-emerald-500" />,
      title: "Zero-Knowledge Architecture",
      description: "Only you can access your data. We never store or see your master password."
    },
    {
      icon: <Key className="h-8 w-8 text-emerald-500" />,
      title: "Password Generator",
      description: "Create strong, unique passwords for all your accounts with our advanced generator."
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-500" />,
      title: "Cross-Platform Sync",
      description: "Access your passwords anywhere with seamless sync across all your devices."
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: "Secure Sharing",
      description: "Safely share passwords with family or team members when needed."
    },
    {
      icon: <Zap className="h-8 w-8 text-emerald-500" />,
      title: "Instant Auto-Fill",
      description: "Log in to websites with one click using our browser extensions."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About SecureKey</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Your trusted partner in digital security since 2020
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-slate-300 mb-8">
              At SecureKey, we believe everyone deserves simple, powerful protection for their digital life. 
              We're committed to making world-class security accessible to all.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500">
              <Heart className="mr-2 h-5 w-5" />
              <span>Built with care in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SecureKey</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-emerald-500 transition-colors">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">Security Experts</h3>
              <p className="text-slate-400 mt-2">Cryptography specialists keeping your data safe</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 mb-4 flex items-center justify-center">
                <Code className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">Developers</h3>
              <p className="text-slate-400 mt-2">Building intuitive, powerful tools for you</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 mb-4 flex items-center justify-center">
                <Heart className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold">Support Team</h3>
              <p className="text-slate-400 mt-2">Always ready to help with any questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Digital Life?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Join millions of users who trust SecureKey to protect their online identities.
          </p>
          <button className="px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors">
            Get Started for Free
          </button>
        </div>
      </section>
    </div>
  )
}
