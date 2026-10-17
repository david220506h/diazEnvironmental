import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { supabase } from "../../lib/supabase";
import { arizonaCountyOptions } from "../../lib/arizonaCounties";
import { serviceTypeOptions } from "../../lib/serviceTypes";
import { MAX_FILES, MAX_FILE_SIZE_BYTES, isAllowedFile, cleanFileName } from "../../lib/fileUpload";
import { generateUuid } from "../../lib/uuid";
import "./RequestService.css";

const DRAFT_KEY = "requestServiceDraft";
const REDIRECT_KEY = "portalRedirect";
const BUCKET = "client-uploads";

const emptyForm = {
  contactName: "",
  phone: "",
  address: "",
  apn: "",
  county: "",
  serviceType: "",
  notes: "",
};

const t = {
  en: {
    title: "Request a Service",
    intro:
      "Tell us about your property and what you need. You can create your account at the end to attach documents and submit.",
    contactName: "Contact Name",
    phone: "Phone",
    address: "Property Address",
    apn: "Parcel Number (APN)",
    county: "Arizona County",
    selectCounty: "Select a county",
    serviceType: "Service Needed",
    selectService: "Select a service",
    notes: "Notes",
    filesTitle: "Attach Documents (optional, up to 10 files)",
    filesHint: "PDF, JPG or PNG, up to 15 MB each.",
    addFiles: "Add files",
    removeFile: "Remove",
    authGateText: "Sign in to attach files and submit your request.",
    signIn: "Sign in",
    submit: "SUBMIT REQUEST",
    submitting: "SUBMITTING…",
    retry: "RETRY SUBMISSION",
    fileTooBig: "is larger than 15 MB and was skipped.",
    fileBadType: "is not a PDF, JPG or PNG and was skipped.",
    fileLimit: "You can attach a maximum of 10 files.",
    statusPending: "Pending",
    statusUploading: "Uploading…",
    statusDone: "Uploaded",
    statusError: "Failed",
    submitError: "Something went wrong submitting your request. Please retry.",
    confirmTitle: "Request submitted",
    confirmBody: "Thank you. We received your request and will contact you shortly.",
    viewRequests: "View my requests",
    backHome: "Back to home",
  },
  es: {
    title: "Solicitar un Servicio",
    intro:
      "Cuéntanos sobre tu propiedad y lo que necesitas. Puedes crear tu cuenta al final para adjuntar documentos y enviar.",
    contactName: "Nombre de Contacto",
    phone: "Teléfono",
    address: "Dirección de la Propiedad",
    apn: "Número de Parcela (APN)",
    county: "Condado de Arizona",
    selectCounty: "Selecciona un condado",
    serviceType: "Servicio Necesitado",
    selectService: "Selecciona un servicio",
    notes: "Notas",
    filesTitle: "Adjuntar Documentos (opcional, hasta 10 archivos)",
    filesHint: "PDF, JPG o PNG, hasta 15 MB cada uno.",
    addFiles: "Agregar archivos",
    removeFile: "Quitar",
    authGateText: "Inicia sesión para adjuntar archivos y enviar tu solicitud.",
    signIn: "Iniciar sesión",
    submit: "ENVIAR SOLICITUD",
    submitting: "ENVIANDO…",
    retry: "REINTENTAR ENVÍO",
    fileTooBig: "supera los 15 MB y no se agregó.",
    fileBadType: "no es PDF, JPG ni PNG y no se agregó.",
    fileLimit: "Puedes adjuntar un máximo de 10 archivos.",
    statusPending: "Pendiente",
    statusUploading: "Subiendo…",
    statusDone: "Subido",
    statusError: "Falló",
    submitError: "Algo falló al enviar tu solicitud. Intenta de nuevo.",
    confirmTitle: "Solicitud enviada",
    confirmBody: "Gracias. Recibimos tu solicitud y te contactaremos pronto.",
    viewRequests: "Ver mis solicitudes",
    backHome: "Volver al inicio",
  },
};

