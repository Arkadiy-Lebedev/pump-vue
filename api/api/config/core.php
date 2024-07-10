<?php

// Показ сообщений об ошибках
error_reporting(E_ALL);
 
// Установим часовой пояс по умолчанию
date_default_timezone_set("Europe/Moscow");
 
// Переменные, используемые для JWT
$key = "pump";
$iss = "https://select.volga.su";
$aud = "https://select.volga.su";
$iat = 1356999524;
$nbf = 1357000000;