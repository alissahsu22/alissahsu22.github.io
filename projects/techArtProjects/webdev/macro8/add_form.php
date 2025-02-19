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
        <a class = "selected"  href = "add_form.php">Add Movie</a>
        <a href = "search_form.php">Search Movies</a>
    </div>

    <form action="save_results.php" method="POST">
      Title: <input type="text" name="title">
      Year: <input type="text" name="year">
      <input type="submit" value="Save">
    </form>   

    <?php 
        if($_GET["error"] == "missing"){
            print "<br>";
            print "Missing values in the form!";
        }
        else if($_GET["error"] == "none"){
            print "<br>";
            print "Movie was successfully added!";
        }
    ?>

</body>
</html>