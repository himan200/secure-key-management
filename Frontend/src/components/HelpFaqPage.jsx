"use client"

import { useState } from "react"
import { 
  HelpCircle,
  ChevronDown, 
  ChevronUp,
  Lock,
  Shield,
  Key,
  AlertTriangle,
  MessageCircle,
  Mail,
  CreditCard,
  Smartphone,
  Globe,
  Download,
  Users,
  Settings
} from "lucide-react"

export function HelpFaqPage() {
  const [expandedFaqs, setExpandedFaqs] = useState({})
  const [activeCategory, setActiveCategory] = useState("general")

  const faqCategories = [
    { id: "general", name: "General", icon: <HelpCircle size={18} /> },
    { id: "security", name: "Security", icon: <Shield size={18} /> },
    { id: "account", name: "Account", icon: <Lock size={18} /> },
    { id: "features", name: "Features", icon: <Key size={18} /> },
    { id: "troubleshooting", name: "Troubleshooting", icon: <AlertTriangle size={18} /> },
    { id: "billing", name: "Billing", icon: <CreditCard size={18} /> }
  ]

  const faqData = {
    general: [
      {
        question: "What is SecureKey and how does it work?",
        answer: "SecureKey is a comprehensive password management solution that helps you generate, store, and manage all your passwords in one secure vault. It uses military-grade encryption to protect your sensitive information."
      },
      {
        question: "Is SecureKey available on mobile devices?",
        answer: "Yes, SecureKey has dedicated apps for both iOS and Android platforms, with full synchronization across all your devices."
      },
      {
        question: "How do I import passwords from another password manager?",
        answer: "You can import from most popular password managers via CSV files. Go to Settings > Import to begin the process."
      },
      {
        question: "What languages does SecureKey support?",
        answer: "SecureKey currently supports English, Hindi, Spanish, French, and German with more languages coming soon."
      },
      {
        question: "Can I use SecureKey offline?",
        answer: "Yes, SecureKey works offline with all your data stored locally. Changes will sync when you reconnect to the internet."
      },
      {
        question: "Is there a family plan available?",
        answer: "Yes, our Family Plan allows you to share passwords securely with up to 5 family members."
      }
    ],
    security: [
      {
        question: "What encryption does SecureKey use?",
        answer: "We use AES-256 bit encryption, the same standard used by banks and governments worldwide."
      },
      {
        question: "Does SecureKey support two-factor authentication?",
        answer: "Yes, we support multiple 2FA methods including authenticator apps, SMS, and hardware security keys."
      },
      {
        question: "What happens if I forget my master password?",
        answer: "For security reasons, we cannot recover your master password. We recommend setting up account recovery options during initial setup."
      },
      {
        question: "How often should I change my master password?",
        answer: "We recommend changing it every 3-6 months for optimal security."
      },
      {
        question: "Can SecureKey detect compromised passwords?",
        answer: "Yes, our security dashboard alerts you if any of your passwords appear in known data breaches."
      },
      {
        question: "Is my data backed up?",
        answer: "Yes, we maintain encrypted backups of all vault data to prevent data loss."
      }
    ],
    account: [
      {
        question: "How do I create a SecureKey account?",
        answer: "Download the app and follow the setup wizard. You'll need to create a strong master password and verify your email."
      },
      {
        question: "How do I change my account email?",
        answer: "Go to Account Settings > Profile Information to update your email address."
      },
      {
        question: "Can I share passwords with family members?",
        answer: "Yes, our Family Plan allows secure password sharing with up to 5 family members."
      },
      {
        question: "How do I delete my SecureKey account?",
        answer: "Account deletion is available in Account Settings > Advanced. This action is permanent and irreversible."
      },
      {
        question: "What happens to my data if I cancel my subscription?",
        answer: "You'll retain access to all your passwords but lose premium features like dark web monitoring."
      },
      {
        question: "Can I export my passwords?",
        answer: "Yes, you can export your vault data in CSV format from the Settings menu."
      }
    ],
    features: [
      {
        question: "Does SecureKey have a password generator?",
        answer: "Yes, our generator creates strong, unique passwords with customizable length and character types."
      },
      {
        question: "Can SecureKey auto-fill passwords on websites?",
        answer: "Yes, our browser extensions automatically fill login forms on supported websites."
      },
      {
        question: "Does SecureKey store credit card information?",
        answer: "Yes, our secure vault can store payment cards, IDs, and secure notes."
      },
      {
        question: "Is there a password strength checker?",
        answer: "Yes, we analyze and rate all your stored passwords for strength and vulnerabilities."
      },
      {
        question: "Does SecureKey work with biometric authentication?",
        answer: "Yes, you can use fingerprint or face recognition on supported devices."
      },
      {
        question: "Can I organize passwords into folders?",
        answer: "Yes, you can create custom folders and categories to organize your passwords."
      }
    ],
    troubleshooting: [
      {
        question: "Why isn't auto-fill working in my browser?",
        answer: "Ensure the extension is installed and enabled. Check for conflicts with other password managers."
      },
      {
        question: "What should I do if the app keeps crashing?",
        answer: "Try updating to the latest version, clearing cache, or reinstalling the application."
      },
      {
        question: "Why are my passwords not syncing across devices?",
        answer: "Check your internet connection and ensure sync is enabled in settings."
      },
      {
        question: "How do I fix slow performance?",
        answer: "Try organizing passwords into folders if you have a large number of entries."
      },
      {
        question: "What if I'm not receiving verification emails?",
        answer: "Check your spam folder and ensure our domain is whitelisted in your email client."
      },
      {
        question: "Why can't I log in to my account?",
        answer: "Ensure you're using the correct master password. If you've forgotten it, you'll need to reset your account."
      }
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, PayPal, and major cryptocurrencies."
      },
      {
        question: "How do I upgrade or downgrade my plan?",
        answer: "Go to Account Settings > Billing to change your subscription plan."
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a 14-day free trial of our Premium features."
      },
      {
        question: "How do I cancel my subscription?",
        answer: "You can cancel anytime in Account Settings > Billing."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee on all paid plans."
      },
      {
        question: "When will I be charged for renewal?",
        answer: "Subscriptions automatically renew 24 hours before the end of the current period."
      }
    ]
  }

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4">
            <HelpCircle className="text-emerald-500 h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-slate-400">
            Find answers to your questions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeCategory === category.id 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Contact Support</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-slate-600 hover:bg-slate-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="md:col-span-3">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold">
                  {faqCategories.find(c => c.id === activeCategory)?.name} Questions
                </h2>
              </div>

              <div className="divide-y divide-slate-700">
                {faqData[activeCategory].map((faq, index) => (
                  <div key={index} className="p-6 hover:bg-slate-700/30">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-start text-left"
                    >
                      <h3 className="text-lg font-medium">{faq.question}</h3>
                      {expandedFaqs[index] ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    {expandedFaqs[index] && (
                      <div className="mt-4 text-slate-300">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SecureKey. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
