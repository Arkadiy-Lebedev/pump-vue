<?php


class Pump
{
    // подключение к базе данных и таблице "products"
    private $conn;
    private $table_name = "pumps_td";

    // свойства объекта
    public $id;
    public $name;
    public $coordinates;
    public $typeid;
    public $nominal_q;
    public $nominal_h;
    public $frame;
    public $wheel_order;
    public $base;
    public $lid;
    public $shaft_standart;
    public $airVent;
    public $oring;
    public $bolt;
    public $coupling;
    public $seal_order;
    public $seal;
    public $d;
    public $b1;
    public $b2;
    public $b3;
    public $b4;
    public $b5;
    public $h1;
    public $h2;
    public $h3;
    public $l1;
    public $l2;
    public $weight;
    public $power;
    public $note;
    public $error;
    public $formuls;
    public $start;
    public $finish;
    public $step;
    public $minx;
    public $maxx;
    public $miny;
    public $maxy;
    public $step_y;
    public $step_x;

    public $rpm;
    public $pole;
    public $dn;
    public $phase;
    public $voltage;
    public $formuls_kw;
    public $start_kw;
    public $finish_kw;
    public $step_kw;
    public $minx_kw;
    public $maxx_kw;
    public $miny_kw;
    public $maxy_kw;
    public $step_y_kw;
    public $step_x_kw;

    public $formuls_npsh;
    public $start_npsh;
    public $finish_npsh;
    public $step_npsh;
    public $minx_npsh;
    public $maxx_npsh;
    public $miny_npsh;
    public $maxy_npsh;
    public $step_y_npsh;
    public $step_x_npsh;


