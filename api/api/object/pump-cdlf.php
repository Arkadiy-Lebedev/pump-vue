<?php


class Pump
{
    // подключение к базе данных и таблице "products"
    private $conn;
    private $table_name = "pumps_cdlf";

    // свойства объекта
    public $id;
    public $name;
    public $coordinates;
    public $typeid;

    public $b1;
    public $b2;
    public $b12;
    public $d1;
    public $d2;
    public $weight;
    public $power;
    public $engineMount;
    public $diffuser;
    public $innerBody;
    public $housingSupport;
    public $coupling;
    public $wheel;
    public $outerCasing;
    public $shaft;
    public $pipe;  
    public $lid;
    public $base;    
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



    // конструктор для соединения с базой данных
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
{
    // выбираем все записи
    $query = "SELECT
     c.type, 
      p.id, p.name, p.coordinates, 
           
p.b1,
p.b2,
p.b12,   
p.d1,   
p.d2,   
p.weight,
p.power,
p.engineMount,
p.diffuser,  
p.innerBody,  
p.housingSupport, 
p.coupling, 
p.wheel, 
p.outerCasing, 
p.shaft, 
p.pipe, 
p.lid, 
p.base, 
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x,
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

            b1=:b1,
            b2=:b2,
            b12=:b12,
            d1=:d1,
            d2=:d2,
            weight=:weight, 
            power=:power,
            engineMount=:engineMount,
            diffuser=:diffuser,
            innerBody=:innerBody,
            housingSupport=:housingSupport,
            coupling=:coupling,            
            wheel=:wheel,
            outerCasing=:outerCasing,
            shaft=:shaft,
            pipe=:pipe,
            lid=:lid,
            base=:base,
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
    $stmt = $this->conn->prepare($query);

    
    // привязка значений
   $stmt->bindParam(":name", $this->name);  
    $stmt->bindParam(":coordinates", $this->coordinates); 
    $stmt->bindParam(":typeid", $this->typeid);  

    $stmt->bindParam(":b1", $this->b1);
    $stmt->bindParam(":b2", $this->b2);
    $stmt->bindParam(":b12", $this->b12);
    $stmt->bindParam(":d1", $this->d1);
    $stmt->bindParam(":d2", $this->d2);
    $stmt->bindParam(":weight", $this->weight);
    $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":engineMount", $this->engineMount);
    $stmt->bindParam(":diffuser", $this->diffuser);
    $stmt->bindParam(":innerBody", $this->innerBody);
    $stmt->bindParam(":housingSupport", $this->housingSupport);
    $stmt->bindParam(":coupling", $this->coupling);
    $stmt->bindParam(":wheel", $this->wheel);
    $stmt->bindParam(":outerCasing", $this->outerCasing);
    $stmt->bindParam(":shaft", $this->shaft);
    $stmt->bindParam(":pipe", $this->pipe);
    $stmt->bindParam(":lid", $this->lid);
    $stmt->bindParam(":base", $this->base);
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
            c.type, 
            p.id, p.name, p.coordinates, 
           
p.b1,
p.b2,
p.b12,   
p.d1,   
p.d2,   
p.weight,
p.power,
p.engineMount,
p.diffuser,  
p.innerBody,  
p.housingSupport, 
p.coupling, 
p.wheel, 
p.outerCasing, 
p.shaft, 
p.pipe, 
p.lid, 
p.base, 
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x
           
       
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

            b1=:b1,
            b2=:b2,
            b12=:b12,
            d1=:d1,
            d2=:d2,
            weight=:weight, 
            power=:power,
            engineMount=:engineMount,
            diffuser=:diffuser,
            innerBody=:innerBody,
            housingSupport=:housingSupport,
            coupling=:coupling,            
            wheel=:wheel,
            outerCasing=:outerCasing,
            shaft=:shaft,
            pipe=:pipe,
            lid=:lid,
            base=:base,
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
              date_update=NOW() WHERE
            id = :id"
            ;


    // подготовка запроса
    $stmt = $this->conn->prepare($query);


    // привязка значений
    $stmt->bindParam(":id", $this->id);  
   $stmt->bindParam(":name", $this->name);  
    $stmt->bindParam(":coordinates", $this->coordinates); 
    $stmt->bindParam(":typeid", $this->typeid);  

    $stmt->bindParam(":b1", $this->b1);
    $stmt->bindParam(":b2", $this->b2);
    $stmt->bindParam(":b12", $this->b12);
    $stmt->bindParam(":d1", $this->d1);
    $stmt->bindParam(":d2", $this->d2);
    $stmt->bindParam(":weight", $this->weight);
    $stmt->bindParam(":power", $this->power);
    $stmt->bindParam(":engineMount", $this->engineMount);
    $stmt->bindParam(":diffuser", $this->diffuser);
    $stmt->bindParam(":innerBody", $this->innerBody);
    $stmt->bindParam(":housingSupport", $this->housingSupport);
    $stmt->bindParam(":coupling", $this->coupling);
    $stmt->bindParam(":wheel", $this->wheel);
    $stmt->bindParam(":outerCasing", $this->outerCasing);
    $stmt->bindParam(":shaft", $this->shaft);
    $stmt->bindParam(":pipe", $this->pipe);
    $stmt->bindParam(":lid", $this->lid);
    $stmt->bindParam(":base", $this->base);
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
p.name, 
p.types_id,
p.coordinates,           
p.b1,
p.b2,
p.b12,   
p.d1,   
p.d2,   
p.weight,
p.power,
p.engineMount,
p.diffuser,  
p.innerBody,  
p.housingSupport, 
p.coupling, 
p.wheel, 
p.outerCasing, 
p.shaft, 
p.pipe, 
p.lid, 
p.base, 
p.note,
p.error,
 p.formuls, p.start, p.finish, p.step, p.minx, p.maxx, p.maxy, p.miny,
 p.step_y, p.step_x
      FROM " . $this->table_name . " p WHERE
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
            b1=:b1,
            b2=:b2,
            b12=:b12,
            d1=:d1,
            d2=:d2,
            weight=:weight, 
            power=:power,
            engineMount=:engineMount,
            diffuser=:diffuser,
            innerBody=:innerBody,
            housingSupport=:housingSupport,
            coupling=:coupling,            
            wheel=:wheel,
            outerCasing=:outerCasing,
            shaft=:shaft,
            pipe=:pipe,
            lid=:lid,
            base=:base,
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
    $stmt2->bindParam(":b1", $row["b1"]); 
    $stmt2->bindParam(":b2", $row["b2"]); 
    $stmt2->bindParam(":b12", $row["b12"]); 
    $stmt2->bindParam(":d1", $row["d1"]); 
    $stmt2->bindParam(":d2", $row["d2"]); 
    $stmt2->bindParam(":weight", $row["weight"]); 
    $stmt2->bindParam(":power", $row["power"]); 
    $stmt2->bindParam(":engineMount", $row["engineMount"]); 
    $stmt2->bindParam(":diffuser", $row["diffuser"]); 
    $stmt2->bindParam(":innerBody", $row["innerBody"]); 
    $stmt2->bindParam(":housingSupport", $row["housingSupport"]);
    $stmt2->bindParam(":coupling", $row["coupling"]);
    $stmt2->bindParam(":wheel", $row["wheel"]);
    $stmt2->bindParam(":outerCasing", $row["outerCasing"]);
    $stmt2->bindParam(":shaft", $row["shaft"]);
    $stmt2->bindParam(":pipe", $row["pipe"]);
    $stmt2->bindParam(":lid", $row["lid"]);
    $stmt2->bindParam(":base", $row["base"]);    
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