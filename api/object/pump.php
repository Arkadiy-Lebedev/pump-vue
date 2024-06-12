<?php


class Pump
{
    // подключение к базе данных и таблице "products"
    private $conn;
    private $table_name = "pump";

    // свойства объекта
    public $id;
    public $name;
    public $coordinates;
    public $series;
    public $diameter;
    public $efficiency;
    public $note;
    public $power;
    public $speed;
    public $frequency;
    public $phase;
    public $voltage;
    public $launch;
    public $seal;
    public $shaft;
    public $pump;
    public $typeid;
    public $error;
    public $formuls;
    public $start;
    public $finish;
    public $step;
    public $minx;
    public $maxx;
    public $miny;
    public $maxy;
    public $nominal_q;
public $nominal_h;
public $bar;
public $material_standart;
public $material_order;
public $isolation_standart;
public $isolation_order;
public $shaft_standart;
public $shaft_order;
public $bearing_standart;
public $bearing_order;
public $bearing_up_standart;
public $bearing_up_order;
public $bearing_down_standart;
public $bearing_down_order;
public $spring_standart;
public $spring_order;
public $seal_order;
public $oring_standart;
public $oring_order;
public $protect_standart;
public $protect_order;
public $ip;
public $current_strength;
public $weight;
public $size;
public $l10;
public $l6;
public $l4;
public $l3;
public $de;
public $m;
public $l2;
public $l1;
public $l;
public $h7;
public $h6;
public $h5;
public $h4;
public $h3;
public $n2;
public $j;
public $b1;
public $b;
public $a1;
public $a;
public $n1;
public $d1;
public $d;
public $g_l5;
public $g_b2;
public $g_h;
public $g_h1;
public $g_h2;
public $g_l8;
public $g_l9;
public $g_l7;
public $flange;
public $wheel_standart;
public $wheel_order;
public $date_update;
public $pole;
public $execution;
public $step_y;
public $step_x;

