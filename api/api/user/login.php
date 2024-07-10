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

// Подключение файлов JWT
include_once "../config/core.php";

// include_once "../libs/BeforeValidException.php";

// include_once "../libs/ExpiredException.php";

// include_once "../libs/SignatureInvalidException.php";

// include_once "../libs/JWT.php";



// use \Firebase\JWT\JWT;




// получаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// инициализируем объект
$user = new User($db);

// Получаем данные
$data = json_decode(file_get_contents("php://input"));

// Устанавливаем значения
$user->login = $data->login;
$login_exists = $user->loginExists();



// Существует ли электронная почта и соответствует ли пароль тому, что находится в базе данных
if ($login_exists && password_verify($data->password, $user->password)) {
 
    $token = array(
       "iss" => $iss,
       "aud" => $aud,
       "iat" => $iat,
       "nbf" => $nbf,
       "data" => array(
           "id" => $user->id,           
           "role" => $user->role,
           "name" => $user->name,
       )
    );

   
    // Код ответа
    http_response_code(200);
 
    // Создание jwt
    // $jwt = JWT::encode($token, $key, 'HS256');
    echo json_encode(
        array(
            "message" => "Успешный вход в систему",
            "login" => $user->name,
            "jwt" => $user->password
        )
    );
}
 
// Если электронная почта не существует или пароль не совпадает,
// Сообщим пользователю, что он не может войти в систему
else {
 
  // Код ответа
  http_response_code(401);

  // Скажем пользователю что войти не удалось
  echo json_encode(array("message" => "Ошибка входа", "error" => 401));
}
?>