    // конструктор для соединения с базой данных
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
{
    // выбираем все записи
    $query = "SELECT
     c.type, p.id, p.name, p.coordinates, 
            p.nominal_q, p.nominal_h,
p.frame,
p.wheel_order,
  p.base,   
p.lid,   
p.shaft_standart,   
p.airVent,  
p.oring,  
p.bolt,  
p.coupling, 
p.seal_order, 
p.seal, 
p.d, 
p.b1, 
p.b2, 
p.b3, 
p.b4, 
p.b5, 
p.h1, 
p.h2, 
p.h3, 
p.l1, 
p.l2, 
p.weight,
p.power,
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x,
p.rpm,
p.pole,
p.dn,
p.phase,
p.voltage,
 p.formuls_kw, p.start_kw, p.finish_kw, p.step_kw, p.minx_kw, p.maxx_kw, p.maxy_kw, p.miny_kw,
 p.step_y_kw, p.step_x_kw,
  p.formuls_npsh, p.start_npsh, p.finish_npsh, p.step_npsh, p.minx_npsh, p.maxx_npsh, p.maxy_npsh, p.miny_npsh,
 p.step_y_npsh, p.step_x_npsh,
            DATE_FORMAT(p.date_update, '%d.%m.%Y %H:%i') AS 'date_update'




     FROM " . $this->table_name . " p LEFT JOIN types c ON p.types_id = c.id";

    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // выполняем запрос
    $stmt->execute();
    
    return $stmt;
}

// метод для создания товаров
function create()
{
    

    // запрос для вставки (создания) записей
    $query = "INSERT INTO
            " . $this->table_name . "
        SET            
            name=:name,
            coordinates=:coordinates, 
            types_id=:typeid, 
            nominal_q=:nominal_q, 
            nominal_h=:nominal_h,
            frame=:frame,
            wheel_order=:wheel_order,
            base=:base,
            lid=:lid,
            shaft_standart=:shaft_standart,
            airVent=:airVent,    
            oring=:oring,  
            bolt=:bolt,   
            coupling=:coupling, 
            seal_order=:seal_order, 
            seal=:seal, 
            d=:d, 
            b1=:b1, 
            b2=:b2, 
            b3=:b3, 
            b4=:b4, 
            b5=:b5, 
            h1=:h1, 
            h2=:h2, 
            h3=:h3, 
            l1=:l1, 
            l2=:l2, 
            weight=:weight, 
            power=:power,
            note=:note,
            error=:error,
            formuls=:formuls, 
            start=:start, 
            finish=:finish, 
            step=:step, 
            minx=:minx, 
            maxx=:maxx, 
            maxy=:maxy, 
            miny=:miny,
            step_y=:step_y, 
            step_x=:step_x,
            date_update=NOW(),
            rpm=:rpm, 
            pole=:pole, 
            dn=:dn, 
            phase=:phase, 
            voltage=:voltage, 
            formuls_kw=:formuls_kw, 
            start_kw=:start_kw, 
            finish_kw=:finish_kw, 
            step_kw=:step_kw, 
            minx_kw=:minx_kw, 
            maxx_kw=:maxx_kw, 
            maxy_kw=:maxy_kw, 
            miny_kw=:miny_kw,
            step_y_kw=:step_y_kw, 
            step_x_kw=:step_x_kw,
            formuls_npsh=:formuls_npsh, 
            start_npsh=:start_npsh, 
            finish_npsh=:finish_npsh, 
            step_npsh=:step_npsh, 
            minx_npsh=:minx_npsh, 
            maxx_npsh=:maxx_npsh, 
            maxy_npsh=:maxy_npsh, 
            miny_npsh=:miny_npsh,
            step_y_npsh=:step_y_npsh, 
            step_x_npsh=:step_x_npsh
            "
            ;




    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    
    // привязка значений
   $stmt->bindParam(":name", $this->name);  
    $stmt->bindParam(":coordinates", $this->coordinates); 
    $stmt->bindParam(":typeid", $this->typeid);  
    $stmt->bindParam(":nominal_q", $this->nominal_q);
$stmt->bindParam(":nominal_h", $this->nominal_h);
    $stmt->bindParam(":frame", $this->frame);
 $stmt->bindParam(":wheel_order", $this->wheel_order);
 $stmt->bindParam(":base", $this->base);
 $stmt->bindParam(":lid", $this->lid);
 $stmt->bindParam(":shaft_standart", $this->shaft_standart);
  $stmt->bindParam(":airVent", $this->airVent);
  $stmt->bindParam(":oring", $this->oring);
 $stmt->bindParam(":bolt", $this->bolt);
   $stmt->bindParam(":coupling", $this->coupling);
  $stmt->bindParam(":seal_order", $this->seal_order);
  $stmt->bindParam(":seal", $this->seal);
$stmt->bindParam(":d", $this->d);
$stmt->bindParam(":b1", $this->b1);
$stmt->bindParam(":b2", $this->b2);
  $stmt->bindParam(":b3", $this->b3);
  $stmt->bindParam(":b4", $this->b4);
  $stmt->bindParam(":b5", $this->b5);
  $stmt->bindParam(":h1", $this->h1);
$stmt->bindParam(":h2", $this->h2);
  $stmt->bindParam(":h3", $this->h3); 
  $stmt->bindParam(":l1", $this->l1);
$stmt->bindParam(":l2", $this->l2);
$stmt->bindParam(":weight", $this->weight);
  $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":note", $this->note);
    $stmt->bindParam(":error", $this->error);    
 $stmt->bindParam(":formuls", $this->formuls);
 $stmt->bindParam(":start", $this->start);
$stmt->bindParam(":finish", $this->finish);
$stmt->bindParam(":step", $this->step);
$stmt->bindParam(":minx", $this->minx);
$stmt->bindParam(":maxx", $this->maxx);
$stmt->bindParam(":maxy", $this->maxy);
$stmt->bindParam(":miny", $this->miny);
$stmt->bindParam(":step_x", $this->step_x);
$stmt->bindParam(":step_y", $this->step_y);
$stmt->bindParam(":rpm", $this->rpm);
$stmt->bindParam(":pole", $this->pole);
$stmt->bindParam(":dn", $this->dn);
$stmt->bindParam(":phase", $this->phase);
$stmt->bindParam(":voltage", $this->voltage);
$stmt->bindParam(":formuls_kw", $this->formuls_kw);
 $stmt->bindParam(":start_kw", $this->start_kw);
$stmt->bindParam(":finish_kw", $this->finish_kw);
$stmt->bindParam(":step_kw", $this->step_kw);
$stmt->bindParam(":minx_kw", $this->minx_kw);
$stmt->bindParam(":maxx_kw", $this->maxx_kw);
$stmt->bindParam(":maxy_kw", $this->maxy_kw);
$stmt->bindParam(":miny_kw", $this->miny_kw);
$stmt->bindParam(":step_x_kw", $this->step_x_kw);
$stmt->bindParam(":step_y_kw", $this->step_y_kw);
 $stmt->bindParam(":formuls_npsh", $this->formuls_npsh);
 $stmt->bindParam(":start_npsh", $this->start_npsh);
$stmt->bindParam(":finish_npsh", $this->finish_npsh);
$stmt->bindParam(":step_npsh", $this->step_npsh);
$stmt->bindParam(":minx_npsh", $this->minx_npsh);
$stmt->bindParam(":maxx_npsh", $this->maxx_npsh);
$stmt->bindParam(":maxy_npsh", $this->maxy_npsh);
$stmt->bindParam(":miny_npsh", $this->miny_npsh);
$stmt->bindParam(":step_x_npsh", $this->step_x_npsh);
$stmt->bindParam(":step_y_npsh", $this->step_y_npsh);



