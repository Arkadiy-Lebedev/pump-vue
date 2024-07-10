<?php


class Type
{
    // подключение к базе данных и таблице "products"
    private $conn;
    private $table_name = "types";

    // свойства объекта
    public $id;
    public $image;
    public $type;
  
    // конструктор для соединения с базой данных
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function read()
{
    // выбираем все записи
    $query = "SELECT * FROM $this->table_name";

    // подготовка запроса
    $stmt = $this->conn->prepare($query);

    // выполняем запрос
    $stmt->execute();
    
    return $stmt;
}

function create()
{
    // запрос для вставки (создания) записей
    $query = "INSERT INTO
            " . $this->table_name . "
        SET
            type=:type, image=:image"
            
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
    $stmt->bindParam(":type", $this->type);
    $stmt->bindParam(":image", $this->image);
    
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

function update()
{
    // запрос для вставки (создания) записей
    $query = "UPDATE
            " . $this->table_name . "
        SET
            type=:type, image=:image WHERE
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
    $stmt->bindParam(":type", $this->type);
    $stmt->bindParam(":image", $this->image);
    $stmt->bindParam(":id", $this->id);
    
    // выполняем запрос
    if ($stmt->execute()) {
        return true;
    }
    return false;
}


}