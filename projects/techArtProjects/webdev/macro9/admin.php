<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Page</title>
</head>
<style>
      #back{
        top:5%;
        right: 5%;
       position: absolute;
      }
    </style>
<body>
    <h1>Admin Page</h1>
    <button id="back">Go Back</button>
    <form id="loginForm" action="login.php" method="POST">
        Username: <input type="text" id="username" name="username">
        <br>
        Password: <input type="password" id="password" name="password"><br>
        <button type="submit">Login</button>
    </form>
    <footer>Login/Password = "webdev"</footer>

    <?php 
        if($_GET["error"] == "missing"){
            print "<br>";
            print "Missing values in the form!";
        }
        else if($_GET["error"] == "incorrect"){
            print "<br>";
            print "Incorrect values...try again";
        }
    ?>

    <!-- <?php
        $path = getcwd() . '/databases';
        $db = new SQLite3($path.'/messages.db');
        
        $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
        
        // Iterate over each table and fetch its contents
        while ($table = $tables->fetchArray(SQLITE3_ASSOC)) {
            $tableName = $table['name'];
            echo "<h2>Table: $tableName</h2>";
            echo "<table border='1'>";
            
            // Fetch the contents of the table
            $results = $db->query("SELECT * FROM $tableName");
            
            // Display the contents of the table
            while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
                echo "<tr>";
                foreach ($row as $key => $value) {
                    echo "<td>$key: $value</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        }
        
        // Close the database connection
        $db->close();
        ?> -->


    <script>
        const back = document.getElementById('back');
        back.addEventListener('click', function() {
        window.location.href = 'index.php';
        });
    </script>
</body>
</html>
