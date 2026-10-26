-- ======================================================================
-- HireHub Recruitment & Employee Management Portal - MySQL 8 Schema
-- Database: hirehub_db
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ======================================================================

CREATE DATABASE IF NOT EXISTS `hirehub_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hirehub_db`;

-- 1. Users Table (Role-based authentication)
CREATE TABLE IF NOT EXISTS `hirehub_users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `password` VARCHAR(128) NOT NULL,
    `last_login` DATETIME(6) NULL,
    `is_superuser` TINYINT(1) NOT NULL DEFAULT 0,
    `email` VARCHAR(254) NOT NULL UNIQUE,
    `full_name` VARCHAR(150) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'CANDIDATE',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
    `date_joined` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Recruiter Profiles (1-to-1 with User)
CREATE TABLE IF NOT EXISTS `hirehub_recruiter_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(200) NOT NULL DEFAULT '',
    `company_description` LONGTEXT NOT NULL,
    `company_website` VARCHAR(255) NOT NULL DEFAULT '',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `user_id` BIGINT NOT NULL UNIQUE,
    CONSTRAINT `fk_recruiter_user` FOREIGN KEY (`user_id`) 
        REFERENCES `hirehub_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Candidate Profiles (1-to-1 with User)
CREATE TABLE IF NOT EXISTS `hirehub_candidate_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `phone` VARCHAR(25) NOT NULL DEFAULT '',
    `location` VARCHAR(150) NOT NULL DEFAULT '',
    `education` VARCHAR(255) NOT NULL DEFAULT '',
    `experience_years` DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    `skills` LONGTEXT NOT NULL,
    `resume_path` VARCHAR(255) NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `user_id` BIGINT NOT NULL UNIQUE,
    CONSTRAINT `fk_candidate_user` FOREIGN KEY (`user_id`) 
        REFERENCES `hirehub_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Job Postings (1-to-Many from Recruiter)
CREATE TABLE IF NOT EXISTS `hirehub_jobs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `required_skills` LONGTEXT NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `employment_type` VARCHAR(20) NOT NULL DEFAULT 'FULL_TIME',
    `experience_required` DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    `salary_min` DECIMAL(12,2) NULL,
    `salary_max` DECIMAL(12,2) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    `application_deadline` DATE NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `recruiter_id` BIGINT NOT NULL,
    INDEX `idx_jobs_title` (`title`),
    INDEX `idx_jobs_dept` (`department`),
    INDEX `idx_jobs_location` (`location`),
    INDEX `idx_jobs_status` (`status`),
    CONSTRAINT `fk_job_recruiter` FOREIGN KEY (`recruiter_id`) 
        REFERENCES `hirehub_recruiter_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Job Applications (Unique combination of Job & Candidate)
CREATE TABLE IF NOT EXISTS `hirehub_job_applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `resume_path` VARCHAR(255) NULL,
    `cover_letter` LONGTEXT NOT NULL,
    `status` VARCHAR(25) NOT NULL DEFAULT 'APPLIED',
    `applied_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `candidate_id` BIGINT NOT NULL,
    `job_id` BIGINT NOT NULL,
    INDEX `idx_application_status` (`status`),
    CONSTRAINT `unique_job_candidate_application` UNIQUE (`job_id`, `candidate_id`),
    CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) 
        REFERENCES `hirehub_jobs` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_app_candidate` FOREIGN KEY (`candidate_id`) 
        REFERENCES `hirehub_candidate_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
