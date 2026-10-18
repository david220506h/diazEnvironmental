import emailjs from "emailjs-com";

export const initEmailJS = (apiKey) => {
  emailjs.init(apiKey);
};

export const sendEmail = async (serviceId, templateId, templateParams) => {
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendContactForm = async (formData) => {
  const templateParams = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone || "No proporcionado",
    address: formData.address,
    address2: formData.address2 || "No proporcionado",
    serviceType: formData.serviceType,
    realEstateTransaction: formData.realEstateTransaction,
    newCustomer: formData.newCustomer,
    message: formData.message,
    receiveTexts: formData.receiveTexts,
  };

  const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
  return await sendEmail(serviceId, templateId, templateParams);
};