    // конструктор для соединения с базой данных
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
{
    // выбираем все записи
    $query = "SELECT
     c.type, p.id, p.name, p.coordinates, p.diameter, p.efficiency, p.frequency, p.error, 
     p.launch, p.note, p.phase, p.power, p.pump, p.seal, p.series, p.shaft, p.speed, p.voltage,
     p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
  p.nominal_q, p.nominal_h, p.bar, p.material_standart,
            p.material_order, p.isolation_standart, p.isolation_order,
            p.shaft_standart, p.shaft_order, p.bearing_standart,
            p.bearing_order, p.bearing_up_standart, p.bearing_up_order, 
            p.bearing_down_standart, p.bearing_down_order, p.spring_standart,
            p.spring_order, p.seal_order, p.oring_standart, p.oring_order, 
            p.protect_standart, p.protect_order, p.ip, p.current_strength, 
            p.weight,  p.size, p.l10, p.l6, p.l4, p.l3, p.de, p.m, p.l2, p.l1,
            p.l, p.h7, p.h6, p.h5, p.h4, p.h3,  p.n2, p.j, p.b1, p.b, p.a1, p.a,           
            p.n1, p.d1, p.d, p.g_l5, p.g_b2, p.g_h, p.g_h1, p.g_h2, p.g_l8, 
            p.g_l9, p.g_l7, p.flange, p.wheel_standart, p.wheel_order, p.pole, p.execution, p.step_y, p.step_x,
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
            coordinates=:coordinates, diameter=:diameter, efficiency=:efficiency, error=:error, frequency=:frequency,
            launch=:launch, name=:name, phase=:phase, power=:power,
            pump=:pump, seal=:seal, series=:series, shaft=:shaft, speed=:speed,  types_id=:typeid, voltage=:voltage, note=:note,
            formuls=:formuls, start=:start, finish=:finish, step=:step, minx=:minx, maxx=:maxx, maxy=:maxy, miny=:miny,
            nominal_q=:nominal_q, nominal_h=:nominal_h, bar=:bar, material_standart=:material_standart,
            material_order=:material_order, isolation_standart=:isolation_standart, isolation_order=:isolation_order,
            shaft_standart=:shaft_standart, shaft_order=:shaft_order, bearing_standart=:bearing_standart,
                     bearing_order=:bearing_order, bearing_up_standart=:bearing_up_standart, bearing_up_order=:bearing_up_order, 
            bearing_down_standart=:bearing_down_standart, bearing_down_order=:bearing_down_order, spring_standart=:spring_standart,
                        spring_order=:spring_order, seal_order=:seal_order, oring_standart=:oring_standart, oring_order=:oring_order, 
            protect_standart=:protect_standart, protect_order=:protect_order, ip=:ip, current_strength=:current_strength, 
            weight=:weight,  size=:size, l10=:l10, l6=:l6, l4=:l4, l3=:l3, de=:de, m=:m, l2=:l2, l1=:l1,
            l=:l, h7=:h7, h6=:h6, h5=:h5, h4=:h4, h3=:h3,  n2=:n2, j=:j, b1=:b1, b=:b, a1=:a1, a=:a,
           
                        n1=:n1, d1=:d1, d=:d, g_l5=:g_l5, g_b2=:g_b2, g_h=:g_h, g_h1=:g_h1, g_h2=:g_h2, g_l8=:g_l8, 
            g_l9=:g_l9, g_l7=:g_l7, flange=:flange,  wheel_standart=:wheel_standart, wheel_order=:wheel_order,
             pole=:pole, execution=:execution, step_y=:step_y, step_x=:step_x,
             date_update=NOW()
            "
            ;




    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // очистка
    // $this->name = htmlspecialchars(strip_tags($this->name));
    // $this->diameter = htmlspecialchars(strip_tags($this->diameter));
    // $this->efficiency = htmlspecialchars(strip_tags($this->efficiency));
    // $this->frequency = htmlspecialchars(strip_tags($this->frequency));
    // $this->launch = htmlspecialchars(strip_tags($this->launch));
    // $this->name = htmlspecialchars(strip_tags($this->name));
    // $this->phase = htmlspecialchars(strip_tags($this->phase));  
    // $this->power = htmlspecialchars(strip_tags($this->power));  
    // $this->pump = htmlspecialchars(strip_tags($this->pump));  
    // $this->seal = htmlspecialchars(strip_tags($this->seal));  
    // $this->series = htmlspecialchars(strip_tags($this->series)); 
    // $this->shaft = htmlspecialchars(strip_tags($this->shaft)); 
    // $this->speed = htmlspecialchars(strip_tags($this->speed)); 
    // $this->types_id = htmlspecialchars(strip_tags($this->types_id));
    // $this->voltage = htmlspecialchars(strip_tags($this->voltage));
    // привязка значений
   $stmt->bindParam(":name", $this->name);
    $stmt->bindParam(":diameter", $this->diameter);
    $stmt->bindParam(":efficiency", $this->efficiency);
    $stmt->bindParam(":frequency", $this->frequency);
    $stmt->bindParam(":launch", $this->launch);
    $stmt->bindParam(":coordinates", $this->coordinates);
    $stmt->bindParam(":phase", $this->phase);
    $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":pump", $this->pump);
    $stmt->bindParam(":seal", $this->seal);  
    $stmt->bindParam(":series", $this->series);  
    $stmt->bindParam(":shaft", $this->shaft);  
    $stmt->bindParam(":speed", $this->speed);  
    $stmt->bindParam(":typeid", $this->typeid);  
    $stmt->bindParam(":voltage", $this->voltage);
    $stmt->bindParam(":error", $this->error);
    $stmt->bindParam(":note", $this->note);
 $stmt->bindParam(":formuls", $this->formuls);
 $stmt->bindParam(":start", $this->start);
$stmt->bindParam(":finish", $this->finish);
$stmt->bindParam(":step", $this->step);
$stmt->bindParam(":minx", $this->minx);
$stmt->bindParam(":maxx", $this->maxx);
$stmt->bindParam(":maxy", $this->maxy);
$stmt->bindParam(":miny", $this->miny);

$stmt->bindParam(":nominal_q", $this->nominal_q);
$stmt->bindParam(":nominal_h", $this->nominal_h);
$stmt->bindParam(":bar", $this->bar);
$stmt->bindParam(":material_standart", $this->material_standart);
$stmt->bindParam(":material_order", $this->material_order);
$stmt->bindParam(":isolation_standart", $this->isolation_standart);
$stmt->bindParam(":isolation_order", $this->isolation_order);
$stmt->bindParam(":shaft_standart", $this->shaft_standart);
$stmt->bindParam(":shaft_order", $this->shaft_order);
$stmt->bindParam(":bearing_standart", $this->bearing_standart);
$stmt->bindParam(":bearing_order", $this->bearing_order);
$stmt->bindParam(":bearing_up_standart", $this->bearing_up_standart);
$stmt->bindParam(":bearing_up_order", $this->bearing_up_order);
$stmt->bindParam(":bearing_down_standart", $this->bearing_down_standart);
$stmt->bindParam(":bearing_down_order", $this->bearing_down_order);
$stmt->bindParam(":spring_standart", $this->spring_standart);
$stmt->bindParam(":spring_order", $this->spring_order);
$stmt->bindParam(":seal_order", $this->seal_order);
$stmt->bindParam(":oring_standart", $this->oring_standart);
$stmt->bindParam(":oring_order", $this->oring_order);
$stmt->bindParam(":protect_standart", $this->protect_standart);
$stmt->bindParam(":protect_order", $this->protect_order);
$stmt->bindParam(":ip", $this->ip);
$stmt->bindParam(":current_strength", $this->current_strength);
$stmt->bindParam(":weight", $this->weight);
$stmt->bindParam(":size", $this->size);
$stmt->bindParam(":l10", $this->l10);
$stmt->bindParam(":l6", $this->l6);
$stmt->bindParam(":l4", $this->l4);
$stmt->bindParam(":l3", $this->l3);
$stmt->bindParam(":de", $this->de);
$stmt->bindParam(":m", $this->m);
$stmt->bindParam(":l2", $this->l2);
$stmt->bindParam(":l1", $this->l1);
$stmt->bindParam(":l", $this->l);
$stmt->bindParam(":h7", $this->h7);
$stmt->bindParam(":h6", $this->h6);
$stmt->bindParam(":h5", $this->h5);
$stmt->bindParam(":h4", $this->h4);
$stmt->bindParam(":h3", $this->h3);
$stmt->bindParam(":n2", $this->n2);
$stmt->bindParam(":j", $this->j);
$stmt->bindParam(":b1", $this->b1);
$stmt->bindParam(":b", $this->b);
$stmt->bindParam(":a1", $this->a1);
$stmt->bindParam(":a", $this->a);
$stmt->bindParam(":n1", $this->n1);
$stmt->bindParam(":d1", $this->d1);
$stmt->bindParam(":d", $this->d);
$stmt->bindParam(":g_l5", $this->g_l5);
$stmt->bindParam(":g_b2", $this->g_b2);
$stmt->bindParam(":g_h", $this->g_h);
$stmt->bindParam(":g_h1", $this->g_h1);
$stmt->bindParam(":g_h2", $this->g_h2);
$stmt->bindParam(":g_l8", $this->g_l8);
$stmt->bindParam(":g_l9", $this->g_l9);
$stmt->bindParam(":g_l7", $this->g_l7);
$stmt->bindParam(":flange", $this->flange);
$stmt->bindParam(":wheel_standart", $this->wheel_standart);
$stmt->bindParam(":wheel_order", $this->wheel_order);
$stmt->bindParam(":pole", $this->pole);
$stmt->bindParam(":execution", $this->execution);
$stmt->bindParam(":step_x", $this->step_x);
$stmt->bindParam(":step_y", $this->step_y);
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
            c.type, p.id, p.name, p.coordinates, p.diameter, p.efficiency, p.frequency, p.error, 
     p.launch, p.note, p.phase, p.power, p.pump, p.seal, p.series, p.shaft, p.speed, p.voltage,
     p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
     p.nominal_q, p.nominal_h, p.bar, p.material_standart,
            p.material_order, p.isolation_standart, p.isolation_order,
            p.shaft_standart, p.shaft_order, p.bearing_standart,
            p.bearing_order, p.bearing_up_standart, p.bearing_up_order, 
            p.bearing_down_standart, p.bearing_down_order, p.spring_standart,
            p.spring_order, p.seal_order, p.oring_standart, p.oring_order, 
            p.protect_standart, p.protect_order, p.ip, p.current_strength, 
            p.weight,  p.size, p.l10, p.l6, p.l4, p.l3, p.de, p.m, p.l2, p.l1,
            p.l, p.h7, p.h6, p.h5, p.h4, p.h3,  p.n2, p.j, p.b1, p.b, p.a1, p.a,           
            p.n1, p.d1, p.d, p.g_l5, p.g_b2, p.g_h, p.g_h1, p.g_h2, p.g_l8, 
            p.g_l9, p.g_l7, p.flange, p.wheel_standart, p.wheel_order, p.pole, p.step_y, p.step_x, p.execution
       
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
            coordinates=:coordinates, diameter=:diameter, efficiency=:efficiency, error=:error, frequency=:frequency,
            launch=:launch, name=:name, phase=:phase, power=:power,
            pump=:pump, seal=:seal, series=:series, shaft=:shaft, speed=:speed,  types_id=:typeid, voltage=:voltage, note=:note,
            formuls=:formuls, start=:start, finish=:finish, step=:step, minx=:minx, maxx=:maxx, maxy=:maxy, miny=:miny,
            nominal_q=:nominal_q, nominal_h=:nominal_h, bar=:bar, material_standart=:material_standart,
            material_order=:material_order, isolation_standart=:isolation_standart, isolation_order=:isolation_order,
            shaft_standart=:shaft_standart, shaft_order=:shaft_order, bearing_standart=:bearing_standart,
                     bearing_order=:bearing_order, bearing_up_standart=:bearing_up_standart, bearing_up_order=:bearing_up_order, 
            bearing_down_standart=:bearing_down_standart, bearing_down_order=:bearing_down_order, spring_standart=:spring_standart,
                        spring_order=:spring_order, seal_order=:seal_order, oring_standart=:oring_standart, oring_order=:oring_order, 
            protect_standart=:protect_standart, protect_order=:protect_order, ip=:ip, current_strength=:current_strength, 
            weight=:weight,  size=:size, l10=:l10, l6=:l6, l4=:l4, l3=:l3, de=:de, m=:m, l2=:l2, l1=:l1,
            l=:l, h7=:h7, h6=:h6, h5=:h5, h4=:h4, h3=:h3,  n2=:n2, j=:j, b1=:b1, b=:b, a1=:a1, a=:a,
           
