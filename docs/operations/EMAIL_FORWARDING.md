# ARM Agency email forwarding

`ops@arm-agency.xyz` must not be advertised until forwarding is configured and tested.

1. In the DNS provider for `arm-agency.xyz`, enable an email-routing provider and create `ops@arm-agency.xyz` -> `ops@arm-agency.com`.
2. Publish the provider's MX records and SPF TXT record.
3. Publish DMARC at `_dmarc.arm-agency.xyz`, initially with `p=none` and aggregate reporting enabled.
4. Verify the destination mailbox, then test delivery from an unrelated external mailbox and inspect the received headers.
5. If mail must be sent as `ops@arm-agency.xyz`, configure a real mailbox or SMTP service and publish DKIM. Forwarding alone does not authorize outbound mail.

The current authoritative nameservers are external to this repository, so these DNS changes require access to the domain provider.
