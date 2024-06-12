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

// Получаем данные
$data = json_decode(file_get_contents("php://input"));

$user->password = $data->jwt;
$pass_verification = $user->passVerification();

include_once "../config/core.php";
// include_once "../libs/BeforeValidException.php";
// include_once "../libs/ExpiredException.php";
// include_once "../libs/SignatureInvalidException.php";
// include_once "../libs/JWT.php";
// include_once "../libs/Key.php";
// use \Firebase\JWT\JWT;
// use \Firebase\JWT\Key; 

$jwt = isset($data->jwt) ? $data->jwt : ""; 


 if ($jwt) {
 
    // Если декодирование выполнено успешно, показать данные пользователя
    try {
        // Декодирование jwt
        // $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
 
        // Код ответа
        http_response_code(200);
 
        // Покажем детали
        echo json_encode(array(
            "auth" => true,
            "data" => array(
           "id" => $user->id,           
           "role" => $user->role,
           "name" => $user->name,
       )
        ));
    }
 
    // Если декодирование не удалось, это означает, что JWT является недействительным
    catch (Exception $e) {
    
        // Код ответа
        http_response_code(200);
    
        // Сообщим пользователю что ему отказано в доступе и покажем сообщение об ошибке
        echo json_encode(array(
            "auth" => false,
            "error" => $e->getMessage()
        ));
    }
}
 
// Покажем сообщение об ошибке, если JWT пуст
else {
 
    // Код ответа
    http_response_code(401);
 
    // Сообщим пользователю что доступ запрещен
    echo json_encode(array("message" => "Доступ запрещён"));
}


?>