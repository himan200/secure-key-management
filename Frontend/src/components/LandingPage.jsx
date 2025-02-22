"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Key, Lock, CheckCircle, ArrowRight } from "lucide-react"
import { Navbar } from "./Navbar"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 pt-16">
        <div className="container h-full mx-auto px-4 grid place-items-center">
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-blob" />
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute -bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
              <Key className="absolute top-20 -left-10 w-32 h-32 text-white/10 rotate-45" />
              <Lock className="absolute bottom-20 -right-10 w-32 h-32 text-white/10 -rotate-12" />
              <Shield className="absolute top-1/2 left-1/3 w-40 h-40 text-white/10" />
            </div>

            {/* Content */}
            <motion.div
              className="relative z-10 text-center py-20"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">Secure Your Digital World</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto">
                Advanced password management system that helps you generate, analyze, and securely store your
                credentials.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transform transition-all duration-200 text-lg px-8"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 hover:scale-105 transform transition-all duration-200 text-lg px-8"
                >
                  <Link to="/learn-more">Learn More</Link>
                </Button>
              </div>

              {/* Stats or Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">100K+</div>
                  <div className="text-white/80">Active Users</div>
                </div>
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-white/80">Uptime</div>
                </div>
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <div className="text-white/80">User Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain unchanged */}
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            Powerful Features for Ultimate Security
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon={<Key />}
              title="Password Generator"
              description="Create strong, unique passwords with our advanced generator"
            />
            <FeatureCard
              icon={<Shield />}
              title="Strength Analysis"
              description="Check your password strength with detailed security insights"
            />
            <FeatureCard
              icon={<Lock />}
              title="Secure Storage"
              description="Store your passwords with end-to-end encryption"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            Why Choose SecureKey?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <BenefitItem
              title="Military-Grade Encryption"
              description="Your data is protected with the highest level of encryption"
            />
            <BenefitItem title="Cross-Platform Access" description="Access your passwords securely from any device" />
            <BenefitItem
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
            <BenefitItem title="Automatic Backups" description="Never worry about losing your important credentials" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Digital Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SecureKey for their password management needs.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-8 text-lg bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transform transition-all duration-200"
          >
            <Link to="/register">
              Get Started Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-purple-600 w-8 h-8">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}

function BenefitItem({ title, description }) {
  return (
    <motion.div
      className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="flex-shrink-0">
        <CheckCircle className="w-6 h-6 text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

