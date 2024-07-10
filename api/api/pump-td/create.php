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
include_once "../object/pump-td.php";
$database = new Database();
$db = $database->getConnection();
$pump = new Pump($db);



// получаем отправленные данные
// $data = json_decode(file_get_contents("php://input"));


$data = $_POST;
// убеждаемся, что данные не пусты
if (
    // !empty($data->name) &&
    // !empty($data->coordinates) 

    !empty($data['name'])  &&
      !empty($data['formuls']) 
) {
    // устанавливаем значения свойств товара

// $new_array1 = array_map(function($n){
//   return array("x" =>  round($n -> x, 2) *1, "y" => round(0.29125400566, 2) * 1);  
// }, json_decode($data['coordinates']));
  echo json_encode(array("message" =>  $data), JSON_UNESCAPED_UNICODE);

    $pump->name = $data['name'];
    $pump->coordinates = json_encode(json_decode($data['coordinates']));
$pump->typeid = $data["type"]; 
$pump->nominal_q = $data["nominal_q"]; 
$pump->nominal_h = $data["nominal_h"]; 
$pump->frame = $data["frame"]; 
$pump->wheel_order = $data["wheel_order"]; 
$pump->base = $data["base"]; 
$pump->lid = $data["lid"]; 
$pump->shaft_standart = $data["shaft_standart"]; 
$pump->airVent = $data["airVent"]; 
$pump->oring = $data["oring"]; 
$pump->bolt = $data["bolt"]; 
$pump->coupling = $data["coupling"]; 
$pump->seal_order = $data["seal_order"]; 
$pump->seal = $data["seal"]; 
$pump->d = $data["d"]; 
$pump->b1 = $data["b1"]; 
$pump->b2 = $data["b2"]; 
$pump->b3 = $data["b3"]; 
$pump->b4 = $data["b4"]; 
$pump->b5 = $data["b5"]; 
$pump->h1 = $data["h1"]; 
$pump->h2 = $data["h2"]; 
$pump->h3 = $data["h3"]; 
$pump->l1 = $data["l1"]; 
$pump->l2 = $data["l2"]; 
$pump->weight = $data["weight"];
$pump->power = $data["power"];
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

$pump->rpm = $data["rpm"]; 
$pump->pole = $data["pole"]; 
$pump->dn = $data["dn"]; 
$pump->phase = $data["phase"]; 
$pump->voltage = $data["voltage"]; 
$pump->formuls_kw = $data["formuls_kw"]; 
$pump->start_kw = $data["start_kw"]; 
$pump->finish_kw = $data["finish_kw"]; 
$pump->step_kw = $data["step_kw"]; 
$pump->minx_kw = $data["minx_kw"]; 
$pump->maxx_kw = $data["maxx_kw"]; 
$pump->miny_kw = $data["miny_kw"]; 
$pump->maxy_kw = $data["maxy_kw"]; 
$pump->step_y_kw = $data["step_y_kw"];
$pump->step_x_kw = $data["step_x_kw"];
$pump->formuls_npsh = $data["formuls_npsh"]; 
$pump->start_npsh = $data["start_npsh"]; 
$pump->finish_npsh = $data["finish_npsh"]; 
$pump->step_npsh = $data["step_npsh"]; 
$pump->minx_npsh = $data["minx_npsh"]; 
$pump->maxx_npsh = $data["maxx_npsh"]; 
$pump->miny_npsh = $data["miny_npsh"]; 
$pump->maxy_npsh = $data["maxy_npsh"]; 
$pump->step_y_npsh = $data["step_y_npsh"];
$pump->step_x_npsh = $data["step_x_npsh"];



    // создание товара
    if ($pump->create()) {
        // установим код ответа - 201 создано
        http_response_code(201);

        // сообщим пользователю
        echo json_encode(array("message" => "Товар был создан."), JSON_UNESCAPED_UNICODE);
    }
    // если не удается создать товар, сообщим пользователю
    else {
        // установим код ответа - 503 сервис недоступен
        http_response_code(503);

        // сообщим пользователю
        echo json_encode(array("message" => "Невозможно создать товар."), JSON_UNESCAPED_UNICODE);
    }
}
// сообщим пользователю что данные неполные
else {
    // установим код ответа - 400 неверный запрос
    http_response_code(400);

    // сообщим пользователю
    echo json_encode(array("message" => "Невозможно создать товар. Данные неполные."), JSON_UNESCAPED_UNICODE);
}