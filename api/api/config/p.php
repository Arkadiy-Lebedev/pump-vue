<?php

// $postData = file_get_contents('php://input');
// $data = json_decode($postData, true);

// file_put_contents('j.json', json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);


//     echo json_encode($data);

require_once 'db.php';

$data = $db->query("SELECT * FROM pump")->fetchAll(PDO::FETCH_ASSOC);
$types = $db->query("SELECT * FROM types")->fetchAll(PDO::FETCH_ASSOC);

  $respose = [
      "type" => $types,
      "data" => $data      
  ];
echo json_encode($respose);


 ?>