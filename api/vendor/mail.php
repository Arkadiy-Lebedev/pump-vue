<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../libs/Exception.php';
require '../libs/PHPMailer.php';
require '../libs/SMTP.php';

// Получим данные

$name = $_POST['name'];
$pump_name = $_POST['pump_name'];
$phone = $_POST['phone'];
 $inn = $_POST['inn'];
 $email = $_POST['mail'];
 
// Создаем письмо
$mail = new PHPMailer();
$mail->isSMTP();                   // Отправка через SMTP
$mail->Host   = 'smtp.gmail.com';  // Адрес SMTP сервера
$mail->SMTPAuth   = true;          // Enable SMTP authentication
$mail->Username   = 'bepluvdt@gmail.com';       // ваше имя пользователя (без домена и @)
$mail->Password   = 'rhcr cmxf qsio zhkl';    // ваш пароль
$mail->SMTPSecure = 'ssl';         // шифрование ssl
$mail->Port   = 465;               // порт подключения
 $mail->CharSet = $mail::CHARSET_UTF8; 
$mail->setFrom('bepluvdt@gmail.com', 'Служба заказов Волга');    // от кого
$mail->addAddress(' sale@volga.su', 'Служба заказов Волга'); // кому
 
$mail->Subject = 'Запрос счета на ' . $pump_name;
$message = ' ФИО: ' . $name. '<br> Телефон: ' . $phone . '<br> ИНН: ' . $inn .  '<br> Электронная почта: ' . $email . '<br> Насос: ' . $pump_name;
$mail->msgHTML($message);
// Отправляем
if ($mail->send()) {
  echo json_encode(array("status" => true));
} else {
  echo json_encode(array("status" => false));
}
 
 
?>