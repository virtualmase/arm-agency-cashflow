CREATE TABLE `funnelEvents` (
  `id` int AUTO_INCREMENT NOT NULL,
  `eventName` enum('page_view','cta_click','lead_submitted','checkout_started','checkout_completed','portal_viewed') NOT NULL,
  `path` varchar(256),
  `productKey` varchar(128),
  `stream` varchar(64),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `funnelEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `purchases` ADD `productKey` varchar(128);
--> statement-breakpoint
ALTER TABLE `purchases` ADD `stream` varchar(64);
