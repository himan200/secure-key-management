"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Key, Lock, ArrowRight, Fingerprint, Globe, Eye } from "lucide-react"
import { Navbar } from "./Navbar"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const dropIn = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  transition: {
    type: "spring",
    damping: 10,
    stiffness: 100,
  },
}

export function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const backgroundControls = useAnimation()

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    backgroundControls.start({
      backgroundPosition: `${mousePosition.x / 50}px ${mousePosition.y / 50}px`,
    })
  }, [mousePosition, backgroundControls])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0A0B1E] to-[#1A1B3B]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0B1E] via-[#1A1B3B] to-[#2A2B4B]"></div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-3/4 left-1/2 w-48 h-48 bg-green-500 rounded-full filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
            <motion.div className="text-left pt-20 lg:pt-0" initial="initial" animate="animate" variants={fadeIn}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Secure Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  Digital World
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-xl">
                Advanced password management system that helps you generate, analyze, and securely store your
                credentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 text-white hover:bg-purple-700 transform transition-all duration-200 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-purple-500/50"
                >
                  <Link to="/register" className="no-underline">
                    Get Started
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 transform transition-all duration-200 text-lg px-8 py-6 rounded-full border-0"
                >
                  <Link to="/learn-more" className="no-underline">
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[500px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-40 h-40 text-purple-200" />
                </div>
              </div>
              <motion.div
                className="absolute -top-8 -left-8 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
              >
                <Fingerprint className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -right-8 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 1.5 }}
              >
                <Globe className="w-10 h-10 text-white" />
              </motion.div>
              {/* <motion.div
                className="absolute top-1/2 right-0 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ x: [0, 20, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 0.75 }}
              >
                <Key className="w-8 h-8 text-white" />
              </motion.div> */}
              {/* <motion.div
                className="absolute bottom-0 left-1/4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 2.25 }}
              >
                <Eye className="w-8 h-8 text-white" />
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-[#1A1B3B] to-[#2A2B4B]">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            Powerful Features for Ultimate Security
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard
              icon={<Key className="w-8 h-8 text-purple-400" />}
              title="Password Generator"
              description="Create strong, unique passwords with our advanced generator"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-purple-400" />}
              title="Strength Analysis"
              description="Check your password strength with detailed security insights"
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8 text-purple-400" />}
              title="Secure Storage"
              description="Store your passwords with end-to-end encryption"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-[#2A2B4B] to-[#1A1B3B]">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            Why Choose SecureKey?
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={dropIn}>
              <BenefitCard
                icon={<Shield className="w-8 h-8 text-purple-400" />}
                title="Military-Grade Encryption"
                description="Your data is protected with the highest level of encryption"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={dropIn}
              transition={{ delay: 0.2 }}
            >
              <BenefitCard
                icon={<Globe className="w-8 h-8 text-purple-400" />}
                title="Cross-Platform Access"
                description="Access your passwords securely from any device"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={dropIn}
              transition={{ delay: 0.4 }}
            >
              <BenefitCard
                icon={<Fingerprint className="w-8 h-8 text-purple-400" />}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={dropIn}
              transition={{ delay: 0.6 }}
            >
              <BenefitCard
                icon={<Key className="w-8 h-8 text-purple-400" />}
                title="Automatic Backups"
                description="Never worry about losing your important credentials"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#1A1B3B] to-[#0A0B1E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Secure Your Digital Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of users who trust SecureKey for their password management needs.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-purple-600 text-white hover:bg-purple-700 transform transition-all duration-200 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-purple-500/50"
          >
            <Link to="/register" className="no-underline text-inherit hover:no-underline">
              Get Started Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function BenefitCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm border border-gray-800/50 h-full">
      <div className="flex items-center mb-4">
        <div className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mr-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 ml-[4.5rem]">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="p-6 rounded-2xl bg-gray-900/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full backdrop-blur-sm border border-gray-800/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center mb-4">
        <div className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mr-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 ml-[4.5rem]">{description}</p>
    </motion.div>
  )
}

