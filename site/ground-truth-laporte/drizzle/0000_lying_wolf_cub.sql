CREATE TABLE `meeting_commitments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meetingId` int NOT NULL,
	`speaker` varchar(300),
	`speakerRole` varchar(300),
	`text` text NOT NULL,
	`metricLabel` varchar(300),
	`targetValue` varchar(120),
	`anchor` varchar(40),
	`trackerRef` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meeting_commitments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`body` varchar(300) NOT NULL,
	`title` varchar(500) NOT NULL,
	`heldOn` varchar(40) NOT NULL,
	`summary` text,
	`decisions` json DEFAULT ('[]'),
	`moneyDiscussed` json DEFAULT ('[]'),
	`unanswered` json DEFAULT ('[]'),
	`videoUrl` text,
	`transcript` text,
	`minutesUrl` text,
	`status` enum('sealed','processed','published') NOT NULL DEFAULT 'published',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`),
	CONSTRAINT `meetings_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`kind` enum('evidence','question') NOT NULL,
	`title` varchar(500) NOT NULL,
	`statement` text,
	`sourceUrl` text,
	`fileKey` varchar(512),
	`fileUrl` text,
	`fileName` varchar(500),
	`mimeType` varchar(120),
	`fileSize` int,
	`sha256` varchar(128),
	`status` enum('quarantined','under_review','verified','rejected') NOT NULL DEFAULT 'quarantined',
	`authenticityNotes` text,
	`releasedAt` timestamp,
	`rejectedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
