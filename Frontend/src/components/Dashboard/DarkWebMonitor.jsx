import { useState } from 'react';
import api from '../../api';
import { AlertTriangle, ShieldAlert, Lock, Bell, RefreshCw } from 'lucide-react';

export function DarkWebMonitor() {
  const [email, setEmail] = useState('');
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultStatus, setResultStatus] = useState('idle'); // 'idle' | 'checking' | 'complete'

  const checkBreaches = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResultStatus('checking');
      const response = await api.get(`/breaches/${encodeURIComponent(email)}`);
      if (response.data?.success && response.data?.breaches) {
        setBreaches(response.data.breaches);
      } else {
        throw new Error(response.data?.error || 'Invalid response from server');
      }
    } catch (err) {
      console.error('Breach check error:', err);
      let errorMessage = 'Failed to check breaches.';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'API key invalid or missing. Contact administrator.';
        } else if (err.response.status === 404) {
          errorMessage = 'No breaches found - your email appears secure!';
          setBreaches([]);
        } else if (err.response.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setResultStatus('complete');
    }
  };

  return (
    <div className={`min-h-screen ${breaches.length > 0 ? 'bg-gradient-to-b from-red-800 to-red-900' : 'bg-gray-900'} text-white`}>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {breaches.length > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-300" />
                Oh no — pwned!
              </span>
            ) : (
              'Dark Web Monitoring'
            )}
          </h1>
          <p className="text-lg">
            {breaches.length > 0 
              ? `Pwned in ${breaches.length} data breach${breaches.length > 1 ? 'es' : ''}`
              : 'Check if your email has been compromised in data breaches'}
          </p>
        </div>

        {/* Email Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none text-gray-800 bg-white shadow-sm transition-all"
          />
          <button 
            onClick={checkBreaches}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin h-5 w-5" />
                Scanning...
              </>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5" />
                Check Now
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {error && (
          <div className={`p-4 mb-6 rounded-xl ${error.includes('secure') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'} shadow-inner`}>
            <div className="flex items-center">
              {error.includes('secure') ? (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Only show results if user has submitted */}
        {resultStatus === 'complete' && (
          <>
            {/* Security Steps Section */}
            {breaches.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 justify-center mb-6">
                  <Lock className="text-blue-300 h-6 w-6" />
                  <h2 className="text-xl font-semibold">3 Steps to better security</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="bg-yellow-100 rounded-lg overflow-hidden text-gray-800">
                    <div className="p-4 h-48 flex items-center justify-center bg-yellow-200">
                      <Lock className="h-16 w-16 text-yellow-600" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">Step 1: Change Passwords</h3>
                      <p>Immediately change passwords for any accounts using this email address.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-yellow-100 rounded-lg overflow-hidden text-gray-800">
                    <div className="p-4 h-48 flex items-center justify-center bg-yellow-200">
                      <ShieldAlert className="h-16 w-16 text-yellow-600" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">Step 2: Enable 2FA</h3>
                      <p>Set up two-factor authentication for all important accounts.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-yellow-100 rounded-lg overflow-hidden text-gray-800">
                    <div className="p-4 h-48 flex items-center justify-center bg-yellow-200">
                      <Bell className="h-16 w-16 text-yellow-600" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">Step 3: Monitor Accounts</h3>
                      <p>Watch for suspicious activity and consider credit monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Breaches Section */}
            {breaches.length > 0 ? (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Breaches you were pwned in</h2>
                <p className="mb-6">
                  A "breach" is an incident where data has been unintentionally exposed to the public. Using unique passwords
                  for each service helps ensure that a breach of one service doesn't put your other accounts at risk.
                </p>

                {breaches.map((breach) => (
                  <div key={breach.Name} className="flex gap-4 mb-6 bg-red-950 p-4 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="bg-white p-2 rounded-lg w-20 h-20 flex items-center justify-center overflow-hidden">
                        {breach.Domain ? (
                          <div className="relative w-full h-full">
                            <img
                              src={`https://haveibeenpwned.com/Content/Images/PwnedLogos/${breach.Domain.toLowerCase().replace(/^www\./, '')}.png`}
                              alt={breach.Name || 'Breach logo'}
                              className="w-full h-full object-contain absolute"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full flex items-center justify-center';
                                fallback.innerHTML = breach.Name ? (
                                  `<span class="text-red-500 font-bold text-xl">
                                    ${breach.Name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                                  </span>`
                                ) : (
                                  '<svg class="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 6h2v6h-2zm0 8h2v2h-2z"/></svg>'
                                );
                                e.target.parentNode.appendChild(fallback);
                              }}
                            />
                            {/* Loading fallback initially hidden */}
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-red-500 font-bold text-xl">
                                {breach.Name?.split(' ').map(w => w[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                          </div>
                        ) : breach.Name ? (
                          <span className="text-red-500 font-bold text-xl">
                            {breach.Name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                          </span>
                        ) : (
                          <AlertTriangle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div>
                      <span className="font-bold text-blue-300">{breach.Title || breach.Name || 'Unknown Breach'}</span>
                      {breach.Description ? (
                        <p className="mt-1 text-gray-300">{breach.Description}</p>
                      ) : (
                        <p className="mt-1 text-gray-400 italic">No detailed description provided by breach database</p>
                      )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        {breach.BreachDate && (
                          <div className="text-gray-300">
                            <span className="font-medium">Breach Date:</span> {new Date(breach.BreachDate).toLocaleDateString()}
                          </div>
                        )}
                      {breach.PwnCount !== undefined && (
                          <div className="text-gray-300 col-span-2">
                            <span className="font-medium">Accounts Affected:</span> 
                            <span className="ml-1 font-bold text-red-400 text-lg">
                              {typeof breach.PwnCount === 'number' 
                                ? breach.PwnCount.toLocaleString() 
                                : 'Unknown'}
                            </span>
                          </div>
                        )}
                        {breach.Domain && (
                          <div className="text-gray-300 col-span-2">
                            <span className="font-medium">Affected Services:</span> 
                            <span className="ml-1 font-medium text-blue-300">
                              {breach.Domain.includes(',') 
                                ? breach.Domain.split(',').map(d => d.trim()).join(', ') 
                                : breach.Domain}
                            </span>
                          </div>
                        )}
                      </div>
                      {breach.DataClasses?.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium text-gray-300 mb-1">Compromised Data:</div>
                          <div className="grid grid-cols-2 gap-2">
                            {breach.DataClasses.map((dataClass, index) => (
                              <div key={index} className="bg-blue-800 px-2 py-1 rounded text-sm">
                                {dataClass}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-inner text-center">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-green-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xl font-bold text-green-800 mb-1">No Breaches Found</h3>
                  <p className="text-green-700">Your email appears secure in our database</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}