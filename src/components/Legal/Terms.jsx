import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import "./Legal.css";

const Placeholder = ({ children }) => (
  <span className="legal-placeholder">[{children}]</span>
);

const Terms = ({ publishDate }) => {
  const language = useStore(languageStore);
  const isEs = language === "es";
  const formattedDate = new Date(publishDate).toLocaleDateString(isEs ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="legal-page">
      <h1>{isEs ? "Términos y Condiciones" : "Terms & Conditions"}</h1>
      <p className="legal-updated">
        {isEs ? "Última actualización: " : "Last updated: "}
        {formattedDate}
      </p>

      <div className="legal-draft-notice">
        <span>⚠️</span>
        <p>
          <strong>{isEs ? "Borrador pendiente de revisión legal." : "Draft pending legal review."}</strong>{" "}
          {isEs
            ? "Este texto es un punto de partida redactado para Diaz Environmental, LLC y aún no ha sido revisado por un abogado. No lo consideres definitivo hasta que sea aprobado."
            : "This text is a starting draft prepared for Diaz Environmental, LLC and has not yet been reviewed by an attorney. Do not treat it as final until approved."}
        </p>
      </div>

      <section className="legal-section">
        <h2>{isEs ? "1. Aceptación de los términos" : "1. Acceptance of terms"}</h2>
        <p>
          {isEs
            ? "Al usar el sitio web de Diaz Environmental, LLC o nuestro portal de clientes, aceptas estos Términos y Condiciones y nuestra "
            : "By using the Diaz Environmental, LLC website or our client portal, you agree to these Terms & Conditions and our "}
          <a href="/privacy-policy">{isEs ? "Política de Privacidad" : "Privacy Policy"}</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "2. Descripción del servicio" : "2. Description of the service"}</h2>
        <p>
          {isEs
            ? "El portal de clientes te permite crear una cuenta, enviar una solicitud de servicio (evaluación de sitio, prueba de percolación, diseño séptico, permisos, u otros), adjuntar documentos relacionados con tu propiedad, y ver el estado de tus solicitudes."
            : "The client portal lets you create an account, submit a service request (site evaluation, percolation testing, septic design, permitting, or other services), attach documents related to your property, and track the status of your requests."}
        </p>
        <p>
          {isEs
            ? "Enviar una solicitud a través del portal no garantiza la aprobación del servicio, un permiso, ni un precio; nuestro equipo se pondrá en contacto contigo para confirmar alcance y costo."
            : "Submitting a request through the portal does not guarantee service approval, a permit, or a price; our team will contact you to confirm scope and cost."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "3. Tu cuenta" : "3. Your account"}</h2>
        <ul>
          <li>
            {isEs
              ? "Debes proporcionar información precisa y actualizada al crear tu cuenta y al enviar solicitudes."
              : "You must provide accurate and current information when creating your account and submitting requests."}
          </li>
          <li>
            {isEs
              ? "Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta."
              : "You are responsible for keeping your password confidential and for all activity under your account."}
          </li>
          <li>
            {isEs
              ? "Puedes iniciar sesión con correo y contraseña, o con tu cuenta de Google."
              : "You may sign in with email and password, or with your Google account."}
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "4. Archivos que subes" : "4. Files you upload"}</h2>
        <ul>
          <li>
            {isEs
              ? "Solo se aceptan archivos PDF, JPG y PNG, de hasta 15 MB cada uno, y un máximo de 10 archivos por solicitud."
              : "Only PDF, JPG and PNG files are accepted, up to 15 MB each, and a maximum of 10 files per request."}
          </li>
          <li>
            {isEs
              ? "Debes tener derecho a compartir cualquier documento que subas, y el contenido debe estar relacionado con tu propiedad o solicitud."
              : "You must have the right to share any document you upload, and the content must relate to your property or request."}
          </li>
          <li>
            {isEs
              ? "No subas documentos de terceros sin su consentimiento, ni contenido ilegal, ofensivo o que infrinja derechos de autor."
              : "Do not upload third-party documents without consent, or content that is illegal, offensive, or infringes copyright."}
          </li>
          <li>
            {isEs
              ? "Solo tú puedes ver y descargar tus propios archivos; nuestro equipo puede acceder a ellos para procesar tu solicitud."
              : "Only you can view and download your own files; our team may access them to process your request."}
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "5. Tarifas" : "5. Fees"}</h2>
        <p>
          <Placeholder>{isEs ? "POLÍTICA DE TARIFAS Y COTIZACIÓN PENDIENTE DE CONFIRMAR" : "FEE AND QUOTING POLICY TO BE CONFIRMED"}</Placeholder>.{" "}
          {isEs
            ? "Actualmente, el precio se cotiza directamente contigo después de revisar tu solicitud; llama al (602) 812-8609 para una cotización."
            : "Currently, pricing is quoted to you directly after we review your request; call (602) 812-8609 for a quote."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "6. Disponibilidad del servicio" : "6. Service availability"}</h2>
        <p>
          {isEs
            ? "Hacemos un esfuerzo razonable para mantener el portal disponible, pero no garantizamos que esté libre de interrupciones o errores. Podemos suspender el acceso para mantenimiento sin previo aviso."
            : "We make a reasonable effort to keep the portal available, but we do not guarantee it will be free of interruptions or errors. We may suspend access for maintenance without prior notice."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "7. Limitación de responsabilidad" : "7. Limitation of liability"}</h2>
        <p>
          <Placeholder>{isEs ? "CLÁUSULA DE LIMITACIÓN DE RESPONSABILIDAD PENDIENTE DE REVISIÓN LEGAL" : "LIMITATION OF LIABILITY CLAUSE PENDING LEGAL REVIEW"}</Placeholder>.
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "8. Ley aplicable" : "8. Governing law"}</h2>
        <p>
          {isEs
            ? "Estos términos se rigen por las leyes del Estado de "
            : "These terms are governed by the laws of the State of "}
          <Placeholder>{isEs ? "ESTADO/CONDADO A CONFIRMAR" : "STATE/COUNTY TO CONFIRM"}</Placeholder>, Arizona.
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "9. Terminación de cuenta" : "9. Account termination"}</h2>
        <p>
          {isEs
            ? "Puedes solicitar el cierre de tu cuenta en cualquier momento escribiéndonos. Podemos suspender o cerrar cuentas que incumplan estos términos."
            : "You may request your account be closed at any time by contacting us. We may suspend or close accounts that violate these terms."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "10. Cambios a estos términos" : "10. Changes to these terms"}</h2>
        <p>
          {isEs
            ? "Podemos actualizar estos términos ocasionalmente. Publicaremos cualquier cambio en esta misma página con una nueva fecha de actualización."
            : "We may update these terms from time to time. Any changes will be posted on this same page with a new update date."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "11. Contáctanos" : "11. Contact us"}</h2>
        <div className="legal-contact-block">
          <p>Diaz Environmental, LLC</p>
          <p><a href="tel:6028128609">(602) 812-8609</a></p>
          <p><a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a></p>
        </div>
      </section>

      <a className="legal-back-link" href="/">
        {isEs ? "← Volver al inicio" : "← Back to home"}
      </a>
    </main>
  );
};

export default Terms;
