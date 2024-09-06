<?php
  $room = $_GET['room'];


  $path = getcwd() . '/databases';
  $db = new SQLite3($path.'/messages.db');
  $sql = "SELECT * FROM $room";
  $statement = $db->prepare($sql);
  $result = $statement->execute();
  $send_back = array();

  while ($row = $result->fetchArray()) {
    $record = array();
    $record['id'] = $row['id'];
    $record['username'] = $row['username'];
    $record['message'] = $row['message'];
    array_push($send_back, $record);
  }

  

  $db->close();
  unset($db);
  print json_encode($send_back);
  exit();

 ?>




