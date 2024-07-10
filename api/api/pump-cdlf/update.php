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



// получаем соединение с базой данных
include_once "../config/database.php";

// создание объекта товара
include_once "../object/pump-cdlf.php";
$database = new Database();
$db = $database->getConnection();
$pump = new Pump($db);

// получаем отправленные данные
// $data = json_decode(file_get_contents("php://input"));

$data = $_POST;


// убеждаемся, что данные не пусты

    // устанавливаем значения свойств товара


    $pump->id = $data["id"];
     $pump->name = $data['name'];
    $pump->coordinates = json_encode(json_decode($data['coordinates']));
    $pump->typeid = $data["type"]; 

    $pump->b1 = $data["b1"]; 
    $pump->b2 = $data["b2"]; 
    $pump->b12 = $data["b12"]; 
    $pump->d1 = $data["d1"]; 
    $pump->d2 = $data["d2"]; 
    $pump->weight = $data["weight"];
    $pump->power = $data["power"];
    $pump->engineMount = $data["engineMount"];
    $pump->diffuser = $data["diffuser"];
    $pump->innerBody = $data["innerBody"];
    $pump->housingSupport = $data["housingSupport"];
    $pump->coupling = $data["coupling"];
    $pump->wheel = $data["wheel"];
    $pump->outerCasing = $data["outerCasing"];
    $pump->shaft = $data["shaft"];
    $pump->pipe = $data["pipe"];
    $pump->lid = $data["lid"];
    $pump->base = $data["base"];
    $pump->note = $data["note"]; 
    $pump->error = $data["error"];   
    $pump->formuls = $data["formuls"]; 
    $pump->start = $data["start"]; 
    $pump->finish = $data["finish"]; 
    $pump->step = $data["step"]; 
    $pump->minx = $data["minx"]; 
    $pump->maxx = $data["maxx"]; 
    $pump->miny = $data["miny"]; 
    $pump->maxy = $data["maxy"]; 
    $pump->step_y = $data["step_y"];
    $pump->step_x = $data["step_x"];


   // обновление товара
if ($pump->update()) {
    // установим код ответа - 200 ok
    http_response_code(200);

    // сообщим пользователю
    echo json_encode(array("message" => "Товар был обновлён"), JSON_UNESCAPED_UNICODE);
}
// если не удается обновить товар, сообщим пользователю
else {
    // код ответа - 503 Сервис не доступен
    http_response_code(503);

    // сообщение пользователю
    echo json_encode(array("message" => "Невозможно обновить товар"), JSON_UNESCAPED_UNICODE);
}
