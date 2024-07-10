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
include_once "../object/type.php";

// получаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// инициализируем объект
$types = new Type($db);

// $API = 'http://localhost/api/image/';

$API = 'https://select.volga.su/api/image/';
 

// получаем отправленные данные

$typeItem = $_POST['type'];
$id = $_POST['id'];
$image = $_POST['image'];

// move_uploaded_file($img["tmp_name"], "../image/" . $img["name"]);


// убеждаемся, что данные не пусты
if (
    !empty($typeItem)  
) {
    // устанавливаем значения свойств товара
    $types->type = $typeItem; 
     $types->id = $id; 
   
     if (
    !empty($_FILES["file"])  
){

    if (file_exists($_FILES["file"]["tmp_name"])){
    $img = $_FILES["file"];

    // $file = $_FILES["files"];
    // $filename = $file["name"];
    $unloaddir = "../image/";
    $newname = md5(rand(10,999));
    $uploadfile =  $unloaddir . $newname . $_FILES["file"]['name'];  
    move_uploaded_file($img["tmp_name"], $uploadfile);
   $types->image = $API . $newname . $_FILES["file"]['name'];    
  } 
} else{
      $types->image = $image;
}

    // создание товара
    if ($types->update()) {
        // установим код ответа - 201 создано
        http_response_code(201);

        // сообщим пользователю
        echo json_encode(array("message" => "Тип был обновлен."), JSON_UNESCAPED_UNICODE);
    }
    // если не удается создать товар, сообщим пользователю
    else {
        // установим код ответа - 503 сервис недоступен
        http_response_code(503);

        // сообщим пользователю
        echo json_encode(array("message" => "Невозможно создать тип."), JSON_UNESCAPED_UNICODE);
    }
}
// сообщим пользователю что данные неполные
else {
    // установим код ответа - 400 неверный запрос
    http_response_code(400);

    // сообщим пользователю
    echo json_encode(array("message" => "Невозможно создать тип. Данные неполные."), JSON_UNESCAPED_UNICODE);
}