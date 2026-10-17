import { useState } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { supabase } from "../../lib/supabase";
import { translateAuthError } from "../../lib/authErrors";
import "./Auth.css";

const getRedirectTarget = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || "/portal";
};

const t = {
  en: {
    loginTitle: "Sign in",
    registerTitle: "Create account",
    forgotTitle: "Reset password",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    google: "Continue with Google",
    or: "or",
    submitLogin: "SIGN IN",
    submitRegister: "CREATE ACCOUNT",
    submitForgot: "SEND RESET LINK",
    switchToRegister: "Don't have an account? Create one",
    switchToLogin: "Already have an account? Sign in",
    forgotLink: "Forgot your password?",
    backToLogin: "Back to sign in",
    acceptLegal: "I agree to the",
    privacy: "Privacy Policy",
    and: "and",
    terms: "Terms & Conditions",
    registerSuccess: "Check your email to confirm your account.",
    forgotSuccess: "If an account exists for that email, a reset link is on its way.",
    mustAccept: "You must accept the Privacy Policy and Terms & Conditions.",
    passwordMismatch: "Passwords do not match.",
  },
  es: {
    loginTitle: "Iniciar sesión",
    registerTitle: "Crear cuenta",
    forgotTitle: "Recuperar contraseña",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    google: "Continuar con Google",
    or: "o",
    submitLogin: "ENTRAR",
    submitRegister: "CREAR CUENTA",
    submitForgot: "ENVIAR ENLACE",
    switchToRegister: "¿No tienes cuenta? Crea una",
    switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
    forgotLink: "¿Olvidaste tu contraseña?",
    backToLogin: "Volver a iniciar sesión",
    acceptLegal: "Acepto la",
    privacy: "Política de Privacidad",
    and: "y los",
    terms: "Términos y Condiciones",
    registerSuccess: "Revisa tu correo para confirmar tu cuenta.",
    forgotSuccess: "Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.",
    mustAccept: "Debes aceptar la Política de Privacidad y los Términos y Condiciones.",
    passwordMismatch: "Las contraseñas no coinciden.",
  },
};

const Auth = () => {
  const language = useStore(languageStore);
  const tx = t[language] || t.en;

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptLegal, setAcceptLegal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const resetMessages = () => {
    setError("");
    setInfo("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetMessages();
  };

  const handleGoogle = async () => {
    resetMessages();
    const redirectTo = `${window.location.origin}/portal?redirect=${encodeURIComponent(getRedirectTarget())}`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (oauthError) setError(translateAuthError(oauthError.message, language));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError(translateAuthError(signInError.message, language));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!acceptLegal) {
      setError(tx.mustAccept);
      return;
    }
    if (password !== confirmPassword) {
      setError(tx.passwordMismatch);
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    setLoading(false);
    if (signUpError) {
      setError(translateAuthError(signUpError.message, language));
    } else {
      setInfo(tx.registerSuccess);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal`,
    });
    setLoading(false);
    if (resetError) {
      setError(translateAuthError(resetError.message, language));
    } else {
      setInfo(tx.forgotSuccess);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? tx.loginTitle : mode === "register" ? tx.registerTitle : tx.forgotTitle}</h1>

        <button type="button" className="btn auth-google-btn" onClick={handleGoogle}>
          {tx.google}
        </button>

        <div className="auth-divider">
          <span>{tx.or}</span>
        </div>

        {mode === "forgot" ? (
          <form onSubmit={handleForgot} className="auth-form">
            <div className="auth-form-group">
              <label htmlFor="auth-email">{tx.email}</label>
              <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <p className="auth-error">{error}</p>}
            {info && <p className="auth-info">{info}</p>}
            <button type="submit" className="btn" disabled={loading}>{tx.submitForgot}</button>
            <button type="button" className="auth-link-btn" onClick={() => switchMode("login")}>
              {tx.backToLogin}
            </button>
          </form>
        ) : (
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="auth-form">
            <div className="auth-form-group">
              <label htmlFor="auth-email">{tx.email}</label>
              <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-form-group">
              <label htmlFor="auth-password">{tx.password}</label>
              <input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {mode === "register" && (
              <>
                <div className="auth-form-group">
                  <label htmlFor="auth-confirm">{tx.confirmPassword}</label>
                  <input id="auth-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                </div>
                <label className="auth-checkbox">
                  <input type="checkbox" checked={acceptLegal} onChange={(e) => setAcceptLegal(e.target.checked)} />
                  <span>
                    {tx.acceptLegal} <a href="/privacy-policy" target="_blank" rel="noreferrer">{tx.privacy}</a> {tx.and}{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">{tx.terms}</a>
                  </span>
                </label>
              </>
            )}

            {mode === "login" && (
              <button type="button" className="auth-link-btn auth-forgot-link" onClick={() => switchMode("forgot")}>
                {tx.forgotLink}
              </button>
            )}

            {error && <p className="auth-error">{error}</p>}
            {info && <p className="auth-info">{info}</p>}

            <button type="submit" className="btn" disabled={loading}>
              {mode === "login" ? tx.submitLogin : tx.submitRegister}
            </button>
          </form>
        )}

        <button
          type="button"
          className="auth-link-btn auth-switch"
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? tx.switchToRegister : tx.switchToLogin}
        </button>
      </div>
    </main>
  );
};

export default Auth;
