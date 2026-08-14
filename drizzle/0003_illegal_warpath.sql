CREATE TABLE `operatingDecisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`signal` varchar(256) NOT NULL,
	`evidence` text,
	`decision` text NOT NULL,
	`owner` varchar(128) NOT NULL,
	`dueDate` timestamp,
	`status` enum('open','completed','deferred') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operatingDecisions_id` PRIMARY KEY(`id`)
);
