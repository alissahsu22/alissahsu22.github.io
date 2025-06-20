<?php
$path = getcwd() . '/databases';

$room = $_POST['room'];
$username = $_POST['username']; 
$message = $_POST['message'];
$time = $_POST['time'];


$db = new SQLite3($path.'/messages.db');

if ($room && $username && $message) {
    $sql = "INSERT INTO $room (username, message) VALUES (:username, :message)";
    $statement = $db->prepare($sql);
    $statement->bindParam(':username', $username);
    $statement->bindParam(':message', $message);
    $result = $statement->execute();
    $id = $db->lastInsertRowID();

    // create another table w time stamps + room numbers 
    $sql = "INSERT INTO allRooms (username, message, time, room) VALUES (:username, :message, :time, :room)";
    $statement = $db->prepare($sql);
    $statement->bindParam(':username', $username);
    $statement->bindParam(':message', $message);
    $statement->bindParam(':time', $time);
    $statement->bindParam(':room', $room);
    $result = $statement->execute();
    $id = $db->lastInsertRowID();

    $db->close();

} else {
    print ("ERROR");
}

exit();
?>
