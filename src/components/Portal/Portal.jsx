import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { supabase } from "../../lib/supabase";
import Auth from "./Auth.jsx";
import ResetPassword from "./ResetPassword.jsx";
import "./Portal.css";

const REDIRECT_KEY = "portalRedirect";

const getRedirectTarget = () => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("redirect");
  if (fromQuery) return fromQuery;
  try {
    return localStorage.getItem(REDIRECT_KEY) || "";
  } catch {
    return "";
  }
};

const Portal = () => {
  const language = useStore(languageStore);
  const [session, setSession] = useState(undefined);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    setIsRecovery(window.location.hash.includes("type=recovery"));

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || isRecovery) return;
    const target = getRedirectTarget();
    if (target && target !== "/portal") {
      try {
        localStorage.removeItem(REDIRECT_KEY);
      } catch {
        /* ignorar si localStorage no está disponible */
      }
      window.location.href = target;
    }
  }, [session, isRecovery]);

  if (session === undefined) return null;

  if (isRecovery) {
    return (
      <ResetPassword
        onDone={() => {
          setIsRecovery(false);
          window.location.hash = "";
        }}
      />
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <main className="portal-page">
      <p>{language === "es" ? "Sesión iniciada." : "Signed in."}</p>
    </main>
  );
};

export default Portal;
