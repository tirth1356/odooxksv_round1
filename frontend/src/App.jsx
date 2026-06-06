import { useState } from 'react';
import Dashboard from './views/Dashboard';
import { useDialog } from './context/DialogContext';
import './App.css';
import { API_BASE_URL } from './config';

export default function App() {
  const { showAlert } = useDialog();
  const [screen, setScreen] = useState('login'); // 'login', 'register', or 'dashboard'

  const [userRole, setUserRole] = useState(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('Vendor');
  const [regCountry, setRegCountry] = useState('India');
  const [regInfo, setRegInfo] = useState('');
  const [regTerms, setRegTerms] = useState(false);
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [regStep, setRegStep] = useState(1);

  const validateStep1 = () => {
    if (!regFirstName.trim()) {
      showAlert('First Name is required.');
      return false;
    }
    if (!regLastName.trim()) {
      showAlert('Last Name is required.');
      return false;
    }
    if (!regEmail.trim()) {
      showAlert('Email Address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      showAlert('Please enter a valid email address.');
      return false;
    }
    if (!regPhone.trim()) {
      showAlert('Phone Number is required.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!regPassword) {
      showAlert('Password is required.');
      return false;
    }
    if (regPassword.length < 6) {
      showAlert('Password must be at least 6 characters long.');
      return false;
    }
    if (!regCountry.trim()) {
      showAlert('Country/Region is required.');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        try {
          const payload = JSON.parse(atob(data.access.split('.')[1]));
          setUserRole(payload.role || 'Vendor');
        } catch(e) {
          setUserRole('Vendor');
        }
        setScreen('dashboard');
      } else {
        setAuthError(data.detail || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error connecting to backend.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!validateStep1() || !validateStep2()) {
      return;
    }
    if (!regTerms) {
      showAlert('You must agree to the Terms of Service and Data Privacy Policy.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regEmail, // Using email as username
          email: regEmail,
          password: regPassword,
          first_name: regFirstName,
          last_name: regLastName,
          phone_number: regPhone,
          role: regRole,
          country: regCountry,
          additional_information: regInfo
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess('Partner registration submitted successfully! You may now log in.');
        setScreen('login');
        setRegStep(1);
      } else {
        let errorMsg = '';
        if (typeof data === 'object' && data !== null) {
          errorMsg = Object.entries(data).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${Array.isArray(v) ? v[0] : v}`).join(' | ');
        } else {
          errorMsg = String(data);
        }
        setAuthError(errorMsg);
      }
    } catch (err) {
      setAuthError('Network error connecting to backend.');
    }
  };

  if (screen === 'dashboard') {
    return <Dashboard userRole={userRole || 'Procurement Officer'} onLogout={() => { setScreen('login'); setUserRole(null); localStorage.clear(); }} />;
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden selection:bg-primary/30 relative flex flex-col justify-between">

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden auth-bg">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] float-anim"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-secondary-container/20 rounded-full blur-[150px]"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-gutter">

        {screen === 'login' && (
          <section className="w-full max-w-[440px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                <span className="material-symbols-outlined text-on-primary-container !text-4xl">business_center</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">VendorBridge</h1>
              <p className="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mt-1">PROCUREMENT ERP SYSTEM</p>
            </div>

            <div className="glass-surface p-8 rounded-xl shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h2 className="font-headline-md text-headline-md mb-6">Portal Access</h2>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div className="space-y-2 group">
                  <label className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="login-email">Corporate Email</label>
                  <div className="relative input-focus-glow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">alternate_email</span>
                    <input
                      className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg pl-10 py-3 text-body-md transition-all text-on-surface"
                      id="login-email"
                      placeholder="name@company.com"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary transition-colors" htmlFor="login-password">Access Key</label>
                    <a className="font-body-sm text-body-sm text-primary hover:underline decoration-primary/30" href="#" onClick={(e) => { e.preventDefault(); showAlert('Reset link sent to your corporate email.'); }}>Forgot?</a>
                  </div>
                  <div className="relative input-focus-glow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">lock_open</span>
                    <input
                      className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg pl-10 py-3 text-body-md transition-all text-on-surface"
                      id="login-password"
                      placeholder="••••••••"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-title-sm text-title-sm py-3.5 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-primary/10 flex items-center justify-center gap-2 mt-4"
                >
                  Authorize Entry
                  <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
                </button>
                {authError && <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-center mt-4 font-body-sm">{authError}</div>}
                {authSuccess && <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-center mt-4 font-body-sm">{authSuccess}</div>}
              </form>

              <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-4">
                <p className="font-body-sm text-body-sm text-on-surface-variant">New vendor or procurement partner?</p>
                <button
                  className="text-primary font-title-sm text-title-sm hover:text-primary-fixed transition-colors flex items-center gap-1 group"
                  onClick={() => { setScreen('register'); setRegStep(1); }}
                >
                  Create Partner Account
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
                </button>
              </div>
            </div>

          </section>
        )}

        {screen === 'register' && (
          <section className="w-full max-w-[720px] transition-all duration-500 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center border border-outline-variant">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                </div>
                <div>
                  <h1 className="font-headline-md text-headline-md text-on-surface">Partner Registration</h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Complete your profile to join the VendorBridge network</p>
                </div>
              </div>
              <button
                className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface"
                onClick={() => { setScreen('login'); setRegStep(1); }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="glass-surface p-8 rounded-xl shadow-2xl">

              <div className="flex items-center justify-between mb-12 px-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: regStep === 1 ? '0%' : regStep === 2 ? '50%' : '100%' }}
                ></div>

                <div className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => { if (regStep > 1) setRegStep(1); }}
                    disabled={regStep === 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background transition-all duration-300 ${
                      regStep >= 1 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface-variant'
                    } ${regStep === 1 ? 'step-active scale-110' : 'cursor-pointer'}`}
                  >
                    <span className="font-label-caps text-xs">01</span>
                  </button>
                  <span className={`absolute top-12 whitespace-nowrap text-[10px] font-label-caps tracking-wider transition-colors ${regStep === 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>IDENTITY</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (regStep === 3) setRegStep(2);
                      else if (regStep === 1 && validateStep1()) setRegStep(2);
                    }}
                    disabled={regStep === 2}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background transition-all duration-300 ${
                      regStep >= 2 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface-variant'
                    } ${regStep === 2 ? 'step-active scale-110' : regStep > 2 ? 'cursor-pointer' : ''}`}
                  >
                    <span className="font-label-caps text-xs">02</span>
                  </button>
                  <span className={`absolute top-12 whitespace-nowrap text-[10px] font-label-caps tracking-wider transition-colors ${regStep === 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>CREDENTIALS</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (regStep === 1 && validateStep1() && validateStep2()) {
                        setRegStep(3);
                      } else if (regStep === 2 && validateStep2()) {
                        setRegStep(3);
                      }
                    }}
                    disabled={regStep === 3}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background transition-all duration-300 ${
                      regStep >= 3 ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface-variant'
                    } ${regStep === 3 ? 'step-active scale-110' : ''}`}
                  >
                    <span className="font-label-caps text-xs">03</span>
                  </button>
                  <span className={`absolute top-12 whitespace-nowrap text-[10px] font-label-caps tracking-wider transition-colors ${regStep === 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>CONSENT</span>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                {regStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col items-center md:items-start">
                      <label className="font-label-caps text-label-caps text-on-surface-variant mb-4 self-center">Profile Identity</label>
                      <div className="relative group cursor-pointer w-32 h-32 md:w-40 md:h-40 mx-auto">
                        <div className="w-full h-full rounded-full border-2 border-dashed border-outline-variant bg-surface-container flex flex-col items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all overflow-hidden relative">
                          <img
                            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                            alt="Procurement Executive Identity"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoDaKoQ2i8Q3dw9faFG1B5Uq1qfMO7cFRaXNYP0uLJQR9b6c-pQVogjGrGx3Ac8tqOX2qS5GkN32G8LLKGQe3OEjb_xehZteFeH1SQh7KYcrao37cOf45obu7B77yIJUE83zoy9f_7AI8jRqXlfsyoMKaXrJvxCaG_lmVs3_Oj7uUjP1TkPY-H1hg-SczHf5EW3YAfHBr-XNy8KkmbBM9lpyUblvQUKEmmTVa290KFtzQe0YQTCRcXkzviCw86GI-a_3uCGnc6RjWY"
                          />
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">add_a_photo</span>
                            <span className="font-label-caps text-[9px] text-on-surface-variant">UPLOAD PHOTO</span>
                          </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-primary text-on-primary p-1.5 rounded-full shadow-lg">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-center text-on-surface-variant mt-4 px-4">Accepts JPG, PNG. Max 5MB.</p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="font-label-caps text-label-caps text-on-surface-variant">First Name *</label>
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                            placeholder="John"
                            type="text"
                            value={regFirstName}
                            onChange={(e) => setRegFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-caps text-label-caps text-on-surface-variant">Last Name *</label>
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                            placeholder="Doe"
                            type="text"
                            value={regLastName}
                            onChange={(e) => setRegLastName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="font-label-caps text-label-caps text-on-surface-variant">Email Address *</label>
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                            placeholder="j.doe@logistics.com"
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-label-caps text-label-caps text-on-surface-variant">Phone Number *</label>
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                            placeholder="+1 (555) 000-0000"
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-6 max-w-[540px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Password *</label>
                      <input
                        className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                        placeholder="••••••••"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant">Functional Role</label>
                        <select
                          className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all text-on-surface"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                        >
                          <option value="Procurement Officer">Procurement Officer</option>
                          <option value="Vendor">Vendor</option>
                          <option value="Manager">Manager / Approver</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant">Country / Region *</label>
                        <div className="relative">
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 pr-10 text-body-md transition-all text-on-surface"
                            placeholder="India"
                            type="text"
                            value={regCountry}
                            onChange={(e) => setRegCountry(e.target.value)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant pointer-events-none">public</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-6 max-w-[540px] mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Additional Information</label>
                      <textarea
                        className="w-full bg-surface-container-lowest border-outline-variant focus:border-primary focus:ring-0 rounded-lg py-3 px-4 text-body-md transition-all resize-none text-on-surface"
                        placeholder="Mention primary categories, industry certifications, or specific departmental access requirements..."
                        rows={4}
                        value={regInfo}
                        onChange={(e) => setRegInfo(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-outline-variant">
                  <div className={`flex items-center gap-3 transition-all duration-300 ${regStep === 3 ? 'opacity-100 animate-in fade-in' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
                    <input
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-background bg-surface-container-lowest"
                      id="terms"
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                    />
                    <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                      I agree to the <span className="text-primary">Enterprise Terms of Service</span> and <span className="text-primary">Data Privacy Policy</span>.
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4 w-full md:w-auto ml-auto">
                    {regStep > 1 && (
                      <button
                        type="button"
                        className="flex-1 md:flex-none px-8 py-3.5 border border-outline-variant hover:bg-surface-container rounded-lg text-title-sm font-title-sm transition-all text-on-surface"
                        onClick={() => setRegStep(regStep - 1)}
                      >
                        Back
                      </button>
                    )}

                    {regStep === 1 && (
                      <button
                        type="button"
                        className="flex-1 md:flex-none px-8 py-3.5 border border-outline-variant hover:bg-surface-container rounded-lg text-title-sm font-title-sm transition-all text-on-surface"
                        onClick={() => { setScreen('login'); setRegStep(1); }}
                      >
                        Cancel
                      </button>
                    )}

                    {regStep < 3 && (
                      <button
                        type="button"
                        className="flex-1 md:flex-none px-12 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-title-sm font-title-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        onClick={() => {
                          if (regStep === 1 && validateStep1()) {
                            setRegStep(2);
                          } else if (regStep === 2 && validateStep2()) {
                            setRegStep(3);
                          }
                        }}
                      >
                        Next Step
                        <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
                      </button>
                    )}

                    {regStep === 3 && (
                      <button
                        type="submit"
                        className="flex-1 md:flex-none px-12 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-title-sm font-title-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        Register Partner
                        <span className="material-symbols-outlined !text-[20px]">how_to_reg</span>
                      </button>
                    )}
                  </div>
                </div>
                {authError && <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg text-center mt-6 font-body-sm w-full">{authError}</div>}
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 py-6 text-center opacity-40 font-body-sm text-body-sm text-on-surface-variant">
        © 2024 VendorBridge ERP Systems. All rights reserved. Secure 256-bit AES Encryption Active.
      </footer>
    </div>
  );
}


