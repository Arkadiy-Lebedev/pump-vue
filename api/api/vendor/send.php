<?php

// Получим данные

$content = $_POST['msg'];



// ---------------------
//в переменную $token нужно вставить токен, который нам прислал @botFather
$token = "6788253766:AAFh3tC4TOvK8lxy73BrTfBEUyboUdFqEnc";
 

//нужна вставить chat_id (Как получить chad id, читайте ниже)
$chat_id = "-4117806379";
 
//Далее создаем переменную, в которую помещаем PHP массив
$arr = array(
    'Замечания и предложения: ' => $content, 

  );


foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};
 
$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");


exit();
 
 
?>