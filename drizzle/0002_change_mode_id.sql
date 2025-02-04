ALTER TABLE `quiz_set_log` DROP FOREIGN KEY `quiz_set_log_quiz_mode_id_quiz_mode_id_fk`;
--> statement-breakpoint
ALTER TABLE `quiz_mode` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_set_log` MODIFY COLUMN `quiz_mode_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `quiz_set_log` ADD CONSTRAINT `quiz_set_log_quiz_mode_id_quiz_mode_id_fk` FOREIGN KEY (`quiz_mode_id`) REFERENCES `quiz_mode`(`id`) ON DELETE cascade ON UPDATE cascade;