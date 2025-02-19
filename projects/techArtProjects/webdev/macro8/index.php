<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Macro Assignment 08: Database-driven Website</title>
    <link rel = "stylesheet" href = "styles/index.css">
</head>
<body>
<h1>My Movie Database</h1>
    <div id = "container">
        <a class = "selected" href = "index.php">View All</a>
        <a href = "add_form.php">Add Movie</a>
        <a href = "search_form.php">Search Movies</a>
    </div>

<table style="width:100%">
  <tr>
    <td>Title</td>
    <td>Year</td>
    <td>Options</td>
  </tr>
  <?php 
    include('config.php');
    $db = new SQLite3($path.'/MyMovies.db');

    $tableName = "movies"; 

    $sql = "SELECT * FROM movies";
    $statement = $db->prepare($sql);
    $result = $statement->execute();

    while ($row = $result->fetchArray()) {
        $id = $row[0];
        $title = $row[1];
        $year = $row[2];

        print "<tr>";
        print "<td>$title</td>";
        print  "<td>$year</td>";
        print  "<td><a class = 'deletebtn' href = 'remove_entry.php?id=$id'>delete</a> </td>";
        print "</tr>";
    }
?>
</table>
    
    
</body>
</html>

