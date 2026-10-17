import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import { supabase } from "../../lib/supabase";
import "./Dashboard.css";

const BUCKET = "client-uploads";

const STATUS_LABELS = {
  draft: { en: "Draft", es: "Borrador" },
  submitted: { en: "Submitted", es: "Enviada" },
  in_review: { en: "In Review", es: "En revisión" },
  converted: { en: "Converted to Job", es: "Convertida en trabajo" },
  rejected: { en: "Rejected", es: "Rechazada" },
};

const t = {
  en: {
    title: "My Requests",
    signOut: "Sign out",
    empty: "You have no requests yet.",
    newRequest: "New request",
    status: "Status",
    files: "files",
    service: "Service",
    back: "← Back to list",
    detailTitle: "Request details",
    address: "Address",
    apn: "APN",
    county: "County",
    notes: "Notes",
    noFiles: "No files attached.",
    download: "Download",
    loading: "Loading…",
    noDate: "—",
  },
  es: {
    title: "Mis Solicitudes",
    signOut: "Cerrar sesión",
    empty: "Todavía no tienes solicitudes.",
    newRequest: "Nueva solicitud",
    status: "Estado",
    files: "archivos",
    service: "Servicio",
    back: "← Volver a la lista",
    detailTitle: "Detalle de la solicitud",
    address: "Dirección",
    apn: "APN",
    county: "Condado",
    notes: "Notas",
    noFiles: "No hay archivos adjuntos.",
    download: "Descargar",
    loading: "Cargando…",
    noDate: "—",
  },
};

const formatDate = (value, language) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString(language === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Dashboard = ({ session }) => {
  const language = useStore(languageStore);
  const tx = t[language] || t.en;

  const [requests, setRequests] = useState(null);
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("client_requests")
      .select(
        "id, apn, county, address, contact_name, phone, service_type, notes, status, submitted_at, client_request_files(count)"
      )
      .eq("client_id", session.user.id)
      .order("submitted_at", { ascending: false, nullsFirst: true })
      .then(({ data }) => {
        if (active) setRequests(data || []);
      });
    return () => {
      active = false;
    };
  }, [session.user.id]);

  const openDetail = async (request) => {
    setSelected(request);
    setFiles(null);
    const { data } = await supabase
      .from("client_request_files")
      .select("id, file_name, file_path, mime_type, size_bytes")
      .eq("request_id", request.id);
    setFiles(data || []);
  };

  const handleDownload = async (path) => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    if (!error && data) window.open(data.signedUrl, "_blank", "noopener");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (selected) {
    return (
      <div className="dashboard">
        <button type="button" className="dashboard-back" onClick={() => setSelected(null)}>
          {tx.back}
        </button>
        <h1>{tx.detailTitle}</h1>
        <div className="dashboard-detail-card">
          <p>
            <strong>{tx.status}:</strong> {STATUS_LABELS[selected.status]?.[language] || selected.status}
          </p>
          <p>
            <strong>{tx.service}:</strong> {selected.service_type}
          </p>
          <p>
            <strong>{tx.address}:</strong> {selected.address}
          </p>
          <p>
            <strong>{tx.apn}:</strong> {selected.apn}
          </p>
          <p>
            <strong>{tx.county}:</strong> {selected.county}
          </p>
          {selected.notes && (
            <p>
              <strong>{tx.notes}:</strong> {selected.notes}
            </p>
          )}

          <h2>{tx.files}</h2>
          {files === null && <p>{tx.loading}</p>}
          {files && files.length === 0 && <p>{tx.noFiles}</p>}
          {files && files.length > 0 && (
            <ul className="dashboard-file-list">
              {files.map((f) => (
                <li key={f.id}>
                  <span>{f.file_name}</span>
                  <button type="button" className="auth-link-btn" onClick={() => handleDownload(f.file_path)}>
                    {tx.download}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{tx.title}</h1>
        <div className="dashboard-header-actions">
          <a href="/request-service" className="btn">{tx.newRequest}</a>
          <button type="button" className="auth-link-btn" onClick={handleSignOut}>
            {tx.signOut}
          </button>
        </div>
      </div>

      {requests === null && <p>{tx.loading}</p>}
      {requests && requests.length === 0 && <p>{tx.empty}</p>}

      {requests && requests.length > 0 && (
        <ul className="dashboard-request-list">
          {requests.map((r) => {
            const fileCount = r.client_request_files?.[0]?.count ?? 0;
            const dateLabel = formatDate(r.submitted_at, language) || tx.noDate;
            return (
              <li key={r.id}>
                <button type="button" className="dashboard-request-row" onClick={() => openDetail(r)}>
                  <span className={`dashboard-status-badge status-${r.status}`}>
                    {STATUS_LABELS[r.status]?.[language] || r.status}
                  </span>
                  <span className="dashboard-request-service">{r.service_type}</span>
                  <span className="dashboard-request-date">{dateLabel}</span>
                  <span className="dashboard-request-files">
                    {fileCount} {tx.files}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
