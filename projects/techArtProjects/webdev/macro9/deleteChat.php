<?php
    $room = $_GET['room']; 

    $path = getcwd() . '/databases';
    $db = new SQLite3($path.'/messages.db');

    $sql = "SELECT * FROM $room";
    $statement = $db->prepare($sql);
    $result = $statement->execute();
  
    while ($row = $result->fetchArray()) {
        $id = $row['id'];
        $sql2 = "DELETE FROM $room WHERE id=$id";
        $statement2 = $db->prepare($sql2);
        $result2 = $statement2->execute();
    }
  
    $db->close();
    unset($db);

    header("Location: login.php");
    exit();
?>