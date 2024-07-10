<?php

// необходимые HTTP-заголовки
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
        header('Access-Control-Allow-Headers: token, Content-Type');
        header('Access-Control-Max-Age: 1728000');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        die();
    }
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');



// подключение базы данных и файл, содержащий объекты
include_once "../config/database.php";
include_once "../object/user.php";

// получаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// инициализируем объект
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// установим id товара для удаления
$user->id = $data->id;

// удаление товара
if ($user->delete()) {
    // код ответа - 200 ok
    http_response_code(200);

    // сообщение пользователю
    echo json_encode(array("message" => "Пользователь был удалён"), JSON_UNESCAPED_UNICODE);
}
// если не удается удалить товар
else {
    // код ответа - 503 Сервис не доступен
    http_response_code(503);

    // сообщим об этом пользователю
    echo json_encode(array("message" => "Не удалось удалить тип"));
}

