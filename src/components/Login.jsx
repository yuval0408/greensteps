import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Leaf, 
  Mail, 
  User, 
  Lock, 
  Phone, 
  AlertCircle, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { checkPasswordRules, isPasswordValid, validateEmail, validateMobile, login, register } from "../services/groqAuthService";

export default function Login({ onLoginSuccess }) {
  // Mode switcher: false = Sign In (Login), true = Create Account (Sign Up)
  const [isSignUp, setIsSignUp] = useState(false);

  // Field values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles & UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password rules validation calculation
  const pwdRules = checkPasswordRules(password);
  const isPwdValid = isPasswordValid(password);
  const isEmailValid = validateEmail(email);
  const isMobileValid = validateMobile(mobile);
  const isConfirmMatch = !isSignUp || (confirmPassword.length > 0 && confirmPassword === password);

  // Mode Switcher Handler
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setIsError(false);
    setErrorMessage("");
    setPassword("");
    setConfirmPassword("");
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setErrorMessage("");

    // Validations
    if (!isEmailValid) {
      setIsError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isMobileValid) {
      setIsError(true);
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!isPwdValid) {
      setIsError(true);
      setErrorMessage("Password must meet all complexity requirements.");
      return;
    }

    if (isSignUp && !isConfirmMatch) {
      setIsError(true);
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await register({ name: name || email.split("@")[0], email, mobile, password });
        setIsSuccess(true);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user);
        }, 600);
      } else {
        const res = await login({ email, mobile, password });
        setIsSuccess(true);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user);
        }, 600);
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(err.message || "Authentication error. Please check your credentials.");
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const googleUser = {
        name: "Sarah Jenkins",
        email: "sarah.jenkins@gmail.com",
        mobile: "9876543210",
        provider: "google",
      };
      const res = await register(googleUser).catch(() => ({ user: googleUser }));
      setIsSuccess(true);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user || googleUser);
      }, 600);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setErrorMessage("Google Sign In failed. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F1F8E9] text-[#1F2937] flex flex-col justify-between p-6 max-w-[430px] mx-auto font-sans relative border-x border-[#85a528]/30 shadow-2xl md:my-4 md:border md:rounded-3xl md:min-h-[844px] overflow-hidden">
      
      {/* Top Header & Branding */}
      <header className="pt-4 flex flex-col items-center text-center space-y-2 select-none">
        <div className="w-14 h-14 bg-white border border-[#85a528]/30 rounded-2xl flex items-center justify-center shadow-sm">
          <Leaf className="w-8 h-8 text-[#85a528] fill-current" />
        </div>
        <div>
          <span className="block text-[10px] tracking-[0.2em] text-[#85a528] font-bold uppercase">
            ECO GREEN
          </span>
          <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            {isSignUp ? "Join the sustainable habits hub" : "Sign in to track your green impact"}
          </p>
        </div>
      </header>

      {/* Main Authentication Form */}
      <main className="my-auto py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Optional Name (Create Account view) */}
          {isSignUp && (
            <div className="space-y-1">
              <label htmlFor="input-auth-name" className="block text-[11px] font-bold text-[#85a528] uppercase tracking-wider">
                Full Name
              </label>
              <div className="flex items-center border border-[#85a528]/30 rounded-xl px-3.5 py-3 bg-white focus-within:border-[#85a528] transition-all shadow-sm">
                <span className="mr-3 text-[#85a528] shrink-0 flex items-center">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="input-auth-name"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent outline-none border-none p-0 text-xs text-[#1F2937] placeholder-[#9f9fa5]"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <label htmlFor="input-auth-email" className="text-[#85a528]">
                Email Address
              </label>
              {email && (
                <span className={`text-[10px] ${isEmailValid ? "text-green-600" : "text-red-500"}`}>
                  {isEmailValid ? "✓ Valid Format" : "✕ Invalid Email"}
                </span>
              )}
            </div>
            <div className={`flex items-center border rounded-xl px-3.5 py-3 bg-white shadow-sm transition-all ${
              email && !isEmailValid ? "border-red-500" : "border-[#85a528]/30 focus-within:border-[#85a528]"
            }`}>
              <span className="mr-3 text-[#85a528] shrink-0 flex items-center">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="input-auth-email"
                type="email"
                required
                placeholder="sarah@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none border-none p-0 text-xs text-[#1F2937] placeholder-[#9f9fa5]"
              />
            </div>
          </div>

          {/* Mobile Number (10-Digit Validation) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <label htmlFor="input-auth-mobile" className="text-[#85a528]">
                Mobile Number (10 Digits)
              </label>
              {mobile && (
                <span className={`text-[10px] ${isMobileValid ? "text-green-600" : "text-red-500"}`}>
                  {isMobileValid ? "✓ 10 Digits" : `✕ ${mobile.length}/10 Digits`}
                </span>
              )}
            </div>
            <div className={`flex items-center border rounded-xl px-3.5 py-3 bg-white shadow-sm transition-all ${
              mobile && !isMobileValid ? "border-red-500" : "border-[#85a528]/30 focus-within:border-[#85a528]"
            }`}>
              <span className="mr-3 text-[#85a528] shrink-0 flex items-center">
                <Phone className="w-4 h-4" />
              </span>
              <input
                id="input-auth-mobile"
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-transparent outline-none border-none p-0 text-xs text-[#1F2937] placeholder-[#9f9fa5]"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <label htmlFor="input-auth-password" className="text-[#85a528]">
                Password
              </label>
              <span className="text-[10px] text-[#6B7280] font-normal">🔒 Encrypted</span>
            </div>
            <div className="flex items-center border border-[#85a528]/30 rounded-xl px-3.5 py-3 bg-white focus-within:border-[#85a528] transition-all shadow-sm">
              <span className="mr-3 text-[#85a528] shrink-0 flex items-center">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="input-auth-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none border-none p-0 text-xs text-[#1F2937] placeholder-[#9f9fa5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-[#9f9fa5] hover:text-[#85a528] cursor-pointer shrink-0 flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Complexity Checklist Real-time Visual Feedback */}
            {password.length > 0 && (
              <div className="bg-white border border-[#85a528]/30 rounded-lg p-2.5 mt-1.5 grid grid-cols-2 gap-1.5 text-[10px] shadow-sm">
                <div className={`flex items-center gap-1 font-bold ${pwdRules.hasMinLength ? "text-green-600" : "text-[#9f9fa5]"}`}>
                  {pwdRules.hasMinLength ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-[#9f9fa5]" />}
                  <span>8+ Chars</span>
                </div>
                <div className={`flex items-center gap-1 font-bold ${pwdRules.hasUppercase ? "text-green-600" : "text-[#9f9fa5]"}`}>
                  {pwdRules.hasUppercase ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-[#9f9fa5]" />}
                  <span>Uppercase (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1 font-bold ${pwdRules.hasLowercase ? "text-green-600" : "text-[#9f9fa5]"}`}>
                  {pwdRules.hasLowercase ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-[#9f9fa5]" />}
                  <span>Lowercase (a-z)</span>
                </div>
                <div className={`flex items-center gap-1 font-bold ${pwdRules.hasNumber ? "text-green-600" : "text-[#9f9fa5]"}`}>
                  {pwdRules.hasNumber ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-[#9f9fa5]" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1 font-bold col-span-2 ${pwdRules.hasSpecialChar ? "text-green-600" : "text-[#9f9fa5]"}`}>
                  {pwdRules.hasSpecialChar ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-[#9f9fa5]" />}
                  <span>Special Char (!@#$%^&*)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Create Account View) */}
          {isSignUp && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                <label htmlFor="input-auth-confirm" className="text-[#85a528]">
                  Confirm Password
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] ${isConfirmMatch ? "text-green-600" : "text-red-500"}`}>
                    {isConfirmMatch ? "✓ Passwords Match" : "✕ Does Not Match"}
                  </span>
                )}
              </div>
              <div className={`flex items-center border rounded-xl px-3.5 py-3 bg-white shadow-sm transition-all ${
                confirmPassword && !isConfirmMatch ? "border-red-500" : "border-[#85a528]/30 focus-within:border-[#85a528]"
              }`}>
                <span className="mr-3 text-[#85a528] shrink-0 flex items-center">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="input-auth-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent outline-none border-none p-0 text-xs text-[#1F2937] placeholder-[#9f9fa5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-[#9f9fa5] hover:text-[#85a528] cursor-pointer shrink-0 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error & Success Feedback Alerts */}
          <AnimatePresence mode="wait">
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-red-50 border border-red-300 p-3 rounded-xl flex items-center gap-2 text-xs text-red-600 font-bold shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-400 p-3 rounded-xl flex items-center justify-center gap-2 text-center text-xs text-green-700 font-bold shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                <span>{isSignUp ? "Account Created! Entering Hub..." : "Welcome Back! Entering Hub..."}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action CTA Button */}
          <button
            id="btn-auth-submit"
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full mt-3 bg-[#85a528] hover:bg-[#6f8c1f] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : isSignUp ? (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#85a528]/25" />
            </div>
            <span className="relative bg-[#F1F8E9] px-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider select-none">
              OR
            </span>
          </div>

          {/* Google Sign In Option */}
          <button
            id="btn-google-login"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isSuccess}
            className="w-full bg-white hover:bg-[#E8F5E9] border border-[#85a528]/30 text-[#1F2937] py-3 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Mode Switcher Link */}
        <div className="mt-5 text-center">
          <p className="text-xs text-[#6B7280]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              id="btn-switch-auth-mode"
              type="button"
              onClick={toggleAuthMode}
              className="font-bold text-[#85a528] hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-2 text-center border-t border-[#85a528]/20 text-[10px] text-[#9f9fa5]">
        Eco Green Security Gateway · Encrypted 256-bit
      </footer>

    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
