<?php
    $path = getcwd() . '/data';

    $question1 = $_POST['question1'];
    $question2 = $_POST['question2'];
    $question3 = $_POST['question3'];
    $question4 = $_POST['question4'];

    if ($question1 && $question2 && $question3 && $question4){
       include('config.php');

        $data = "$question1,$question2,$question3,$question4\n";

        file_put_contents("$path/answers.txt", $data, FILE_APPEND);

        header("Location: view.php");
        exit();
    } else{
        header("Location: index.php?error=missing");
        exit();
    }
?>