<?php

// необходимые HTTP-заголовки
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// подключение базы данных и файл, содержащий объекты
include_once "../config/database.php";
include_once "../object/pump.php";

// получаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// подготовка объекта
$pump = new Pump($db);

// установим свойство ID записи для чтения
$pump->id = isset($_GET["id"]) ? $_GET["id"] : die();

// получим детали товара
$stmt = $pump->readOne();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row["name"] != null) {



    // код ответа - 200 OK
    http_response_code(200);

    // вывод в формате json
    echo json_encode($row);
} else {
    // код ответа - 404 Не найдено
    http_response_code(404);

    // сообщим пользователю, что такой товар не существует
    echo json_encode(array("message" => "Товар не существует"), JSON_UNESCAPED_UNICODE);
}