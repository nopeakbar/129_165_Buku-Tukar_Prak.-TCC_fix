-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2025 at 05:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bukutukar`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `genre` varchar(50) NOT NULL,
  `condition` varchar(15) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `genre`, `condition`, `description`, `imageUrl`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'Laskar Pelangi', 'Andrea Hirata', '', '', 'Novel inspiratif anak Belitung', 'https://example.com/laskar.jpg', '2025-05-24 03:13:50', '2025-05-24 03:13:50', 5),
(2, 'Laskar Pelangi', 'Andrea Hirata', '', '', 'Sebuah kisah inspiratif dari Belitung', 'https://example.com/image.jpg', '2025-05-24 04:02:37', '2025-05-24 04:02:37', 6),
(3, 'Komunitas Mancing revisi', 'Baskara hidup', '', '', 'O tuan tolong jangan hari ini coyyyy', 'https://contoh.com/image.png', '2025-05-24 07:14:04', '2025-05-24 07:18:51', 7),
(4, 'makan 2', 'makan 2', 'makan', 'Low', 'makan 2 ', 'https://images.unsplash.com/photo-1747913647304-9f298ff28ff4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2025-05-26 01:43:52', '2025-05-26 03:27:42', 8),
(5, 'Memasak 2', 'Memasak Senang', 'Memasak', 'Medium', 'enak', 'https://images.unsplash.com/photo-1627907228175-2bf846a303b4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2025-05-26 03:34:07', '2025-05-26 03:48:33', 10);

-- --------------------------------------------------------

--
-- Table structure for table `exchanges`
--

CREATE TABLE `exchanges` (
  `id` int(11) NOT NULL,
  `requesterId` int(11) NOT NULL,
  `ownerId` int(11) NOT NULL,
  `status` enum('pending','accepted','declined','cancelled','completed') NOT NULL DEFAULT 'pending',
  `messages` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `offeredBookId` int(11) NOT NULL,
  `requestedBookId` int(11) NOT NULL,
  `meeting_datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exchanges`
--

INSERT INTO `exchanges` (`id`, `requesterId`, `ownerId`, `status`, `messages`, `location`, `createdAt`, `updatedAt`, `offeredBookId`, `requestedBookId`, `meeting_datetime`) VALUES
(1, 8, 7, 'pending', 'saya mau tukeran gan', 'di jalan UPN \"Veteran\" Yogyakarta', '2025-05-26 01:47:03', '2025-05-26 01:47:03', 4, 3, '2025-05-19 03:48:00'),
(2, 8, 7, 'pending', 'saya mau menukarkan buku saya dengan buku anda', 'Jl. Wahid Hasyim', '2025-05-26 03:12:16', '2025-05-26 03:12:16', 4, 3, '2025-05-27 03:15:00'),
(4, 10, 8, 'accepted', 'mau lagi bang', 'di mall jakarta selatan ', '2025-05-26 03:46:42', '2025-05-26 03:46:53', 5, 4, '2025-05-25 17:48:00'),
(5, 8, 10, 'accepted', 'saya mau menukarkan buku saya dengan buku anda', 'Jl. Patimura 2', '2025-05-26 04:25:04', '2025-05-26 04:40:25', 4, 5, '2025-05-27 04:26:00');

-- --------------------------------------------------------

--
-- Table structure for table `exchanges_history`
--

CREATE TABLE `exchanges_history` (
  `id` int(11) NOT NULL,
  `exchangeRequestId` int(11) NOT NULL,
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `whatsappNumber` varchar(30) DEFAULT NULL,
  `addressUser` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `avatarUrl` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `whatsappNumber`, `addressUser`, `createdAt`, `updatedAt`, `avatarUrl`) VALUES
(1, 'Akbar', 'nopeakbar@gmail.com', '$2b$10$/5xb/ZNW0Qzi.SmmKYVnuuNJ.V1laP6tHdmNOzrPSxarMmm4gTfZ.', '', '', '2025-05-23 13:43:31', '2025-05-23 13:43:31', NULL),
(5, 'Akbar1', 'akbar1@gmail.com', '$2b$10$PWPUT.Y8UsBhpP2cheZkCus1PI5p.2Uf4E4ET.ro8VnrwW3gDfu/2', '', '', '2025-05-23 14:28:48', '2025-05-23 14:28:48', NULL),
(6, 'Akbar2', 'akbar2@gmail.com', '$2b$10$3m92ipkvmccS4KxXVYH5y.K/sOSpuHYSDhtUjAGfS81HmNjLgt6lq', '', '', '2025-05-24 03:59:27', '2025-05-24 03:59:27', NULL),
(7, 'feast', 'feast@gmail.com', '$2b$10$bT.6wLoOvGEm9s2gyc04AODjd8nv/fevOoLG3giKl11WMC.vl6GZq', '', '', '2025-05-24 07:11:40', '2025-05-24 10:27:25', NULL),
(8, 'tessss', 'tesss@tessss.com', '$2b$10$oIqbY392x9R47sDBDPrgXuyPI3YrF94HU5momjIJZzZ2RpQqB/mTa', '0859823137', 'Seleman', '2025-05-25 07:03:39', '2025-05-26 02:23:38', NULL),
(9, 'tester', 'tester@example.com', '$2b$10$d7cTS6gH8MOsW0KaylW85ed72rft6sxetsHgl03JSgjF9RHBQ8Jne', '', '', '2025-05-25 21:08:37', '2025-05-25 21:08:37', NULL),
(10, 'alice02', 'alice01@example.com', '$2b$10$gUGPieE84TQOumd6JTuCTu5oiboYfI2n0LEzOb/1Xb3ifKkDVOcw2', '', '', '2025-05-26 03:32:01', '2025-05-26 03:48:45', NULL),
(11, 'tarot anjing', 'anjayyyking@gmail.babik', '$2b$10$CFpg3RC1LZxW5sp1dHkmPOeDK8O0TwRt60ODEhJpFiC3BhUlUlsG.', '089777588548', 'Bener', '2025-05-30 12:50:21', '2025-05-30 12:50:21', 'https://storage.googleapis.com/simpan_buku_tukar/avatars/1748609420320-10615701.jpg'),
(12, ' tcc bagus sangat seru', 'stress@gmail.babi', '$2b$10$udY.MBL5uUtDsOHRMcok9.c0ja2fK4WZwdftWz8pK5RElS5nNtsku', '089777588829', 'Bener Salah', '2025-05-30 13:05:28', '2025-05-30 13:05:28', 'https://storage.googleapis.com/simpan_buku_tukar/avatars/1748610326955-33218590.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `exchanges`
--
ALTER TABLE `exchanges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requesterId` (`requesterId`),
  ADD KEY `offeredBookId` (`offeredBookId`),
  ADD KEY `requestedBookId` (`requestedBookId`),
  ADD KEY `ownerId` (`ownerId`);

--
-- Indexes for table `exchanges_history`
--
ALTER TABLE `exchanges_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exchangeRequestId` (`exchangeRequestId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `exchanges`
--
ALTER TABLE `exchanges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `exchanges_history`
--
ALTER TABLE `exchanges_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `exchanges`
--
ALTER TABLE `exchanges`
  ADD CONSTRAINT `exchanges_ibfk_4` FOREIGN KEY (`requesterId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `exchanges_ibfk_5` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `exchanges_ibfk_6` FOREIGN KEY (`offeredBookId`) REFERENCES `books` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `exchanges_ibfk_7` FOREIGN KEY (`requestedBookId`) REFERENCES `books` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `exchanges_history`
--
ALTER TABLE `exchanges_history`
  ADD CONSTRAINT `exchanges_history_ibfk_1` FOREIGN KEY (`exchangeRequestId`) REFERENCES `exchanges` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
