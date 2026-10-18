import { useStore } from "@nanostores/react";
import { languageStore } from "../../stores/language";
import "./Legal.css";

const Placeholder = ({ children }) => (
  <span className="legal-placeholder">[{children}]</span>
);

const PrivacyPolicy = ({ publishDate }) => {
  const language = useStore(languageStore);
  const isEs = language === "es";
  const formattedDate = new Date(publishDate).toLocaleDateString(isEs ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="legal-page">
      <h1>{isEs ? "Política de Privacidad" : "Privacy Policy"}</h1>
      <p className="legal-updated">
        {isEs
          ? "Última actualización: "
          : "Last updated: "}
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
        <h2>{isEs ? "1. Quiénes somos" : "1. Who we are"}</h2>
        <p>
          {isEs
            ? "Diaz Environmental, LLC (\"nosotros\", \"nuestro\") ofrece servicios de evaluación de sitio y suelo, pruebas de percolación, diseño de sistemas sépticos y permisos ambientales en Arizona. Puedes contactarnos al "
            : "Diaz Environmental, LLC (\"we\", \"us\", \"our\") provides site and soil evaluation, percolation testing, septic system design and environmental permitting services in Arizona. You can reach us at "}
          <a href="tel:6028128609">(602) 812-8609</a> {isEs ? "o" : "or"}{" "}
          <a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a>.{" "}
          {isEs
            ? "Atendemos los condados de Maricopa, Pinal, Pima, Yavapai y Coconino, y todas las Naciones Nativas."
            : "We serve Maricopa, Pinal, Pima, Yavapai and Coconino Counties, and all Native Nations."}
        </p>
        <p>
          {isEs ? "Dirección postal: " : "Mailing address: "}
          {isEs
            ? "Diaz Environmental LLC · Phoenix, Arizona, EE. UU. (operamos de forma remota y en campo; no atendemos al público en una oficina física)."
            : "Diaz Environmental LLC · Phoenix, Arizona, USA (we operate remotely and in the field; we do not serve the public at a physical office)."}{" "}
          {isEs ? "Para temas de privacidad, escríbenos a " : "For privacy matters, contact us at "}
          <a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "2. Qué información recopilamos" : "2. What information we collect"}</h2>
        <ul>
          <li>
            {isEs
              ? "Datos de contacto: nombre, teléfono, correo electrónico y dirección de la propiedad, cuando usas nuestro formulario de contacto o el portal de clientes."
              : "Contact information: name, phone number, email address and property address, when you use our contact form or the client portal."}
          </li>
          <li>
            {isEs
              ? "Datos de la propiedad y de la solicitud: número de parcela (APN), condado, tipo de servicio solicitado y notas que agregues."
              : "Property and request data: parcel number (APN), county, requested service type, and any notes you add."}
          </li>
          <li>
            {isEs
              ? "Documentos de propiedad y archivos adjuntos que subas al portal (por ejemplo, PDFs, fotos o escaneos relacionados con tu propiedad o solicitud)."
              : "Property documents and attachments you upload to the portal (for example, PDFs, photos or scans related to your property or request)."}
          </li>
          <li>
            {isEs
              ? "Datos de cuenta: correo electrónico y, si inicias sesión con Google, la información básica de perfil que Google comparte con nosotros (nombre y correo)."
              : "Account data: email address and, if you sign in with Google, the basic profile information Google shares with us (name and email)."}
          </li>
          <li>
            {isEs
              ? "Preferencia de idioma, guardada únicamente en tu navegador (localStorage), no en nuestros servidores."
              : "Language preference, stored only in your browser (localStorage), not on our servers."}
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "3. Cómo usamos tu información" : "3. How we use your information"}</h2>
        <ul>
          <li>
            {isEs
              ? "Para responder a tu solicitud de servicio y coordinar visitas, pruebas y trámites de permisos."
              : "To respond to your service request and coordinate visits, testing and permit paperwork."}
          </li>
          <li>
            {isEs
              ? "Para preparar y presentar documentación ante autoridades del condado o ADEQ cuando sea necesario para tu trámite."
              : "To prepare and submit documentation to county authorities or ADEQ when necessary for your case."}
          </li>
          <li>
            {isEs
              ? "Para comunicarnos contigo por teléfono, correo electrónico o mensaje de texto sobre el estado de tu solicitud."
              : "To contact you by phone, email or text message about the status of your request."}
          </li>
          <li>
            {isEs
              ? "Para mantener tu cuenta del portal de clientes y permitirte ver el estado de tus solicitudes y archivos."
              : "To maintain your client portal account and let you see the status of your requests and files."}
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "4. Dónde se almacenan tus datos" : "4. Where your data is stored"}</h2>
        <p>
          {isEs
            ? "Los datos del portal de clientes (solicitudes y archivos) se almacenan con nuestro proveedor de base de datos y almacenamiento, Supabase, en un bucket privado con acceso restringido únicamente a tu propia cuenta."
            : "Client portal data (requests and files) is stored with our database and storage provider, Supabase, in a private bucket restricted to your own account only."}{" "}
          <Placeholder>{isEs ? "REGIÓN DE SERVIDORES DE SUPABASE" : "SUPABASE SERVER REGION"}</Placeholder>.
        </p>
        <p>
          {isEs
            ? "No vendemos tu información personal. Podemos compartir datos limitados con autoridades del condado, ADEQ, o terceros que participen directamente en tu trámite (por ejemplo, un agente inmobiliario si así lo indicas), solo cuando sea necesario para prestar el servicio."
            : "We do not sell your personal information. We may share limited data with county authorities, ADEQ, or third parties directly involved in your case (for example, a real estate agent if you indicate one), only when necessary to provide the service."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "5. Cuánto tiempo conservamos tus datos" : "5. How long we keep your data"}</h2>
        <p>
          <Placeholder>{isEs ? "POLÍTICA DE RETENCIÓN DE DATOS PENDIENTE DE DEFINIR" : "DATA RETENTION PERIOD TO BE DEFINED"}</Placeholder>.{" "}
          {isEs
            ? "Mientras se define, conservamos tus datos y documentos mientras tu cuenta esté activa o mientras sea necesario para cumplir obligaciones legales o de permisos."
            : "Until defined, we retain your data and documents while your account remains active or as needed to meet legal or permitting obligations."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "6. Seguridad" : "6. Security"}</h2>
        <p>
          {isEs
            ? "Tus archivos se almacenan en un bucket privado: solo tú puedes ver y descargar tus propios documentos, mediante reglas de seguridad a nivel de base de datos (RLS) que verificamos periódicamente. Ningún sistema es 100% seguro, así que no podemos garantizar seguridad absoluta."
            : "Your files are stored in a private bucket: only you can view and download your own documents, enforced by database-level security rules (RLS) that we review periodically. No system is 100% secure, so we cannot guarantee absolute security."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "7. Tus derechos" : "7. Your rights"}</h2>
        <p>
          {isEs
            ? "Puedes solicitar acceso, corrección o eliminación de tus datos personales, o de tu cuenta, escribiéndonos a "
            : "You can request access, correction or deletion of your personal data or account by writing to "}
          <a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "8. Menores de edad" : "8. Children's privacy"}</h2>
        <p>
          {isEs
            ? "Nuestros servicios están dirigidos a adultos propietarios o responsables de una propiedad. No recopilamos a sabiendas información de menores de edad."
            : "Our services are directed at adult property owners or representatives. We do not knowingly collect information from minors."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "9. Cambios a esta política" : "9. Changes to this policy"}</h2>
        <p>
          {isEs
            ? "Podemos actualizar esta política ocasionalmente. Publicaremos cualquier cambio en esta misma página con una nueva fecha de actualización."
            : "We may update this policy from time to time. Any changes will be posted on this same page with a new update date."}
        </p>
      </section>

      <section className="legal-section">
        <h2>{isEs ? "10. Contáctanos" : "10. Contact us"}</h2>
        <div className="legal-contact-block">
          <p>Diaz Environmental, LLC</p>
          <p><a href="tel:6028128609">(602) 812-8609</a></p>
          <p><a href="mailto:septic@diazenviroaz.com">septic@diazenviroaz.com</a></p>
          <p>
            {isEs
              ? "Condado de Maricopa, Pinal, Pima, Yavapai, Coconino y todas las Naciones Nativas, Arizona"
              : "Maricopa, Pinal, Pima, Yavapai & Coconino Counties + all Native Nations, Arizona"}
          </p>
        </div>
      </section>

      <a className="legal-back-link" href="/">
        {isEs ? "← Volver al inicio" : "← Back to home"}
      </a>
    </main>
  );
};

export default PrivacyPolicy;
