CREATE TABLE `agenticMailWebhookEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(128) NOT NULL,
	`eventType` varchar(64) NOT NULL,
	`inboxId` varchar(128) NOT NULL,
	`messageId` varchar(512) NOT NULL,
	`sender` varchar(320),
	`subject` varchar(512),
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agenticMailWebhookEvents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agenticMailWebhookEvents_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
CREATE INDEX `agentic_mail_inbox_received_idx` ON `agenticMailWebhookEvents` (`inboxId`,`receivedAt`);