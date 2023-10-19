CREATE TABLE IF NOT EXISTS `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `username` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` tinyblob NOT NULL,
  `super` tinyint(1) NOT NULL DEFAULT '0',
  `image` longblob,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `Tokens` (
  `token` tinyblob NOT NULL,
  `user` int NOT NULL,
  `type` int NOT NULL,
  CONSTRAINT FK_TOKEN_USER FOREIGN KEY (user) REFERENCES Users(id)
);
CREATE TABLE IF NOT EXISTS `Posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `author` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT FK_POST_AUTHOR FOREIGN KEY (author) REFERENCES Users(id)
);
CREATE TABLE IF NOT EXISTS `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `author` int NOT NULL,
  `post` int NOT NULL,
  `content` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT FK_COMMENT_AUTHOR FOREIGN KEY (author) REFERENCES Users(id),
  CONSTRAINT FK_COMMENT_POST FOREIGN KEY (post) REFERENCES Posts(id)
);
CREATE TABLE IF NOT EXISTS `Votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int NOT NULL,
  `type` enum('true', 'false', 'null') NOT NULL,
  `parent_comment` int DEFAULT NULL,
  `parent_post` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT FK_VOTE_POST FOREIGN KEY (parent_post) REFERENCES Posts(id),
  CONSTRAINT FK_VOTE_COMMENT FOREIGN KEY (parent_comment) REFERENCES Comments(id)
);