CREATE TABLE `redirects` (
	`id` integer PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`dest` text NOT NULL,
	`added_at` integer NOT NULL,
	`added_by` text NOT NULL,
	FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_id_unique` ON `redirects` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_source_duplicate` ON `redirects` (`source`);--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_dest_duplicate` ON `redirects` (`dest`);