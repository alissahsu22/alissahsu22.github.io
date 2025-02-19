<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Macro 7: Server-side Quizzing System</title>
    <link rel = "stylesheet" href = "index.css">
</head>
<body>
    <h1> Which Simpson Character Am I? </h1>

    <form id = "form" action="save.php" method="POST">
        What is your ideal job? 
        <br>
        <select name="question1">
        <option value="" selected disabled hidden>Select a job</option>
            <option value="a">Working at a bakery</option>
            <option value="b">French tutor</option>
            <option value="c">Prank phone call specialist</option>
            <option value="d">College professor</option>
        </select>
        <br>

        What is your favorite food? 
        <br>
        <select name="question2">
        <option value="" selected disabled hidden>Select a food</option>
            <option value="a">Donuts</option>
            <option value="b">Apple pie</option>
            <option value="c">Krusty Flakes</option>
            <option value="d">Anything organic and locally sources</option>
        </select>
        <br>

        What is your favorite hobby? 
        <br>
        <select name="question3">
        <option value="" selected disabled hidden>Select a hobby</option>
            <option value="a">Watching TV</option>
            <option value="b">Knitting</option>
            <option value="c">Skateboarding</option>
            <option value="d">Reading</option>
        </select>
        <br>

        What is your biggest fear? 
        <br>
        <select name="question4">
            <option value="" selected disabled hidden>Select a fear</option>
            <option value="a">Sock puppets</option>
            <option value="b">Flying</option>
            <option value="c">I'm fearless, man</option>
            <option value="d">Getting anythign below an A in school</option>
        </select>
        <br>
        <input name="submit" type="submit" value="What Simpson Character am I?">
    </form>

    <a href = "results.php">Aggregate Results </a>

    <?php 
        if($_GET["error"] == "missing"){
            print "<br>";
            print "Missing values in the form!";
        }
    ?>
</body>
</html>