    // выполняем запрос
    if ($stmt->execute()) {
        return true;
    }
    
    return false;
}

function readOne()
{
    // запрос для чтения одной записи (товара)
    $query = "SELECT
            c.type, p.id, p.name, p.coordinates, 
            p.nominal_q, p.nominal_h,
p.frame,
p.wheel_order,
  p.base,   
p.lid,   
p.shaft_standart,   
p.airVent,  
p.oring,  
p.bolt,  
p.coupling, 
p.seal_order, 
p.seal, 
p.d, 
p.b1, 
p.b2, 
p.b3, 
p.b4, 
p.b5, 
p.h1, 
p.h2, 
p.h3, 
p.l1, 
p.l2, 
p.weight,
p.power,
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x,
 p.rpm,
p.pole,
p.dn,
p.phase,
p.voltage,
 p.formuls_kw, p.start_kw, p.finish_kw, p.step_kw, p.minx_kw, p.maxx_kw, p.maxy_kw, p.miny_kw,
 p.step_y_kw, p.step_x_kw,
  p.formuls_npsh, p.start_npsh, p.finish_npsh, p.step_npsh, p.minx_npsh, p.maxx_npsh, p.maxy_npsh, p.miny_npsh,
 p.step_y_npsh, p.step_x_npsh
           
       
     FROM " . $this->table_name . " p LEFT JOIN types c ON p.types_id = c.id
        WHERE
            p.id = ?
        LIMIT
            0,1";
            
    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // привязываем id товара, который будет получен
    $stmt->bindParam(1, $this->id);

    // выполняем запрос
    $stmt->execute();


    return $stmt;
}


