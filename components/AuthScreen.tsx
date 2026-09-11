import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  BarChart2,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } from '../authService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: UserProfile) => void;
  isDarkMode: boolean;
  theme?: string;
  allowClose?: boolean;
}

export const AuthScreen: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isDarkMode,
  theme = 'infinity',
  allowClose = true
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getFirebaseErrorMessage = (error: any): string => {
    const code = error?.code || '';
    if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    }
    if (code.includes('email-already-in-use')) {
      return 'Este e-mail já está cadastrado. Tente entrar ou recuperar a senha.';
    }
    if (code.includes('weak-password')) {
      return 'A senha é muito fraca. Escolha uma senha com no mínimo 6 caracteres.';
    }
    if (code.includes('invalid-email')) {
      return 'Formato de e-mail inválido.';
    }
    if (code.includes('popup-closed-by-user')) {
      return 'Autenticação Google cancelada pelo usuário.';
    }
    if (code.includes('network-request-failed')) {
      return 'Falha na conexão de rede. Verifique sua internet.';
    }
    return error?.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      onSuccess(user);
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerWithEmail(name, email, password);
      onSuccess(user);
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Informe seu e-mail cadastrado para redefinir a senha.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('Enviamos as instruções de recuperação para seu e-mail.');
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Demo direct login for quick access in preview mode
  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      uid: 'demo_equipe_cssjd',
      email: 'comunicacao@cssjd.com.br',
      displayName: 'Equipe de Comunicação CSSJD',
      photoURL: null,
      role: 'admin'
    };
    onSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Brand Header */}
        <div className={`p-8 pb-6 text-center border-b ${
          isDarkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-neon-purple mb-4">
            <BarChart2 size={28} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight">
            CSSJD <span className="text-violet-500">Social Intel</span>
          </h2>
          <p className="text-xs opacity-60 mt-1">
            {mode === 'login' && 'Acesso restrito para gestão de métricas e redes sociais'}
            {mode === 'register' && 'Crie sua conta para acessar o dashboard de performance'}
            {mode === 'forgot' && 'Recuperação de acesso da equipe'}
          </p>

          {/* Quick tab switcher for Login / Cadastro */}
          {mode !== 'forgot' && (
            <div className={`mt-5 p-1 rounded-xl border flex gap-1 ${
              isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-200/60 border-slate-300/40'
            }`}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login' 
                    ? 'bg-violet-600 text-white shadow-sm' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'register' 
                    ? 'bg-violet-600 text-white shadow-sm' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                Cadastrar-se
              </button>
            </div>
          )}
        </div>

        {/* Feedback alerts */}
        <div className="px-8 pt-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* FORM CONTAINER */}
        <div className="p-8 pt-4 space-y-4">
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1.5">
                  E-mail institucional / corporativo
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu.email@cssjd.com.br"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-violet-400 hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>Autenticando...</>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Joel Donatto"
                    required
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu.email@cssjd.com.br"
                    required
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Criar Senha (mínimo 6 dígitos)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-10 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>Criando Conta...</>
                ) : (
                  <>
                    <span>Cadastrar Conta</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1 mb-2"
              >
                <ArrowLeft size={14} /> Voltar para o Login
              </button>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1.5">
                  E-mail para Redefinição
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu.email@cssjd.com.br"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
                      isDarkMode ? 'bg-slate-950/60 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <>Enviando...</> : <>Enviar Link de Recuperação</>}
              </button>
            </form>
          )}

          {/* DIVIDER */}
          <div className="relative py-2 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />
            </div>
            <span className={`relative px-3 text-[10px] font-bold uppercase tracking-widest ${
              isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
            }`}>
              Ou continue com
            </span>
          </div>

          {/* GOOGLE POPUP LOGIN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-950 border-white/10 hover:bg-white/5 text-slate-200' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
            }`}
          >
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
            <span>Conta Google</span>
          </button>

          {/* DEMO / PREVIEW ACCESS HELPER */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-violet-950/20 border-violet-500/20 text-violet-300' : 'bg-violet-50 border-violet-200 text-violet-700'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400 shrink-0" />
              <span className="text-[11px] font-medium">Acesso Rápido de Demonstração (Equipe)</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              Entrar Direto
            </button>
          </div>

          {/* Close button if allowed */}
          {allowClose && onClose && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold opacity-50 hover:opacity-100 transition-opacity"
              >
                Continuar visualizando como visitante
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className={`p-4 border-t text-center text-[10px] opacity-40 font-mono ${
          isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'
        }`}>
          Autenticação Segura via Firebase Auth • Projeto CSSJD
        </div>
      </div>
    </div>
  );
};
