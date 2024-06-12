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
include_once "../object/pump.php";
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
    $pump->series = $data["series"];
    $pump->diameter = $data["diameter"];
    $pump->efficiency = $data["efficiency"];
    $pump->power = $data["power"];
    $pump->speed = $data["speed"];
    $pump->frequency = $data["frequency"];
    $pump->phase = $data["phase"];   
    $pump->voltage = $data["voltage"];
    $pump->launch = $data["launch"];
    $pump->seal = $data["seal"];
    $pump->shaft = $data["shaft"];
    $pump->pump = $data["pump"]; 
    $pump->typeid = $data["type"]; 
    $pump->error = $data["error"]; 
    $pump->note = $data["note"]; 
$pump->formuls = $data["formuls"]; 
$pump->start = $data["start"]; 
$pump->finish = $data["finish"]; 
$pump->step = $data["step"]; 
$pump->minx = $data["minx"]; 
$pump->maxx = $data["maxx"]; 
$pump->miny = $data["miny"]; 
$pump->maxy = $data["maxy"]; 
$pump->nominal_q = $data["nominal_q"]; 
$pump->nominal_h = $data["nominal_h"]; 
$pump->bar = $data["bar"]; 
$pump->material_standart = $data["material_standart"]; 
$pump->material_order = $data["material_order"]; 
$pump->isolation_standart = $data["isolation_standart"]; 
$pump->isolation_order = $data["isolation_order"]; 
$pump->shaft_standart = $data["shaft_standart"]; 
$pump->shaft_order = $data["shaft_order"]; 
$pump->bearing_standart = $data["bearing_standart"]; 
$pump->bearing_order = $data["bearing_order"]; 
$pump->bearing_up_standart = $data["bearing_up_standart"]; 
$pump->bearing_up_order = $data["bearing_up_order"];
$pump->bearing_down_standart = $data["bearing_down_standart"];
$pump->bearing_down_order = $data["bearing_down_order"];
$pump->spring_standart = $data["spring_standart"];
$pump->spring_order = $data["spring_order"];
$pump->seal_order = $data["seal_order"];
$pump->oring_standart = $data["oring_standart"];
$pump->oring_order = $data["oring_order"];
$pump->protect_standart = $data["protect_standart"];
$pump->protect_order = $data["protect_order"];
$pump->ip = $data["ip"];
$pump->current_strength = $data["current_strength"];
$pump->weight = $data["weight"];
$pump->size = $data["size"];
$pump->l10 = $data["l10"];
$pump->l6 = $data["l6"];
$pump->l4 = $data["l4"];
$pump->l3 = $data["l3"];
$pump->de = $data["de"];
$pump->m = $data["m"];
$pump->l2 = $data["l2"];
$pump->l1 = $data["l1"];
$pump->l = $data["l"];
$pump->h7 = $data["h7"];
$pump->h6 = $data["h6"];
$pump->h5 = $data["h5"];
$pump->h4 = $data["h4"];
$pump->h3 = $data["h3"];
$pump->n2 = $data["n2"];
$pump->j = $data["j"];
$pump->b1 = $data["b1"];
$pump->b = $data["b"];
$pump->a1 = $data["a1"];
$pump->a = $data["a"];
$pump->n1 = $data["n1"];
$pump->d1 = $data["d1"];
$pump->d = $data["d"];
$pump->g_l5 = $data["g_l5"];
$pump->g_b2 = $data["g_b2"];
$pump->g_h = $data["g_h"];
$pump->g_h1 = $data["g_h1"];
$pump->g_h2 = $data["g_h2"];
$pump->g_l8 = $data["g_l8"];
$pump->g_l9 = $data["g_l9"];
$pump->g_l7 = $data["g_l7"];
$pump->flange = $data["flange"];
$pump->wheel_standart = $data["wheel_standart"];
$pump->wheel_order = $data["wheel_order"];
$pump->pole = $data["pole"];
$pump->execution = $data["execution"];
$pump->step_y = $data["step_y"];
$pump->step_x = $data["step_x"];

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