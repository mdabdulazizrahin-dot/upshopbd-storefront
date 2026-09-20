import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Lock, User, UserCheck, Smartphone, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user, loading: authLoading } = useAuth();

  const [isRegister, setIsRegister] = useState(() => {
    return searchParams.get('mode') === 'register' || searchParams.get('tab') === 'register';
  });

  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password flow states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetUserId, setResetUserId] = useState<number | string | null>(null);
  const [resetContact, setResetContact] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetDevOtp, setResetDevOtp] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Login form state (email or phone + password)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (full name, email/phone, password)
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Redirect authenticated users
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Sync mode if query param changes
  useEffect(() => {
    if (searchParams.get('mode') === 'register' || searchParams.get('tab') === 'register') {
      setIsRegister(true);
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      toast({ title: "ইমেইল বা ফোন নম্বর দিন", variant: "destructive" });
      return;
    }
    if (!loginPassword) {
      toast({ title: "পাসওয়ার্ড দিন", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(loginIdentifier.trim(), loginPassword);
      if (error) {
        toast({ 
          title: "লগইন ব্যর্থ হয়েছে", 
          description: error.message || "ইমেইল/ফোন অথবা পাসওয়ার্ড ভুল।", 
          variant: "destructive" 
        });
      } else {
        toast({ title: "স্বাগতম!", description: "আপনি সফলভাবে লগইন করেছেন।" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast({ title: "পূর্ণ নাম দিন", variant: "destructive" });
      return;
    }
    if (!regIdentifier.trim()) {
      toast({ title: "ইমেইল বা ফোন নম্বর দিন", variant: "destructive" });
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      toast({ title: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(regIdentifier.trim(), regPassword, regName.trim());
      if (error) {
        toast({ 
          title: "রেজিস্ট্রেশন ব্যর্থ হয়েছে", 
          description: error.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি।", 
          variant: "destructive" 
        });
      } else {
        toast({ title: "অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে!", description: "আপনি সফলভাবে লগইন হয়েছেন।" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      toast({ title: "ইমেইল বা ফোন নম্বর দিন", variant: "destructive" });
      return;
    }
    setResetLoading(true);
    try {
      const res: any = await api.post('/auth/forgot-password', {
        email_or_phone: resetIdentifier.trim(),
      });
      setResetUserId(res.user_id);
      setResetContact(res.contact || resetIdentifier);
      if (res.otp) {
        setResetDevOtp(res.otp);
      }
      setResetStep('verify');
      toast({
        title: "ভেরিফিকেশন কোড পাঠানো হয়েছে",
        description: res.message || "আপনার নম্বরে ওটিপি পাঠানো হয়েছে।",
      });
    } catch (err: any) {
      toast({
        title: "অনুরোধ ব্যর্থ হয়েছে",
        description: err.message || "অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp.trim()) {
      toast({ title: "৬ ডিজিটের ওটিপি কোড দিন", variant: "destructive" });
      return;
    }
    if (!resetNewPassword || resetNewPassword.length < 6) {
      toast({ title: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast({ title: "পাসওয়ার্ড দুটি মিলছে না", variant: "destructive" });
      return;
    }
    setResetLoading(true);
    try {
      const res: any = await api.post('/auth/reset-password', {
        user_id: resetUserId,
        otp: resetOtp.trim(),
        password: resetNewPassword,
        password_confirmation: resetConfirmPassword,
      });
      toast({
        title: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!",
        description: res.message || "এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      });
      setIsForgotPassword(false);
      setIsRegister(false);
      setLoginPassword('');
      setResetOtp('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setResetStep('request');
    } catch (err: any) {
      toast({
        title: "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে",
        description: err.message || "ওটিপি কোডটি ভুল বা মেয়াদোত্তীর্ণ।",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border/80 p-8 shadow-card">
            {isForgotPassword ? (
              /* Forgot Password Flow */
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h1 className="text-2xl font-display font-bold text-foreground">
                    পাসওয়ার্ড রিসেট করুন
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {resetStep === 'request'
                      ? 'আপনার নিবন্ধিত ইমেইল বা ফোন নম্বর দিন'
                      : `কোড পাঠানো হয়েছে: ${resetContact}`}
                  </p>
                </div>

                {resetStep === 'request' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="reset-identifier" className="text-sm font-medium">
                        ইমেইল অথবা ফোন নম্বর
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-identifier"
                          type="text"
                          placeholder="017xxxxxxxx বা user@example.com"
                          className="pl-10 h-11"
                          value={resetIdentifier}
                          onChange={(e) => setResetIdentifier(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold shadow-sm mt-2"
                      disabled={resetLoading}
                    >
                      {resetLoading ? 'কোড পাঠানো হচ্ছে...' : 'ভেরিফিকেশন কোড পাঠান'}
                    </Button>

                    <div className="pt-4 mt-4 border-t border-border/60 text-center">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        লগইন পেজে ফিরে যান
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    {resetDevOtp && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-primary font-mono text-center">
                        টেস্টিং ওটিপি কোড: <strong className="text-sm tracking-wider">{resetDevOtp}</strong>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="reset-otp" className="text-sm font-medium">
                        ৬ ডিজিটের ওটিপি কোড (OTP)
                      </Label>
                      <Input
                        id="reset-otp"
                        type="text"
                        maxLength={6}
                        placeholder="যেমন: 123456"
                        className="h-11 font-mono tracking-widest text-center text-lg font-bold"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reset-new-password" className="text-sm font-medium">
                        নতুন পাসওয়ার্ড
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-new-password"
                          type={showResetNewPassword ? "text" : "password"}
                          placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                          className="pl-10 pr-10 h-11"
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                          tabIndex={-1}
                        >
                          {showResetNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reset-confirm-password" className="text-sm font-medium">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-confirm-password"
                          type={showResetConfirmPassword ? "text" : "password"}
                          placeholder="আগের পাসওয়ার্ডটি আবার লিখুন"
                          className="pl-10 pr-10 h-11"
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                          tabIndex={-1}
                        >
                          {showResetConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-semibold shadow-sm mt-2"
                      disabled={resetLoading}
                    >
                      {resetLoading ? 'পাসওয়ার্ড পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                    </Button>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="hover:text-primary transition-colors"
                      >
                        কোড পাননি? পুনরায় চেষ্টা করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="text-primary hover:underline font-medium"
                      >
                        লগইন করুন
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Normal Login / Register Forms */
              <>
                {/* Form Header */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                    {isRegister ? <UserCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                  </div>
                  <h1 className="text-2xl font-display font-bold text-foreground">
                    {isRegister ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRegister 
                      ? 'নিচের তথ্যগুলো দিয়ে সহজে আপনার অ্যাকাউন্ট খুলুন' 
                      : 'আপনার অ্যাকাউন্ট এ সাইন ইন করুন'}
                  </p>
                </div>

                {/* Login Form */}
                {!isRegister ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-identifier" className="text-sm font-medium">
                        ইমেইল অথবা ফোন নম্বর (Email or Phone)
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-identifier"
                          type="text"
                          placeholder="017xxxxxxxx বা user@example.com"
                          className="pl-10 h-11"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm font-medium">
                          পাসওয়ার্ড (Password)
                        </Label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setResetStep('request');
                            setResetIdentifier(loginIdentifier || '');
                          }}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          পাসওয়ার্ড ভুলে গেছেন?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                          tabIndex={-1}
                          aria-label={showLoginPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-semibold shadow-sm mt-2" 
                      disabled={loading}
                    >
                      {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                    </Button>

                    {/* Bottom Switch to Register */}
                    <div className="pt-4 mt-4 border-t border-border/60 text-center">
                      <p className="text-sm text-muted-foreground">
                        অ্যাকাউন্ট নেই?{' '}
                        <button
                          type="button"
                          onClick={() => setIsRegister(true)}
                          className="text-primary font-semibold hover:underline ml-1"
                        >
                          রেজিস্ট্রেশন করুন
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  /* Register Form */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-name" className="text-sm font-medium">
                        পূর্ণ নাম (Full Name)
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-name"
                          type="text"
                          placeholder="আপনার নাম লিখুন"
                          className="pl-10 h-11"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reg-identifier" className="text-sm font-medium">
                        ইমেইল অথবা ফোন নম্বর (Email or Phone)
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-identifier"
                          type="text"
                          placeholder="017xxxxxxxx বা user@example.com"
                          className="pl-10 h-11"
                          value={regIdentifier}
                          onChange={(e) => setResetIdentifier(e.target.value) || setRegIdentifier(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="reg-password" className="text-sm font-medium">
                        পাসওয়ার্ড (Password)
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                          className="pl-10 pr-10 h-11"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none p-1"
                          tabIndex={-1}
                          aria-label={showRegPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                        >
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-semibold shadow-sm mt-2" 
                      disabled={loading}
                    >
                      {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
                    </Button>

                    {/* Bottom Switch to Login */}
                    <div className="pt-4 mt-4 border-t border-border/60 text-center">
                      <p className="text-sm text-muted-foreground">
                        ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                        <button
                          type="button"
                          onClick={() => setIsRegister(false)}
                          className="text-primary font-semibold hover:underline ml-1"
                        >
                          লগইন করুন
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;