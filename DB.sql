-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 03, 2022 at 11:49 PM
-- Server version: 10.3.34-MariaDB-log
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itsvicly_wordle`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`username`, `password`) VALUES
('admin', 'ef73781effc5774100f87fe2f437a435');

-- --------------------------------------------------------

--
-- Table structure for table `gameLobby`
--

CREATE TABLE `gameLobby` (
  `player` varchar(255) NOT NULL,
  `opponent` varchar(255) NOT NULL,
  `inProgress` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gameLobby`
--

INSERT INTO `gameLobby` (`player`, `opponent`, `inProgress`) VALUES
('player1', 'test3', 0),
('test3', 'player1', 0),
('test3', 'dylan', 1),
('dylan', 'player1', 1),
('player1', 'dylan', 0),
('player1', 'test4', 0),
('Test4', 'player1', 1);

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `username` varchar(255) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`username`, `score`) VALUES
('player1', 230),
('player2', 202),
('dylan', -3),
('dylan2', 15),
('tester', 81),
('Test3', 191),
('test4', 81),
('test2', 81),
('player3', 202),
('test5', 81),
('wordlegod', 0),
('smurf', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('test2', '81dc9bdb52d04dc20036dbd8313ed055'),
('player1', '202cb962ac59075b964b07152d234b70'),
('player2', '202cb962ac59075b964b07152d234b70'),
('dylan', '5d93ceb70e2bf5daa84ec3d0cd2c731a'),
('dylan2', '5d93ceb70e2bf5daa84ec3d0cd2c731a'),
('tester', '81dc9bdb52d04dc20036dbd8313ed055'),
('Test3', '81dc9bdb52d04dc20036dbd8313ed055'),
('test4', '81dc9bdb52d04dc20036dbd8313ed055'),
('player3', '202cb962ac59075b964b07152d234b70'),
('test5', '81dc9bdb52d04dc20036dbd8313ed055'),
('wordlegod', '81dc9bdb52d04dc20036dbd8313ed055'),
('smurf', '5d93ceb70e2bf5daa84ec3d0cd2c731a');

-- --------------------------------------------------------

--
-- Table structure for table `words`
--

CREATE TABLE `words` (
  `username` varchar(255) NOT NULL,
  `word` varchar(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `words`
--

INSERT INTO `words` (`username`, `word`) VALUES
('dylan', 'Great'),
('wordlegod', 'crews'),
('test3', 'point'),
('Test4', 'Dingo'),
('smurf', 'frown');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `gameLobby`
--
ALTER TABLE `gameLobby`
  ADD PRIMARY KEY (`player`,`opponent`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `words`
--
ALTER TABLE `words`
  ADD PRIMARY KEY (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