                        n1=:n1, d1=:d1, d=:d, g_l5=:g_l5, g_b2=:g_b2, g_h=:g_h, g_h1=:g_h1, g_h2=:g_h2, g_l8=:g_l8, 
            g_l9=:g_l9, g_l7=:g_l7, flange=:flange, wheel_standart=:wheel_standart,
             wheel_order=:wheel_order, pole=:pole, execution=:execution, step_y=:step_y, step_x=:step_x,
              date_update=NOW() WHERE
            id = :id"
            ;


    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // очистка
    // $this->name = htmlspecialchars(strip_tags($this->name));
    // $this->diameter = htmlspecialchars(strip_tags($this->diameter));
    // $this->efficiency = htmlspecialchars(strip_tags($this->efficiency));
    // $this->frequency = htmlspecialchars(strip_tags($this->frequency));
    // $this->launch = htmlspecialchars(strip_tags($this->launch));
    // $this->name = htmlspecialchars(strip_tags($this->name));
    // $this->phase = htmlspecialchars(strip_tags($this->phase));  
    // $this->power = htmlspecialchars(strip_tags($this->power));  
    // $this->pump = htmlspecialchars(strip_tags($this->pump));  
    // $this->seal = htmlspecialchars(strip_tags($this->seal));  
    // $this->series = htmlspecialchars(strip_tags($this->series)); 
    // $this->shaft = htmlspecialchars(strip_tags($this->shaft)); 
    // $this->speed = htmlspecialchars(strip_tags($this->speed)); 
    // $this->types_id = htmlspecialchars(strip_tags($this->types_id));
    // $this->voltage = htmlspecialchars(strip_tags($this->voltage));
    // привязка значений
    $stmt->bindParam(":name", $this->name);
    $stmt->bindParam(":diameter", $this->diameter);
    $stmt->bindParam(":efficiency", $this->efficiency);
    $stmt->bindParam(":frequency", $this->frequency);
    $stmt->bindParam(":launch", $this->launch);
    $stmt->bindParam(":coordinates", $this->coordinates);
    $stmt->bindParam(":phase", $this->phase);
    $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":pump", $this->pump);
    $stmt->bindParam(":seal", $this->seal);  
    $stmt->bindParam(":series", $this->series);  
    $stmt->bindParam(":shaft", $this->shaft);  
    $stmt->bindParam(":speed", $this->speed);  
    $stmt->bindParam(":typeid", $this->typeid);  
    $stmt->bindParam(":voltage", $this->voltage);
    $stmt->bindParam(":error", $this->error);
    $stmt->bindParam(":id", $this->id);
    $stmt->bindParam(":note", $this->note);
     $stmt->bindParam(":formuls", $this->formuls);
 $stmt->bindParam(":start", $this->start);
