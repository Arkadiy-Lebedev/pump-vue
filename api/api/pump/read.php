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

// инициализируем объект
$pump = new Pump($db);
 
// запрашиваем товары
$stmt = $pump->read();
$num = $stmt->rowCount();

// проверка, найдено ли больше 0 записей
if ($num > 0) {
    // массив товаров

    // $products_arr = array();
    // $products_arr["records"] = array();

    // получаем содержимое нашей таблицы
    // fetch() быстрее, чем fetchAll()
    // while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    //     // извлекаем строку
    //     extract($row);
    //     $product_item = array(
    //         "id" => $id,
    //         "name" => $name,
    //         "type" => $type
            
    //     );
    //     array_push($products_arr["records"], $product_item);
    // }

    $pumpes = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $respose = [
      "data" => $pumpes
         
  ];

    // устанавливаем код ответа - 200 OK
    http_response_code(200);

    // выводим данные о товаре в формате JSON
    echo json_encode($respose);
}

else {
    // установим код ответа - 404 Не найдено
    http_response_code(404);

    // сообщаем пользователю, что товары не найдены
    echo json_encode(array("message" => "Товары не найдены."), JSON_UNESCAPED_UNICODE);
}