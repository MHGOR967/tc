CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`details` text,
	`ipAddress` varchar(45),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `botButtons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buttonText` varchar(255) NOT NULL,
	`buttonCallback` varchar(255) NOT NULL,
	`buttonType` enum('admin','vip','user','fun','payment') DEFAULT 'user',
	`requiredPoints` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `botButtons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hostedPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageTitle` varchar(255) NOT NULL,
	`pageSlug` varchar(255) NOT NULL,
	`htmlContent` text,
	`s3Key` varchar(255),
	`createdBy` int,
	`isActive` boolean DEFAULT true,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hostedPages_id` PRIMARY KEY(`id`),
	CONSTRAINT `hostedPages_pageSlug_unique` UNIQUE(`pageSlug`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2),
	`points` int,
	`paymentMethod` enum('telegram_stars','manual'),
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`transactionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`pointsEarned` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `telegramChannels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channelId` varchar(64) NOT NULL,
	`channelName` varchar(255),
	`channelLink` text,
	`isRequired` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `telegramChannels_id` PRIMARY KEY(`id`),
	CONSTRAINT `telegramChannels_channelId_unique` UNIQUE(`channelId`)
);
--> statement-breakpoint
CREATE TABLE `userLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pageId` int NOT NULL,
	`linkToken` varchar(255) NOT NULL,
	`visitCount` int DEFAULT 0,
	`lastVisit` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `userLinks_linkToken_unique` UNIQUE(`linkToken`)
);
--> statement-breakpoint
CREATE TABLE `visitorData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`linkId` int NOT NULL,
	`visitorIp` varchar(45),
	`userAgent` text,
	`deviceType` varchar(50),
	`location` varchar(255),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitorData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `telegramUserId` bigint;--> statement-breakpoint
ALTER TABLE `users` ADD `points` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `isBanned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `referrerId` int;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_telegramUserId_unique` UNIQUE(`telegramUserId`);