function update()
{
    // запрос для вставки (создания) записей
    $query = "UPDATE
            " . $this->table_name . "
        SET
             name=:name,
            coordinates=:coordinates, 
            types_id=:typeid, 
            nominal_q=:nominal_q, 
            nominal_h=:nominal_h,
            frame=:frame,
            wheel_order=:wheel_order,
            base=:base,
            lid=:lid,
            shaft_standart=:shaft_standart,
            airVent=:airVent,    
            oring=:oring,  
            bolt=:bolt,   
            coupling=:coupling, 
            seal_order=:seal_order, 
            seal=:seal, 
            d=:d, 
            b1=:b1, 
            b2=:b2, 
            b3=:b3, 
            b4=:b4, 
            b5=:b5, 
            h1=:h1, 
            h2=:h2, 
            h3=:h3, 
            l1=:l1, 
            l2=:l2, 
            weight=:weight, 
            power=:power,
            note=:note,
            error=:error,
            formuls=:formuls, 
            start=:start, 
            finish=:finish, 
            step=:step, 
            minx=:minx, 
            maxx=:maxx, 
            maxy=:maxy, 
            miny=:miny,
            step_y=:step_y, 
            step_x=:step_x,
              date_update=NOW(),
              rpm=:rpm, 
            pole=:pole, 
            dn=:dn, 
            phase=:phase, 
            voltage=:voltage, 
            formuls_kw=:formuls_kw, 
            start_kw=:start_kw, 
            finish_kw=:finish_kw, 
            step_kw=:step_kw, 
            minx_kw=:minx_kw, 
            maxx_kw=:maxx_kw, 
            maxy_kw=:maxy_kw, 
            miny_kw=:miny_kw,
            step_y_kw=:step_y_kw, 
            step_x_kw=:step_x_kw,
            formuls_npsh=:formuls_npsh, 
            start_npsh=:start_npsh, 
            finish_npsh=:finish_npsh, 
            step_npsh=:step_npsh, 
            minx_npsh=:minx_npsh, 
            maxx_npsh=:maxx_npsh, 
            maxy_npsh=:maxy_npsh, 
            miny_npsh=:miny_npsh,
            step_y_npsh=:step_y_npsh, 
            step_x_npsh=:step_x_npsh
             WHERE
            id = :id"
            ;


    // подготовка запроса
    $stmt = $this->conn->prepare($query);


    // привязка значений
    $stmt->bindParam(":id", $this->id);  
    $stmt->bindParam(":name", $this->name);  
    $stmt->bindParam(":coordinates", $this->coordinates); 
    $stmt->bindParam(":typeid", $this->typeid);  
    $stmt->bindParam(":nominal_q", $this->nominal_q);
$stmt->bindParam(":nominal_h", $this->nominal_h);
    $stmt->bindParam(":frame", $this->frame);
 $stmt->bindParam(":wheel_order", $this->wheel_order);
 $stmt->bindParam(":base", $this->base);
 $stmt->bindParam(":lid", $this->lid);
 $stmt->bindParam(":shaft_standart", $this->shaft_standart);
  $stmt->bindParam(":airVent", $this->airVent);
  $stmt->bindParam(":oring", $this->oring);
 $stmt->bindParam(":bolt", $this->bolt);
   $stmt->bindParam(":coupling", $this->coupling);
  $stmt->bindParam(":seal_order", $this->seal_order);
  $stmt->bindParam(":seal", $this->seal);
$stmt->bindParam(":d", $this->d);
$stmt->bindParam(":b1", $this->b1);
$stmt->bindParam(":b2", $this->b2);
  $stmt->bindParam(":b3", $this->b3);
  $stmt->bindParam(":b4", $this->b4);
  $stmt->bindParam(":b5", $this->b5);
  $stmt->bindParam(":h1", $this->h1);
$stmt->bindParam(":h2", $this->h2);
  $stmt->bindParam(":h3", $this->h3); 
  $stmt->bindParam(":l1", $this->l1);
$stmt->bindParam(":l2", $this->l2);
$stmt->bindParam(":weight", $this->weight);
  $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":note", $this->note);
    $stmt->bindParam(":error", $this->error);    
 $stmt->bindParam(":formuls", $this->formuls);
 $stmt->bindParam(":start", $this->start);
