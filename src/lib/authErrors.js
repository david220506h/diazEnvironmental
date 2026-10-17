const AUTH_ERROR_MESSAGES = [
  ["Invalid login credentials", { en: "Incorrect email or password.", es: "Correo o contraseña incorrectos." }],
  ["User already registered", { en: "An account with this email already exists.", es: "Ya existe una cuenta con este correo." }],
  ["Password should be at least 6 characters", { en: "Password must be at least 6 characters.", es: "La contraseña debe tener al menos 6 caracteres." }],
  ["Email not confirmed", { en: "Please confirm your email before signing in.", es: "Confirma tu correo antes de iniciar sesión." }],
  ["Unable to validate email address", { en: "That doesn't look like a valid email address.", es: "Ese correo no parece válido." }],
];

export const translateAuthError = (message, language) => {
  const match = AUTH_ERROR_MESSAGES.find(([key]) => message.includes(key));
  if (match) return match[1][language] || match[1].en;
  return message;
};
