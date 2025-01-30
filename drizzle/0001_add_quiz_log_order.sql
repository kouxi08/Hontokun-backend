RENAME TABLE `quizLog` TO `quiz_log`;--> statement-breakpoint
ALTER TABLE `quiz_log` DROP CONSTRAINT `timeCheck`;--> statement-breakpoint
ALTER TABLE `quiz_log` DROP FOREIGN KEY `quizLog_quiz_id_quiz_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_log` DROP FOREIGN KEY `quizLog_quiz_set_log_id_quiz_set_log_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_log` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `quiz_log` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `quiz_log` ADD `order` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_log` ADD CONSTRAINT `timeCheck` CHECK (`quiz_log`.`time` >= 0);--> statement-breakpoint
ALTER TABLE `quiz_log` ADD CONSTRAINT `quiz_log_quiz_id_quiz_id_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_log` ADD CONSTRAINT `quiz_log_quiz_set_log_id_quiz_set_log_id_fk` FOREIGN KEY (`quiz_set_log_id`) REFERENCES `quiz_set_log`(`id`) ON DELETE no action ON UPDATE no action;