$stmt->bindParam(":finish", $this->finish);
$stmt->bindParam(":step", $this->step);
$stmt->bindParam(":minx", $this->minx);
$stmt->bindParam(":maxx", $this->maxx);
$stmt->bindParam(":maxy", $this->maxy);
$stmt->bindParam(":miny", $this->miny);
$stmt->bindParam(":nominal_q", $this->nominal_q);
$stmt->bindParam(":nominal_h", $this->nominal_h);
$stmt->bindParam(":bar", $this->bar);
$stmt->bindParam(":material_standart", $this->material_standart);
$stmt->bindParam(":material_order", $this->material_order);
$stmt->bindParam(":isolation_standart", $this->isolation_standart);
$stmt->bindParam(":isolation_order", $this->isolation_order);
$stmt->bindParam(":shaft_standart", $this->shaft_standart);
$stmt->bindParam(":shaft_order", $this->shaft_order);
$stmt->bindParam(":bearing_standart", $this->bearing_standart);
$stmt->bindParam(":bearing_order", $this->bearing_order);
$stmt->bindParam(":bearing_up_standart", $this->bearing_up_standart);
$stmt->bindParam(":bearing_up_order", $this->bearing_up_order);
$stmt->bindParam(":bearing_down_standart", $this->bearing_down_standart);
$stmt->bindParam(":bearing_down_order", $this->bearing_down_order);
$stmt->bindParam(":spring_standart", $this->spring_standart);
$stmt->bindParam(":spring_order", $this->spring_order);
$stmt->bindParam(":seal_order", $this->seal_order);
$stmt->bindParam(":oring_standart", $this->oring_standart);
$stmt->bindParam(":oring_order", $this->oring_order);
$stmt->bindParam(":protect_standart", $this->protect_standart);
$stmt->bindParam(":protect_order", $this->protect_order);
$stmt->bindParam(":ip", $this->ip);
$stmt->bindParam(":current_strength", $this->current_strength);
$stmt->bindParam(":weight", $this->weight);
$stmt->bindParam(":size", $this->size);
$stmt->bindParam(":l10", $this->l10);
$stmt->bindParam(":l6", $this->l6);
$stmt->bindParam(":l4", $this->l4);
$stmt->bindParam(":l3", $this->l3);
$stmt->bindParam(":de", $this->de);
$stmt->bindParam(":m", $this->m);
$stmt->bindParam(":l2", $this->l2);
$stmt->bindParam(":l1", $this->l1);
$stmt->bindParam(":l", $this->l);
$stmt->bindParam(":h7", $this->h7);
$stmt->bindParam(":h6", $this->h6);
$stmt->bindParam(":h5", $this->h5);
$stmt->bindParam(":h4", $this->h4);
$stmt->bindParam(":h3", $this->h3);
$stmt->bindParam(":n2", $this->n2);
$stmt->bindParam(":j", $this->j);
$stmt->bindParam(":b1", $this->b1);
$stmt->bindParam(":b", $this->b);
$stmt->bindParam(":a1", $this->a1);
$stmt->bindParam(":a", $this->a);
$stmt->bindParam(":n1", $this->n1);
$stmt->bindParam(":d1", $this->d1);
$stmt->bindParam(":d", $this->d);
$stmt->bindParam(":g_l5", $this->g_l5);
$stmt->bindParam(":g_b2", $this->g_b2);
$stmt->bindParam(":g_h", $this->g_h);
$stmt->bindParam(":g_h1", $this->g_h1);
$stmt->bindParam(":g_h2", $this->g_h2);
$stmt->bindParam(":g_l8", $this->g_l8);
$stmt->bindParam(":g_l9", $this->g_l9);
$stmt->bindParam(":g_l7", $this->g_l7);
$stmt->bindParam(":flange", $this->flange);
$stmt->bindParam(":wheel_standart", $this->wheel_standart);
$stmt->bindParam(":wheel_order", $this->wheel_order);
$stmt->bindParam(":pole", $this->pole);
$stmt->bindParam(":execution", $this->execution);
$stmt->bindParam(":step_y", $this->step_y);
$stmt->bindParam(":step_x", $this->step_x);
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
     `name`, `coordinates`, `diameter`, `efficiency`, `frequency`, `error`, 
     `launch`, `note`, `phase`, `power`, `pump`, `seal`, `series`, `shaft`, `speed`, `voltage`,
     `formuls`, `start`, `finish`, `step`, `minx`, `maxx`, `maxy`, `miny`,
 `nominal_q`, `nominal_h`, `bar`, `material_standart`,
            `material_order`, `isolation_standart`, `isolation_order`,
            `shaft_standart`, `shaft_order`, `bearing_standart`,
            `bearing_order`, `bearing_up_standart`, `bearing_up_order`, 
            `bearing_down_standart`, `bearing_down_order`, `spring_standart`,
            `spring_order`, `seal_order`, `oring_standart`, `oring_order`, 
            `protect_standart`, `protect_order`, `ip`, `current_strength`, 
            `weight`,  `size`, `l10`, `l6`, `l4`, `l3`, `de`, `m`, `l2`, `l1`,
            `l`, `h7`, `h6`, `h5`, `h4`, `h3`,  `n2`, `j`, `b1`, `b`, `a1`, `a`,           
            `n1`, `d1`, `d`, `g_l5`, `g_b2`, `g_h`, `g_h1`, `g_h2`, `g_l8`, 
            `g_l9`, `g_l7`, `flange`, `wheel_standart`, `wheel_order`, `pole`, `step_y`, `step_x`,
             `execution` FROM " . $this->table_name . " WHERE
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
            coordinates=:coordinates, diameter=:diameter, efficiency=:efficiency, error=:error, frequency=:frequency,
            launch=:launch, name=:name, phase=:phase, power=:power,
            pump=:pump, seal=:seal, series=:series, shaft=:shaft, speed=:speed,  types_id=:typeid, voltage=:voltage, note=:note,
            formuls=:formuls, start=:start, finish=:finish, step=:step, minx=:minx, maxx=:maxx, maxy=:maxy, miny=:miny,
            nominal_q=:nominal_q, nominal_h=:nominal_h, bar=:bar, material_standart=:material_standart,
            material_order=:material_order, isolation_standart=:isolation_standart, isolation_order=:isolation_order,
            shaft_standart=:shaft_standart, shaft_order=:shaft_order, bearing_standart=:bearing_standart,
                     bearing_order=:bearing_order, bearing_up_standart=:bearing_up_standart, bearing_up_order=:bearing_up_order, 
            bearing_down_standart=:bearing_down_standart, bearing_down_order=:bearing_down_order, spring_standart=:spring_standart,
                        spring_order=:spring_order, seal_order=:seal_order, oring_standart=:oring_standart, oring_order=:oring_order, 
            protect_standart=:protect_standart, protect_order=:protect_order, ip=:ip, current_strength=:current_strength, 
            weight=:weight,  size=:size, l10=:l10, l6=:l6, l4=:l4, l3=:l3, de=:de, m=:m, l2=:l2, l1=:l1,
            l=:l, h7=:h7, h6=:h6, h5=:h5, h4=:h4, h3=:h3,  n2=:n2, j=:j, b1=:b1, b=:b, a1=:a1, a=:a,
           
                        n1=:n1, d1=:d1, d=:d, g_l5=:g_l5, g_b2=:g_b2, g_h=:g_h, g_h1=:g_h1, g_h2=:g_h2, g_l8=:g_l8, 
            g_l9=:g_l9, g_l7=:g_l7, flange=:flange,  wheel_standart=:wheel_standart, wheel_order=:wheel_order,
             pole=:pole, execution=:execution, step_y=:step_y, step_x=:step_x,
             date_update=NOW()
            "
            ;

    // подготовка запроса
    $stmt2 = $this->conn->prepare($query2);
    $namecopy = $row["name"] . '-Copy';

     $stmt2->bindParam(":name",  $namecopy);
     $stmt2->bindParam(":diameter",  $row["diameter"]);
    $stmt2->bindParam(":efficiency",  $row["efficiency"]);
    $stmt2->bindParam(":frequency",  $row["frequency"]);
    $stmt2->bindParam(":launch",  $row["launch"]);
    $stmt2->bindParam(":coordinates",  $row["coordinates"]);
    $stmt2->bindParam(":phase",  $row["phase"]);
    $stmt2->bindParam(":power",  $row["power"]);
    $stmt2->bindParam(":pump",  $row["pump"]);
    $stmt2->bindParam(":seal",  $row["seal"]);  
    $stmt2->bindParam(":series",  $row["series"]);  
    $stmt2->bindParam(":shaft",  $row["shaft"]);  
    $stmt2->bindParam(":speed",  $row["speed"]);  
    $stmt2->bindParam(":typeid",  $row["typeid"]);  
    $stmt2->bindParam(":voltage",  $row["voltage"]);
    $stmt2->bindParam(":error",  $row["error"]);
    $stmt2->bindParam(":note",  $row["note"]);
 $stmt2->bindParam(":formuls",  $row["formuls"]);
 $stmt2->bindParam(":start",  $row["start"]);
