import nodemailer from "nodemailer";

type Environment = Record<string, string | undefined>;

export type EmailDeliveryConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
};

export type DeliveryResult = {
  accepted: boolean;
  messageId: string | null;
  rejected: string[];
  reason?: "not_configured" | "recipient_not_accepted";
};

export function getEmailDeliveryConfiguration(env: Environment = process.env): EmailDeliveryConfiguration | null {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS;
  const from = env.EMAIL_FROM?.trim();
  const port = Number(env.SMTP_PORT || "587");

  if (!host || !user || !pass || !from || !Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }

  return {
    host,
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
    user,
    pass,
    from,
  };
}

export function isEmailDeliveryEnabled(env: Environment = process.env) {
  return env.EMAIL_DELIVERY_ENABLED === "true" && getEmailDeliveryConfiguration(env) !== null;
}

export async function sendTransactionalEmail(message: TransactionalEmail, env: Environment = process.env): Promise<DeliveryResult> {
  const config = getEmailDeliveryConfiguration(env);
  if (!config) {
    return { accepted: false, messageId: null, rejected: [], reason: "not_configured" };
  }

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  const response = await transport.sendMail({ from: config.from, to: message.to, subject: message.subject, text: message.text });
  const accepted = response.accepted.some((recipient) => String(recipient).toLowerCase() === message.to.toLowerCase());

  return {
    accepted,
    messageId: response.messageId || null,
    rejected: response.rejected.map((recipient) => String(recipient)),
    ...(accepted ? {} : { reason: "recipient_not_accepted" as const }),
  };
}

export async function sendSupportLeadAlert(input: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
  useCase?: string | null;
  message?: string | null;
  source?: string | null;
}, env: Environment = process.env) {
  if (!isEmailDeliveryEnabled(env)) {
    return { accepted: false, messageId: null, rejected: [], reason: "not_configured" as const };
  }

  const supportInbox = env.SUPPORT_INBOX?.trim() || "ops@arm-agency.xyz";
  return sendTransactionalEmail({
    to: supportInbox,
    subject: `[ARM Lead] ${input.firstName} ${input.lastName}`,
    text: [
      "A lead was persisted in the ARM Agency CRM before this alert was sent.",
      `Name: ${input.firstName} ${input.lastName}`,
      `Email: ${input.email}`,
      `Company: ${input.company || "Not provided"}`,
      `Use case: ${input.useCase || "Not provided"}`,
      `Source: ${input.source || "contact_form"}`,
      `Message: ${input.message || "Not provided"}`,
    ].join("\n"),
  }, env);
}
