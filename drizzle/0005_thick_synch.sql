ALTER TABLE `swellEditorialReviews` DROP INDEX `swell_editorial_source_url_unique`;--> statement-breakpoint
ALTER TABLE `swellEditorialReviews` MODIFY COLUMN `sourceLastmod` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `swellEditorialReviews` ADD CONSTRAINT `swell_editorial_source_version_unique` UNIQUE(`sourceUrl`,`sourceLastmod`);