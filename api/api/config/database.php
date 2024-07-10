
<?php

class Database
{
    // укажите свои учетные данные базы данных
    private $host = "localhost";
    private $db_name = "pumps";
    private $username = "root";
    private $password = "root";

    // private $host = "localhost";
    // private $db_name = "bepluvl2_pump";
    // private $username = "bepluvl2_pump";
    // private $password = "Arkad0011220!";
    
    public $conn;

    // получаем соединение с БД
    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Ошибка подключения: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
