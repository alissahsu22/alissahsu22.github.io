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
        <a href = "index.php">View All</a>
        <a href = "add_form.php">Add Movie</a>
        <a class = "selected" href = "search_form.php">Search Movies</a>
    </div>
    <form action="search_form.php" method="GET">
      Title: <input type="text" name="title">
      Year: <input type="text" name="year">
      <input type="submit" value="Search">
    </form>   

    <?php 
    include('config.php');
    $db = new SQLite3($path.'/MyMovies.db');

    $searchTitle = $_GET['title'];
    $searchYear = $_GET['year'];
    
    $sql = "SELECT * FROM movies";
    $statement = $db->prepare($sql);
    $result = $statement->execute();

    while ($row = $result->fetchArray()) {
        $id = $row[0];
        $title = $row[1];
        $year = $row[2];

    if ( ( strpos(strtolower($searchYear), strtolower($year)) !== false) || 
    ( strpos(strtolower($year), strtolower($searchYear) ) !== false) || 
     ( strpos(strtolower($title), strtolower($searchTitle)) !== false) ||  
     ( strpos(strtolower($searchTitle), strtolower($title)) !== false)){
            print "* $title ($year)";
            print "<br>";
    }
    }

?>

    
</body>
</html>