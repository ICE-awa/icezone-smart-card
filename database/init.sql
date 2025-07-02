-- -----------------------------------------------------
-- 数据库: `smart_cards_db`
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `smart_cards_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_cards_db`;

-- -----------------------------------------------------
-- 表: `users` - 存储用户信息
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT '存储BCrypt哈希后的密码，长度需足够',
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER' COMMENT '用户角色：普通用户或管理员',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_users_username` (`username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 表: `decks` - 存储卡片组信息
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `decks` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `owner_id` BIGINT NOT NULL COMMENT '卡片组创建者的ID',
  `visibility` ENUM('PUBLIC', 'PRIVATE', 'HIDDEN') NOT NULL DEFAULT 'PRIVATE' COMMENT '可见性: 公开, 私有, 隐藏',
  `allow_owner_delete` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否允许创建者删除 (1:是, 0:否)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_decks_users_idx` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `fk_decks_users`
    FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 表: `cards` - 存储卡片的静态内容
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cards` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `deck_id` BIGINT NOT NULL,
  `card_type` ENUM('WORD', 'CHOICE', 'TRUE_FALSE') NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `options` JSON NULL COMMENT '仅用于选择题，存储选项的JSON对象',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_cards_decks_idx` (`deck_id` ASC) VISIBLE,
  CONSTRAINT `fk_cards_decks`
    FOREIGN KEY (`deck_id`)
    REFERENCES `decks` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 表: `user_card_progress`, `user_wrong_cards`, `learning_history`
-- ... (其他表的CREATE语句，与上一版本相同，此处为简洁省略)
-- (请将之前提供的其他表结构代码粘贴于此)
-- -----------------------------------------------------


-- =================================================================
-- 初始数据注入
-- =================================================================

-- -----------------------------------------------------
-- 重要提示：为 'admin' 用户插入初始数据。
-- 密码 'adm1n' 经过BCrypt哈希后的值为下方长字符串。
-- 后端的Spring Security配置的BCryptPasswordEncoder会自动匹配。
-- 切勿在此处直接插入明文密码 'adm1n'。
-- -----------------------------------------------------
INSERT INTO `users` (`username`, `password`, `role`) VALUES ('admin', '$2a$10$b2eIQDvkyR/1.woTy3CjBe307mVepCYcLyQfWqhpWAsqqtRU1aEFS', 'ADMIN')
ON DUPLICATE KEY UPDATE `password`='$2a$10$b2eIQDvkyR/1.woTy3CjBe307mVepCYcLyQfWqhpWAsqqtRU1aEFS', `role`='ADMIN';

-- -----------------------------------------------------
-- (可选) 为admin用户创建一个欢迎卡片组和几张示例卡片
-- -----------------------------------------------------
INSERT INTO `decks` (`name`, `owner_id`, `visibility`) VALUES ('欢迎使用冰域学习卡片', 1, 'PUBLIC')
ON DUPLICATE KEY UPDATE `name`='欢迎使用冰域学习卡片';

-- 假设上面插入的deck id为1
INSERT INTO `cards` (`deck_id`, `card_type`, `question`, `answer`, `options`) VALUES
(1, 'WORD', 'AI', '人工智能 (Artificial Intelligence)', NULL),
(1, 'CHOICE', '“冰域学习卡片”的核心算法是什么？', '["B"]', '{"A": "冒泡排序", "B": "SM-2", "C": "快速排序", "D": "深度学习"}'),
(1, 'TRUE_FALSE', '本项目的前端是使用Vue开发的。', 'false', NULL)
ON DUPLICATE KEY UPDATE `question`=VALUES(`question`);