$stmt->bindParam(":finish", $this->finish);
$stmt->bindParam(":step", $this->step);
$stmt->bindParam(":minx", $this->minx);
$stmt->bindParam(":maxx", $this->maxx);
$stmt->bindParam(":maxy", $this->maxy);
$stmt->bindParam(":miny", $this->miny);
$stmt->bindParam(":step_x", $this->step_x);
$stmt->bindParam(":step_y", $this->step_y);
$stmt->bindParam(":rpm", $this->rpm);
$stmt->bindParam(":pole", $this->pole);
$stmt->bindParam(":dn", $this->dn);
$stmt->bindParam(":phase", $this->phase);
$stmt->bindParam(":voltage", $this->voltage);
$stmt->bindParam(":formuls_kw", $this->formuls_kw);
 $stmt->bindParam(":start_kw", $this->start_kw);
$stmt->bindParam(":finish_kw", $this->finish_kw);
$stmt->bindParam(":step_kw", $this->step_kw);
$stmt->bindParam(":minx_kw", $this->minx_kw);
$stmt->bindParam(":maxx_kw", $this->maxx_kw);
$stmt->bindParam(":maxy_kw", $this->maxy_kw);
$stmt->bindParam(":miny_kw", $this->miny_kw);
$stmt->bindParam(":step_x_kw", $this->step_x_kw);
$stmt->bindParam(":step_y_kw", $this->step_y_kw);
 $stmt->bindParam(":formuls_npsh", $this->formuls_npsh);
 $stmt->bindParam(":start_npsh", $this->start_npsh);
$stmt->bindParam(":finish_npsh", $this->finish_npsh);
$stmt->bindParam(":step_npsh", $this->step_npsh);
$stmt->bindParam(":minx_npsh", $this->minx_npsh);
$stmt->bindParam(":maxx_npsh", $this->maxx_npsh);
$stmt->bindParam(":maxy_npsh", $this->maxy_npsh);
$stmt->bindParam(":miny_npsh", $this->miny_npsh);
$stmt->bindParam(":step_x_npsh", $this->step_x_npsh);
$stmt->bindParam(":step_y_npsh", $this->step_y_npsh);
    // выполняем запрос
    if ($stmt->execute()) {
        return true;
    }
    return false;
}

// метод для удаления товара
function delete()
{
    // запрос для удаления записи (товара)
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // очистка
    $this->id = htmlspecialchars(strip_tags($this->id));

    // привязываем id записи для удаления
    $stmt->bindParam(1, $this->id);

    // выполняем запрос
    if ($stmt->execute()) {
        return true;
    }
    return false;
}


