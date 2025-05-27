<?php
$user = 'u68797';
$pass = '6204726';
$db = new PDO(
	'mysql:host=localhost;dbname=u68797',
	$user,
	$pass,
	[PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
?>