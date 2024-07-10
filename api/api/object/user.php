<?php

class User
{
    // Подключение к БД таблице "users"
    private $conn;
    private $table_name = "users";

    // Свойства
    public $id;
    public $login;
    public $password;
    public $role;
    public $name; 

    // Конструктор класса User
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Метод для создания нового пользователя
    function create()
    {

        // Запрос для добавления нового пользователя в БД
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    login = :login,
                    role = :role,
                    name = :name,
                    password = :password";

        // Подготовка запроса
        $stmt = $this->conn->prepare($query);

        // Инъекция
        // $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        // $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        // $this->email = htmlspecialchars(strip_tags($this->email));
        // $this->password = htmlspecialchars(strip_tags($this->password));

        // Привязываем значения
        $stmt->bindParam(":login", $this->login);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":name", $this->name);
    $stmt->bindParam(":role", $this->role);
        // Для защиты пароля
        // Хешируем пароль перед сохранением в базу данных
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
        $stmt->bindParam(":password", $password_hash);

        // Выполняем запрос
        // Если выполнение успешно, то информация о пользователе будет сохранена в базе данных
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

   // Проверка, существует ли электронная почта в нашей базе данных
function loginExists() {
 
    // Запрос, чтобы проверить, существует ли электронная почта
    $query = "SELECT id, login, password, role, name
            FROM " . $this->table_name . "
            WHERE login = ?
            LIMIT 0,1";
 
    // Подготовка запроса
    $stmt = $this->conn->prepare($query);
 
    // Инъекция
    // $this->login=htmlspecialchars(strip_tags($this->login));
 
    // Привязываем значение e-mail
    $stmt->bindParam(1, $this->login);
 
    // Выполняем запрос
    $stmt->execute();
 
    // Получаем количество строк
    $num = $stmt->rowCount();
 
      
    // Если электронная почта существует,
    // Присвоим значения свойствам объекта для легкого доступа и использования для php сессий
    if ($num > 0) {
 
        // Получаем значения
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
 
        // Присвоим значения свойствам объекта
        $this->id = $row["id"];
        $this->login = $row["login"];
        $this->role = $row["role"];
        $this->name = $row["name"];
        $this->password = $row["password"];

        // Вернём "true", потому что в базе данных существует электронная почта
        return true;
    }
 
    // Вернём "false", если адрес электронной почты не существует в базе данных
    return false;
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

// метод для удаления 
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

function passVerification() {
 
    // Запрос, чтобы проверить, существует ли электронная почта
    $query = "SELECT id, login, password, role, name
            FROM " . $this->table_name . "
            WHERE password = ?
            LIMIT 0,1";
 
    // Подготовка запроса
    $stmt = $this->conn->prepare($query);
 
 
 
    // Привязываем значение e-mail
    $stmt->bindParam(1, $this->password);
 
    // Выполняем запрос
    $stmt->execute();
 
    // Получаем количество строк
    $num = $stmt->rowCount();
 
      
    // Если электронная почта существует,
    // Присвоим значения свойствам объекта для легкого доступа и использования для php сессий
    if ($num > 0) {
 
        // Получаем значения
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
 
        // Присвоим значения свойствам объекта
        $this->id = $row["id"];
        $this->login = $row["login"];
        $this->role = $row["role"];
        $this->name = $row["name"];
        $this->password = $row["password"];

        // Вернём "true", потому что в базе данных существует электронная почта
        return true;
    }
 
    // Вернём "false", если адрес электронной почты не существует в базе данных
    return false;
}

}