$stmt2->bindParam(":finish",  $row["finish"]);
$stmt2->bindParam(":step",  $row["step"]);
$stmt2->bindParam(":minx",  $row["minx"]);
$stmt2->bindParam(":maxx",  $row["maxx"]);
$stmt2->bindParam(":maxy",  $row["maxy"]);
$stmt2->bindParam(":miny",  $row["miny"]);

$stmt2->bindParam(":nominal_q",  $row["nominal_q"]);
$stmt2->bindParam(":nominal_h",  $row["nominal_h"]);
$stmt2->bindParam(":bar",  $row["bar"]);
$stmt2->bindParam(":material_standart",  $row["material_standart"]);
$stmt2->bindParam(":material_order",  $row["material_order"]);
$stmt2->bindParam(":isolation_standart",  $row["isolation_standart"]);
$stmt2->bindParam(":isolation_order",  $row["isolation_order"]);
$stmt2->bindParam(":shaft_standart",  $row["shaft_standart"]);
$stmt2->bindParam(":shaft_order",  $row["shaft_order"]);
$stmt2->bindParam(":bearing_standart",  $row["bearing_standart"]);
$stmt2->bindParam(":bearing_order",  $row["bearing_order"]);
$stmt2->bindParam(":bearing_up_standart",  $row["bearing_up_standart"]);
$stmt2->bindParam(":bearing_up_order",  $row["bearing_up_order"]);
$stmt2->bindParam(":bearing_down_standart",  $row["bearing_down_standart"]);
$stmt2->bindParam(":bearing_down_order",  $row["bearing_down_order"]);
$stmt2->bindParam(":spring_standart",  $row["spring_standart"]);
$stmt2->bindParam(":spring_order",  $row["spring_order"]);
$stmt2->bindParam(":seal_order",  $row["seal_order"]);
$stmt2->bindParam(":oring_standart",  $row["oring_standart"]);
$stmt2->bindParam(":oring_order",  $row["oring_order"]);
$stmt2->bindParam(":protect_standart",  $row["protect_standart"]);
$stmt2->bindParam(":protect_order",  $row["protect_order"]);
$stmt2->bindParam(":ip",  $row["ip"]);
$stmt2->bindParam(":current_strength",  $row["current_strength"]);
$stmt2->bindParam(":weight",  $row["weight"]);
$stmt2->bindParam(":size",  $row["size"]);
$stmt2->bindParam(":l10",  $row["l10"]);
$stmt2->bindParam(":l6",  $row["l6"]);
$stmt2->bindParam(":l4",  $row["l4"]);
$stmt2->bindParam(":l3",  $row["l3"]);
$stmt2->bindParam(":de",  $row["de"]);
$stmt2->bindParam(":m",  $row["m"]);
$stmt2->bindParam(":l2",  $row["l2"]);
$stmt2->bindParam(":l1",  $row["l1"]);
$stmt2->bindParam(":l",  $row["l"]);
$stmt2->bindParam(":h7",  $row["h7"]);
$stmt2->bindParam(":h6",  $row["h6"]);
$stmt2->bindParam(":h5",  $row["h5"]);
$stmt2->bindParam(":h4",  $row["h4"]);
$stmt2->bindParam(":h3",  $row["h3"]);
$stmt2->bindParam(":n2",  $row["n2"]);
$stmt2->bindParam(":j",  $row["j"]);
$stmt2->bindParam(":b1",  $row["b1"]);
$stmt2->bindParam(":b",  $row["b"]);
$stmt2->bindParam(":a1",  $row["a1"]);
$stmt2->bindParam(":a",  $row["a"]);
$stmt2->bindParam(":n1",  $row["n1"]);
$stmt2->bindParam(":d1",  $row["d1"]);
$stmt2->bindParam(":d",  $row["d"]);
$stmt2->bindParam(":g_l5",  $row["g_l5"]);
$stmt2->bindParam(":g_b2",  $row["g_b2"]);
$stmt2->bindParam(":g_h",  $row["g_h"]);
$stmt2->bindParam(":g_h1",  $row["g_h1"]);
$stmt2->bindParam(":g_h2",  $row["g_h2"]);
$stmt2->bindParam(":g_l8",  $row["g_l8"]);
$stmt2->bindParam(":g_l9",  $row["g_l9"]);
$stmt2->bindParam(":g_l7",  $row["g_l7"]);
$stmt2->bindParam(":flange",  $row["flange"]);
$stmt2->bindParam(":wheel_standart",  $row["wheel_standart"]);
$stmt2->bindParam(":wheel_order",  $row["wheel_order"]);
$stmt2->bindParam(":pole",  $row["pole"]);
$stmt2->bindParam(":execution",  $row["execution"]);
$stmt2->bindParam(":step_y",  $row["step_y"]);
$stmt2->bindParam(":step_x",  $row["step_x"]);
        
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
     $this->table_name.id,  $this->table_name.name, $this->table_name.phase, $this->table_name.efficiency, $this->table_name.voltage
     FROM " . $this->table_name;

    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // выполняем запрос
    $stmt->execute();
    
    return $stmt;
}






}