function copy()
{
  // запрос для вставки (создания) записей
  

 $query = "SELECT
     p.name, p.coordinates, 
            p.nominal_q, p.nominal_h,
p.frame,
p.types_id,
p.wheel_order,
  p.base,   
p.lid,   
p.shaft_standart,   
p.airVent,  
p.oring,  
p.bolt,  
p.coupling, 
p.seal_order, 
p.seal, 
p.d, 
p.b1, 
p.b2, 
p.b3, 
p.b4, 
p.b5, 
p.h1, 
p.h2, 
p.h3, 
p.l1, 
p.l2, 
p.weight,
p.power,
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x FROM " . $this->table_name . " p WHERE
            id = :id
             ";


    // подготовка запроса
    $stmt = $this->conn->prepare($query);
    // привязка значений   
$stmt->bindParam(":id", $this->id);

    // выполняем запрос
    if ($stmt->execute()) {
       
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

 
         $query2 = "INSERT INTO
            " . $this->table_name . "
        SET
            name=:name,
            coordinates=:coordinates, 
            types_id=:types_id, 
            nominal_q=:nominal_q, 
            nominal_h=:nominal_h,
            frame=:frame,
            wheel_order=:wheel_order,
            base=:base,
            lid=:lid,
            shaft_standart=:shaft_standart,
            airVent=:airVent,    
            oring=:oring,  
            bolt=:bolt,   
            coupling=:coupling, 
            seal_order=:seal_order, 
            seal=:seal, 
            d=:d, 
            b1=:b1, 
            b2=:b2, 
            b3=:b3, 
            b4=:b4, 
            b5=:b5, 
            h1=:h1, 
            h2=:h2, 
            h3=:h3, 
            l1=:l1, 
            l2=:l2, 
            weight=:weight, 
            power=:power,
            note=:note,
            error=:error,
            formuls=:formuls, 
            start=:start, 
            finish=:finish, 
            step=:step, 
            minx=:minx, 
            maxx=:maxx, 
            maxy=:maxy, 
            miny=:miny,
            step_y=:step_y, 
            step_x=:step_x,
            date_update=NOW()
            "
            ;

    // подготовка запроса
    $stmt2 = $this->conn->prepare($query2);
echo json_encode(array("message" =>   $row), JSON_UNESCAPED_UNICODE);
    
    $namecopy = $row["name"] . '-Copy';

     $stmt2->bindParam(":name",  $namecopy);    
     $stmt2->bindParam(":coordinates", $row["coordinates"]); 
    $stmt2->bindParam(":types_id", $row["types_id"]);  
    $stmt2->bindParam(":nominal_q", $row["nominal_q"]);
$stmt2->bindParam(":nominal_h", $row["nominal_h"]);
    $stmt2->bindParam(":frame", $row["frame"]);
 $stmt2->bindParam(":wheel_order", $row["wheel_order"]);
 $stmt2->bindParam(":base", $row["base"]);
 $stmt2->bindParam(":lid", $row["lid"]);
 $stmt2->bindParam(":shaft_standart", $row["shaft_standart"]);
  $stmt2->bindParam(":airVent", $row["airVent"]);
  $stmt2->bindParam(":oring", $row["oring"]);
 $stmt2->bindParam(":bolt", $row["bolt"]);
   $stmt2->bindParam(":coupling", $row["coupling"]);
  $stmt2->bindParam(":seal_order", $row["seal_order"]);
  $stmt2->bindParam(":seal", $row["seal"]);
$stmt2->bindParam(":d", $row["d"]);
$stmt2->bindParam(":b1", $row["b1"]);
$stmt2->bindParam(":b2", $row["b2"]);
  $stmt2->bindParam(":b3", $row["b3"]);
  $stmt2->bindParam(":b4", $row["b4"]);
  $stmt2->bindParam(":b5", $row["b5"]);
  $stmt2->bindParam(":h1", $row["h1"]);
$stmt2->bindParam(":h2", $row["h2"]);
  $stmt2->bindParam(":h3", $row["h3"]); 
  $stmt2->bindParam(":l1", $row["l1"]);
$stmt2->bindParam(":l2", $row["l2"]);
$stmt2->bindParam(":weight", $row["weight"]);
  $stmt2->bindParam(":power", $row["power"]);
    $stmt2->bindParam(":note", $row["note"]);
    $stmt2->bindParam(":error", $row["error"]);    
 $stmt2->bindParam(":formuls", $row["formuls"]);
 $stmt2->bindParam(":start", $row["start"]);
$stmt2->bindParam(":finish", $row["finish"]);
$stmt2->bindParam(":step", $row["step"]);
$stmt2->bindParam(":minx", $row["minx"]);
$stmt2->bindParam(":maxx", $row["maxx"]);
$stmt2->bindParam(":maxy", $row["maxy"]);
$stmt2->bindParam(":miny", $row["miny"]);
$stmt2->bindParam(":step_x", $row["step_x"]);
$stmt2->bindParam(":step_y", $row["step_y"]);
     
        
     if ($stmt2->execute()) {
 return true;
     }
    
    
    }
    return false;

}

function read_name()
{
    // выбираем все записи
    $query = "SELECT
     $this->table_name.id,  $this->table_name.name
     FROM " . $this->table_name;

    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // выполняем запрос
    $stmt->execute();
    
    return $stmt;
}






}