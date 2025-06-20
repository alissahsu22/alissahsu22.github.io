<!doctype html>
<html lang="en-us">
  <head>
    <title>Micro 06</title>
  </head>
  <body>
    
    <form action="micro06_process.php" method="POST">
      Username: <input type="text" name="username"><br>
      Password: <input type="text" name="password"><br>
      <button id = "login">Login</button><br>

      <?php
        if($_GET['login'] == 'failed'){?>
            <div>Login Failed!</div>
        <?php
            if($_GET['user'] == 'failed'){?>
                <div>- - Username missing- -</div>
        <?php
            }
            if($_GET['pass'] == 'failed'){?>
                <div>- - Password missing- -</div>
        <?php
            }
        }
        if($_COOKIE['loggedin'] == 'yes'){?>
        <div id = "secret">
            Welcome!
        </div>

        <?php 
        }
    ?>
    </form>    
  </body>
</html>