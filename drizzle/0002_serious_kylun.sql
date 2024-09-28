CREATE TABLE `article` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`editor_time` integer NOT NULL,
	`added_at` integer NOT NULL,
	`added_by` text NOT NULL,
	FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_id_unique` ON `article` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `article_slug_duplicate` ON `article` (`slug`);