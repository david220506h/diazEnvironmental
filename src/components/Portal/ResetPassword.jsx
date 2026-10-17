import { useState } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { supabase } from "../../lib/supabase";
import "./Auth.css";

const t = {
  en: {
    title: "Set a new password",
    password: "New Password",
    confirm: "Confirm Password",
    submit: "SAVE PASSWORD",
    mismatch: "Passwords do not match.",
    success: "Password updated. Redirecting…",
  },
  es: {
    title: "Establece una nueva contraseña",
    password: "Nueva Contraseña",
    confirm: "Confirmar Contraseña",
    submit: "GUARDAR CONTRASEÑA",
    mismatch: "Las contraseñas no coinciden.",
    success: "Contraseña actualizada. Redirigiendo…",
  },
};

const ResetPassword = ({ onDone }) => {
  const language = useStore(languageStore);
  const tx = t[language] || t.en;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(tx.mismatch);
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess(true);
    setTimeout(onDone, 1500);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>{tx.title}</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="rp-password">{tx.password}</label>
            <input id="rp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="auth-form-group">
            <label htmlFor="rp-confirm">{tx.confirm}</label>
            <input id="rp-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-info">{tx.success}</p>}
          <button type="submit" className="btn" disabled={loading}>{tx.submit}</button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
