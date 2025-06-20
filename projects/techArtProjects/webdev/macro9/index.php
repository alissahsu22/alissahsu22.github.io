<!doctype html>
<html>
  <head>
    <title>Macro Assignment 09: Let's Chat!</title>

    <script src="helpers.js"></script>

    <style>
      .entry {
        width: 18%;
        height: 200px;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid black;
        border-radius: 20px;
        padding: 10px;
        float: left;
        word-break: break-all;
        overflow: hidden;
        background-color: #eee;
        margin: 1%;
      }
      .entry img {
        display: block;
        margin: auto;
        width: 50%;
      }
    </style>
  </head>
  <body>

    <h1>Let's Chat!</h1>

    <div>
        <form action="startChat.php" method="GET">
        Select a Username: <input type="text" name="username">
        <input type="submit" value="Search">
        </form>   
    </div>

    <?php 
        if($_GET["error"] == "missing"){
            print "<br>";
            print "Missing Values!";
        }
        
    ?> 

<?php
$path = getcwd() . '/databases';

$db = new SQLite3($path.'/messages.db');

$query = "CREATE TABLE IF NOT EXISTS room1 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            message TEXT
          )";

          

$db->exec($query);

$query = "CREATE TABLE IF NOT EXISTS room2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  message TEXT
)";
$db->exec($query);

$query = "CREATE TABLE IF NOT EXISTS room3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  message TEXT
)";
$db->exec($query);

$query = "CREATE TABLE IF NOT EXISTS allRooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  message TEXT,
  time TEXT,
  room TEXT
)";

$db->exec($query);

$db->close();
unset($db);

// print "rooms created again"; 

?>


  </body>
</html>
