<?php
    include('config.php');

    $id = $_GET['id']; 

    $db = new SQLite3($path.'/MyMovies.db');
    $sql = "DELETE FROM movies WHERE id = $id";
    $statement = $db->prepare($sql);

    $result = $statement->execute();

    $db->close();
    unset($db);

    header("Location: index.php");
    exit();
?>