<?php
        $adminUser = 'webdev';
        $adminPass = 'webdev';

        $username = $_POST['username'];
        $password = $_POST['password'];

        if(empty($username) || empty($password)) {
            header('Location: admin.php?error=missing');
            exit();
        }

        if ($username != $adminUser && $password != $adminPass) {
            header('Location: admin.php?error=incorrect');
            exit();
        } 
    ?>
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
     
      #usageLogs,#clearChatForm{
        margin: 5%;
      }
  
    </style>
<body>
    <h1>Admin Page</h1>
    <button id="back">Go Back</button>


    <div id="usageLogs">
    <?php
        $path = getcwd() . '/databases';
        $db = new SQLite3($path.'/messages.db');

        $results = $db->query("SELECT * FROM allRooms ORDER BY time DESC");

        echo "<h2>Usage Log</h2>";
        echo "<table border='1'>";
        while ($row = $results->fetchArray()) {
            echo "<tr>";
            echo "<td>Id: <span>{$row['id']}</span> Time: <span>{$row['time']}</span> Room Number: <span>{$row['room']}</span> Username: <span>{$row['username']}</span> Message: <span>{$row['message']}</span></td>";
            echo "</tr>";
        }
        echo "</table>";

        $db->close();
        ?>

    </div>

    <form id="clearChatForm" action="deleteChat.php" method="GET">
        <label for="room">Select Room to clear:</label>
        <select id="room" name="room">
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
            <option value="room3">Room 3</option>
        </select>
        <button type="submit">Clear Chat Room</button>
    </form>

    <div id = "log"></div>

    <script>
        const back = document.getElementById('back');
        back.addEventListener('click', function() {
        window.location.href = 'index.php';
        });
    </script>
</body>
</html>
