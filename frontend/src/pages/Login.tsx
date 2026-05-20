import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { loginUser } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = await loginUser(email, password);
      // Map backend fields to frontend AuthContext User interface
      login({
        id: data._id,
        name: data.full_name,
        email: data.email,
        role: data.role,
        token: data.token
      });
      
      toast.success(language === 'he' ? 'התחברת בהצלחה' : 'Logged in successfully');
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (language === 'he' ? 'שגיאת התחברות' : 'Login failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    toast.info(language === 'he' ? `מתחבר באמצעות ${platform}...` : `Connecting via ${platform}...`);
    
    // Simulate Social OAuth redirect and success
    setTimeout(() => {
       login({ id: 'social-123', name: `${platform} User`, email: `user@${platform.toLowerCase()}.com`, role: 'user', token: 'fake-social-jwt' });
       toast.success(language === 'he' ? 'התחברת בהצלחה' : 'Logged in successfully');
       navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-zinc-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 sm:p-12 shadow-2xl border border-zinc-100"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-widest mb-4 font-medium text-black">
            {t('nav.loginRegister')}
          </h1>
          <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.5em] text-zinc-400 font-serif">
            {language === 'he' ? 'היכנס לחשבון שלך' : 'Access your account'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 mb-10">
          <div className="space-y-4">
            <Label className="text-[11px] uppercase tracking-widest font-bold font-serif text-black">Email</Label>
            <Input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-zinc-300 focus-visible:ring-black h-12 text-[14px]"
            />
          </div>
          <div className="space-y-4">
            <Label className="text-[11px] uppercase tracking-widest font-bold font-serif text-black">Password</Label>
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-zinc-300 focus-visible:ring-black h-12 text-[14px] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-black text-white hover:bg-zinc-800 transition-all duration-500 rounded-none h-14 text-[11px] uppercase tracking-[0.4em] font-bold">
            {isSubmitting ? (language === 'he' ? 'מתחבר...' : 'Signing In...') : (language === 'he' ? 'היכנס' : 'Sign In')}
          </Button>
        </form>

        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-serif">
            <span className="bg-white px-4 text-zinc-300 font-bold">{language === 'he' ? 'או המשך עם' : 'Or continue with'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('Google')}
            className="w-full rounded-none border-zinc-200 h-14 flex items-center justify-center gap-4 hover:bg-zinc-50 transition-all font-serif"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.859 -14.754 38.859 C -19.444 38.859 -23.494 41.559 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
            <span className="text-[11px] uppercase tracking-widest font-bold">Google</span>
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full rounded-none border-zinc-200 h-14 flex items-center justify-center gap-4 hover:bg-zinc-50 transition-all font-serif"
          >
            <svg viewBox="0 0 320 320" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path fill="#1877F2" d="M320 160c0-88.366-71.634-160-160-160S0 71.634 0 160c0 79.914 58.742 146.064 135 158.046v-111.8H94.385V160H135v-35.342c0-40.081 23.86-62.158 60.198-62.158 17.51 0 35.795 3.125 35.795 3.125v39.362h-20.174c-19.866 0-26.069 12.327-26.069 25.006V160h44.47l-7.105 46.246H184.75v111.8C261.258 306.064 320 239.914 320 160z"/><path fill="#fff" d="M222.115 206.246L229.22 160h-44.47v-30.007c0-12.679 6.203-25.006 26.069-25.006h20.174v-39.362s-18.285-3.125-35.795-3.125c-36.338 0-60.198 22.077-60.198 62.158V160H94.385v46.246H135v111.8c8.204 1.282 16.55 1.954 25 1.954s16.796-.672 25-1.954v-111.8h37.115z"/></svg>
            <span className="text-[11px] uppercase tracking-widest font-bold">Facebook</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;