const RequestService = () => {
  const language = useStore(languageStore);
  const tx = t[language] || t.en;
  const countyOptions = arizonaCountyOptions(language);
  const services = serviceTypeOptions[language] || serviceTypeOptions.en;

  const [session, setSession] = useState(undefined);
  const [formData, setFormData] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [fileStates, setFileStates] = useState([]);
  const [fileError, setFileError] = useState("");
  const [phase, setPhase] = useState("form");
  const [submitError, setSubmitError] = useState("");
  const requestIdRef = useRef(null);
  const requestRowCreatedRef = useRef(false);
  const restored = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setFormData({ ...emptyForm, ...JSON.parse(saved) });
    } catch {
      /* localStorage puede no estar disponible; se continúa con el formulario vacío */
    }
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      /* ignorar si localStorage no está disponible (modo privado, etc.) */
    }
  }, [formData, phase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToLogin = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      localStorage.setItem(REDIRECT_KEY, "/request-service");
    } catch {
      /* ignorar si localStorage no está disponible */
    }
    window.location.href = "/portal?redirect=/request-service";
  };

  const handleFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    setFileError("");

    const next = [...fileStates];
    for (const file of picked) {
      if (next.length >= MAX_FILES) {
        setFileError(tx.fileLimit);
        break;
      }
      if (!isAllowedFile(file)) {
        const reason = file.size > MAX_FILE_SIZE_BYTES ? tx.fileTooBig : tx.fileBadType;
        setFileError(`${file.name} ${reason}`);
        continue;
      }
      next.push({ file, status: "pending", path: null, error: null });
    }
    setFileStates(next);
  };

  const handleRemoveFile = (index) => {
    setFileStates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileState = (index, patch) => {
    setFileStates((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const ensureRequestRow = async () => {
    if (requestRowCreatedRef.current) return requestIdRef.current;

    if (!requestIdRef.current) requestIdRef.current = generateUuid();
    const requestId = requestIdRef.current;

    const { error } = await supabase.from("client_requests").upsert({
      id: requestId,
      client_id: session.user.id,
      contact_name: formData.contactName,
      phone: formData.phone,
      address: formData.address,
      apn: formData.apn,
      county: formData.county,
      service_type: formData.serviceType,
      notes: formData.notes,
    });

    if (error) throw error;
    requestRowCreatedRef.current = true;
    return requestId;
  };

  const uploadFile = async (fileState, index, requestId) => {
    updateFileState(index, { status: "uploading", error: null });

    const path = `${session.user.id}/${requestId}/${generateUuid()}-${cleanFileName(fileState.file.name)}`;
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, fileState.file, {
      upsert: false,
      contentType: fileState.file.type,
    });

    if (uploadErr) {
      updateFileState(index, { status: "error", error: uploadErr.message });
      return false;
    }

    const { error: insertErr } = await supabase.from("client_request_files").insert({
      request_id: requestId,
      client_id: session.user.id,
      file_path: path,
      file_name: fileState.file.name,
      mime_type: fileState.file.type,
      size_bytes: fileState.file.size,
    });

    if (insertErr) {
      updateFileState(index, { status: "error", error: insertErr.message });
      return false;
    }

    updateFileState(index, { status: "done", path, error: null });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!session) return;

    setSubmitError("");
    setPhase("submitting");

    try {
      const requestId = await ensureRequestRow();

      let allDone = true;
      for (let i = 0; i < fileStates.length; i++) {
        if (fileStates[i].status === "done") continue;
        const ok = await uploadFile(fileStates[i], i, requestId);
        if (!ok) allDone = false;
      }

      if (!allDone) {
        setPhase("form");
        setSubmitError(tx.submitError);
        return;
      }

      const { error: statusErr } = await supabase
        .from("client_requests")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", requestId);

      if (statusErr) throw statusErr;

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignorar si localStorage no está disponible */
      }
      setPhase("done");
    } catch (err) {
      setPhase("form");
      setSubmitError(err.message || tx.submitError);
    }
  };

  if (phase === "done") {
    return (
      <main className="request-page">
        <div className="request-success">
          <h1>{tx.confirmTitle}</h1>
          <p>{tx.confirmBody}</p>
          <p>
            <a href="/portal" className="btn">{tx.viewRequests}</a>{" "}
            <a href="/">{tx.backHome}</a>
          </p>
        </div>
      </main>
    );
  }

  const submitting = phase === "submitting";

  return (
    <main className="request-page">
      <h1>{tx.title}</h1>
      <p className="request-intro">{tx.intro}</p>

      <form className="request-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="request-honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="request-form-row">
          <div className="request-form-group">
            <label htmlFor="rs-contactName">{tx.contactName}</label>
            <input id="rs-contactName" name="contactName" type="text" value={formData.contactName} onChange={handleChange} required />
          </div>
          <div className="request-form-group">
            <label htmlFor="rs-phone">{tx.phone}</label>
            <input id="rs-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} inputMode="numeric" pattern="[0-9]{10}" maxLength={10} required />
          </div>
        </div>

        <div className="request-form-group">
          <label htmlFor="rs-address">{tx.address}</label>
          <input id="rs-address" name="address" type="text" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="request-form-row">
          <div className="request-form-group">
            <label htmlFor="rs-apn">{tx.apn}</label>
            <input id="rs-apn" name="apn" type="text" value={formData.apn} onChange={handleChange} required />
          </div>
          <div className="request-form-group">
            <label htmlFor="rs-county">{tx.county}</label>
            <select id="rs-county" name="county" value={formData.county} onChange={handleChange} required>
              <option value="" disabled>{tx.selectCounty}</option>
              {countyOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="request-form-group">
          <label htmlFor="rs-serviceType">{tx.serviceType}</label>
          <select id="rs-serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} required>
            <option value="" disabled>{tx.selectService}</option>
            {services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="request-form-group">
          <label htmlFor="rs-notes">{tx.notes}</label>
          <textarea id="rs-notes" name="notes" rows="4" value={formData.notes} onChange={handleChange} />
        </div>

        {session === undefined ? null : session ? (
          <div className="request-files">
            <label>{tx.filesTitle}</label>
            <p className="request-intro" style={{ marginBottom: 0 }}>{tx.filesHint}</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              multiple
              onChange={handleFilesSelected}
              disabled={submitting}
            />
            {fileError && <p className="request-file-error">{fileError}</p>}

            {fileStates.length > 0 && (
              <ul className="request-files-list">
                {fileStates.map((fs, index) => (
                  <li key={`${fs.file.name}-${index}`} className={`is-${fs.status}`}>
                    <div className="request-file-row">
                      <span>{fs.file.name}</span>
                      {fs.status === "pending" && !submitting && (
                        <button type="button" onClick={() => handleRemoveFile(index)}>{tx.removeFile}</button>
                      )}
                      <span className="request-file-status">
                        {fs.status === "pending" && tx.statusPending}
                        {fs.status === "uploading" && tx.statusUploading}
                        {fs.status === "done" && tx.statusDone}
                        {fs.status === "error" && tx.statusError}
                      </span>
                    </div>
                    <div className="request-progress-track">
                      <div className={`request-progress-bar is-${fs.status}`} />
                    </div>
                    {fs.status === "error" && fs.error && <p className="request-file-error">{fs.error}</p>}
                  </li>
                ))}
              </ul>
            )}

            {submitError && <p className="request-file-error">{submitError}</p>}

            <div className="request-actions">
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? tx.submitting : submitError ? tx.retry : tx.submit}
              </button>
            </div>
          </div>
        ) : (
          <div className="request-auth-gate">
            <p>{tx.authGateText}</p>
            <button type="button" className="btn" onClick={handleGoToLogin}>{tx.signIn}</button>
          </div>
        )}
      </form>
    </main>
  );
};

export default RequestService;
