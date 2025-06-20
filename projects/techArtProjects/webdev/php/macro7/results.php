<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Macro 7: Result history...</title>
    <link rel = "stylesheet" href = "results.css">
</head>
<body>
    <?php
    // "/Bart:1, Lisa:2, Marge:3, Homer:4/Bart:1, Lisa:2, Marge:3, Homer:1 ;
        $prevResultsCookie = $_COOKIE['prevResults'];

        $string = ltrim($prevResultsCookie, '/');
        $parts = explode("/", $string);
        $prevresultArr = explode(", ", $parts[sizeof($parts)-1]);

        $size = sizeof($parts) -1 ;
        print "<h1>In total there have been $size quiz submissions</h1>";
        print "<br>";

        $numericValues = array_map('intval', explode(',', $prevresultArr[0]));

        $characters = ['Bart', 'Lisa', 'Marge', 'Homer'];
        $colors = [ 'red', 'yellow', 'green', 'blue'];

        print "<table>";

        // how to make bar take up % of browswer 
        for ($i = 0; $i < 4; $i++) {
            $percent = ($numericValues[$i] /  4) * 100;
            $percentpx = $percent . "vw";
        
            $character = $characters[$i];
            $color = $colors[$i];

            print "<tr>";
            print "<td>$character</td>";
            print "<td>$percent%</td>";
            print "<td style='padding-right: 0px;'>";
            print "<div class='bar' style='width: $percentpx; background-color: $color;'>&nbsp;</div>";
            print "</td>";
            print "</tr>";
        }
        print "</table>";

    ?>
    <a href = "view.php">Back to quiz? </a>
    
</body>
</html>

