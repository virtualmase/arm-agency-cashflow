CREATE TABLE `swellEditorialReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceLastmod` varchar(64),
	`sourceTitle` varchar(512) NOT NULL,
	`sourceDescription` text,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('pending_review','approved','declined','published','expired') NOT NULL DEFAULT 'pending_review',
	`generatedBrief` text NOT NULL,
	`suggestedSources` text,
	`suggestedLinks` text,
	`claimNotes` text,
	`reviewNotes` text,
	`reviewedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swellEditorialReviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `swell_editorial_source_url_unique` UNIQUE(`sourceUrl`)
);
--> statement-breakpoint
CREATE TABLE `swellPublicationMonitor` (
	`id` varchar(64) NOT NULL,
	`sourceSitemapUrl` varchar(1024) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`enabled` boolean NOT NULL DEFAULT false,
	`retentionDays` int NOT NULL DEFAULT 90,
	`lastCheckedAt` timestamp,
	`lastCheckSummary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `swellPublicationMonitor_id` PRIMARY KEY(`id`),
	CONSTRAINT `swell_monitor_task_uid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
CREATE INDEX `swell_editorial_status_detected_idx` ON `swellEditorialReviews` (`status`,`detectedAt`);--> statement-breakpoint
CREATE INDEX `swell_editorial_expires_idx` ON `swellEditorialReviews` (`expiresAt`);