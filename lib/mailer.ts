import "server-only";
import nodemailer from "nodemailer";

/**
 * Envio de e-mail por SMTP (hoje: Gmail da agência com senha de app).
 * Trocar de provedor = só mudar as envs, sem tocar no código:
 * - SMTP_HOST (padrão smtp.gmail.com), SMTP_PORT (padrão 465, SSL)
 * - SMTP_USER / SMTP_PASS (no Gmail, a "senha de app" de 16 letras)
 *
 * Retorna null se faltar usuário/senha — quem chama decide o que fazer.
 */
export function createMailer() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return { transport, from: user };
}
