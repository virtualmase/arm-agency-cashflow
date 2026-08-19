import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.hoisted(() => vi.fn());
const createTransport = vi.hoisted(() => vi.fn(() => ({ sendMail })));

vi.mock("nodemailer", () => ({ default: { createTransport } }));

import { getEmailDeliveryConfiguration, isEmailDeliveryEnabled, sendTransactionalEmail } from "./emailDelivery";

const configuredEnvironment = {
  SMTP_HOST: "smtp.example.test",
  SMTP_PORT: "587",
  SMTP_USER: "smtp-user",
  SMTP_PASS: "smtp-password",
  EMAIL_FROM: "ARM Agency <ops@arm-agency.xyz>",
  EMAIL_DELIVERY_ENABLED: "true",
};

describe("provider-confirmed transactional delivery", () => {
  beforeEach(() => {
    sendMail.mockReset();
    createTransport.mockClear();
  });

  it("remains disabled when required SMTP configuration is absent", () => {
    expect(getEmailDeliveryConfiguration({ SMTP_HOST: "smtp.example.test" })).toBeNull();
    expect(isEmailDeliveryEnabled({ ...configuredEnvironment, EMAIL_DELIVERY_ENABLED: "false" })).toBe(false);
  });

  it("reports acceptance only after the provider accepts the addressed recipient", async () => {
    sendMail.mockResolvedValue({ accepted: ["ops@arm-agency.xyz"], rejected: [], messageId: "smtp-message-1" });

    await expect(sendTransactionalEmail({ to: "ops@arm-agency.xyz", subject: "Launch test", text: "Verified path" }, configuredEnvironment)).resolves.toEqual({
      accepted: true,
      messageId: "smtp-message-1",
      rejected: [],
    });
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ host: "smtp.example.test", port: 587, secure: false }));
  });

  it("does not report acceptance when the provider rejects the addressed recipient", async () => {
    sendMail.mockResolvedValue({ accepted: [], rejected: ["ops@arm-agency.xyz"], messageId: "smtp-message-2" });

    await expect(sendTransactionalEmail({ to: "ops@arm-agency.xyz", subject: "Launch test", text: "Rejected path" }, configuredEnvironment)).resolves.toEqual({
      accepted: false,
      messageId: "smtp-message-2",
      rejected: ["ops@arm-agency.xyz"],
      reason: "recipient_not_accepted",
    });
  });
});
