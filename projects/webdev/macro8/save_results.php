<?php
    $title = $_POST['title'];
    $year = $_POST['year'];

    if ($title && $year ) {
        //  && is_string($title) && is_int($year)
       include('config.php');
       $sql = "INSERT INTO movies (title, year) VALUES (:title, :year)";
        $statement = $db->prepare($sql);
        $statement->bindParam(':title', $title);
        $statement->bindParam(':year', $year);
        $statement->execute();
        $id = $db->lastInsertRowID();
        $db->close();
        unset($db);
        header("Location: add_form.php?error=none");
        exit();
    } else{
        header("Location: add_form.php?error=missing");
        exit();
    }
?>