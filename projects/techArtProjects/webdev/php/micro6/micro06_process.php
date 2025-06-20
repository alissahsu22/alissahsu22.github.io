<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    $username = $_POST['username'];
    $password = $_POST['password'];

    if($username == 'pikachu' && $password == 'pokemon'){
        setCookie('loggedin', 'yes');
        header('Location: micro06.php');
        exit();
    }

    else{
        if(!$username && !$password){
            header('Location: micro06.php?login=failed&user=failed&pass=failed');
        }
        else if(!$username){
            header('Location: micro06.php?login=failed&user=failed');
        }
        else if(!$password){
            header('Location: micro06.php?login=failed&pass=failed');
        }
        else{
            header('Location: micro06.php?login=failed');
        }
        exit();
    }


?>