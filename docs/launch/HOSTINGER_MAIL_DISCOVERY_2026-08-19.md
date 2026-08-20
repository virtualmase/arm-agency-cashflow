# Hostinger Mail Discovery — 2026-08-19

## Verified public configuration

`arm-agency.xyz` publishes Hostinger MX records (`mx1.hostinger.com` and `mx2.hostinger.com`) and an SPF policy that includes Hostinger Mail. Public DNS confirms that Hostinger is the domain's inbound mail platform; it does not expose mailbox passwords, SMTP credentials, or authenticated API access.

Hostinger's current configuration guidance identifies `smtp.hostinger.com` on port 465 with SSL as the primary authenticated SMTP option, with port 587 using TLS/STARTTLS as an alternative. Both methods require the full mailbox address and its password. [1]

## Delegated-access check

The available browser session reached the Hostinger email settings URL but did not load an authenticated mailbox-management interface. No Hostinger credential, mailbox password, or SMTP token is available to this project through the current session.

A repeat check later on 2026-08-19 produced the same Hostinger loading screen with no accessible mailbox-management controls. The delegated browser session therefore cannot be used to create a mailbox, reset its password, or reveal SMTP credentials.

## Controlled-launch implication

The owner-confirmed `ops@arm-agency.xyz` to `ops@arm-agency.com` forwarder provides a recipient route. The application has been updated to support provider-confirmed SMTP delivery, but it remains intentionally disabled until an authenticated sender credential is supplied. No queued lead email may be marked sent without a provider acceptance response.

## Reference

[1] [Hostinger — How to get email account configuration details](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/)
