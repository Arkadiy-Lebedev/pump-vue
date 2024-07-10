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

// Устанавливаем значения
$user->login = $data->login;
$user->name = $data->name;
$user->role = $data->role;
$user->password = $data->password;

// Создание пользователя
if (
    !empty($user->login) &&
    !empty($user->password) &&
    !empty($user->name) &&
    !empty($user->role) &&
    $user->create()
) {
    // Устанавливаем код ответа
    http_response_code(200);
 
    // Покажем сообщение о том, что пользователь был создан
    echo json_encode(array("message" => "Пользователь был создан"));
}
 
// Сообщение, если не удаётся создать пользователя
else {
 
    // Устанавливаем код ответа
    http_response_code(400);
 
    // Покажем сообщение о том, что создать пользователя не удалось
    echo json_encode(array("message" => "Невозможно создать пользователя"));
}

