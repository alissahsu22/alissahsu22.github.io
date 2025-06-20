<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Macro 7: Results!</title>
    <link rel = "stylesheet" href = "view.css">
</head>
<body>
    <h1> Which Simpson Character Am I? </h1>

    <div id = "result">
        <?php 
            $path = getcwd() . '/data';
            $data = file_get_contents("$path/answers.txt");
            $lines = explode("\n", $data);

            $a = 0;
            $b = 0;
            $c = 0;
            $d = 0; 

            $items = []; 

            for ($i = 0; $i < sizeof($lines) - 1; $i++) {
                $items[] = explode(",", $lines[$i]);
            }

            // gets last entry of ans 
            for ($i = 0; $i < sizeof($items[sizeof($items) - 1]); $i++) {
                $item = $items[sizeof($items) - 1][$i];

                if ($item == "a") {
                    $a += 1;
                } else if ($item == "b") {
                    $b += 1;
                } else if ($item == "c") {
                    $c += 1;
                } else {
                    $d += 1;
                }
            }


            $prevItems = "" ;

            for ($i = 0; $i < sizeof($items); $i++) {
                $a = 0;
                $b = 0;
                $c = 0;
                $d = 0; 

                for($j = 0; $j < sizeof($items[$i]); $j++){
                    $item = $items[$i][$j];
                    if ($item == "a") {
                        $a += 1;
                    } else if ($item == "b") {
                        $b += 1;
                    } else if ($item == "c") {
                        $c += 1;
                    } else {
                        $d += 1;
                    }
                }

                $prevItems .= "/$a,$b,$c,$d";
            }

            // print "prev: $prevItems";


            $currUserResult;
            $maxCount = max($a, $b, $c, $d);
            $cookieValue = "/$a,$b,$c,$d" ;
            $newCookie = $prevItems . $cookieValue;
            if($maxCount == 0){
                print "<h1> Play to find out! </h1>";
                print "<a href = 'index.php'>Go to Quiz</a>";
            }
            else{
                if ($maxCount == $a) {
                    $currUserResult = 'Bart';
                } elseif ($maxCount == $b) {
                    $currUserResult = 'Lisa';
                } elseif ($maxCount == $c) {
                    $currUserResult = 'Marge';
                } else {
                    $currUserResult = 'Homer';
                }

                print "<h1> You are $currUserResult! </h1>";
                print "<img src = 'images/$currUserResult.png'>";
                print "<br>";
                print "<a href = 'index.php'>Try again?</a>";

                setcookie("prevResults", $newCookie);        
            }
               
        ?> 

</div>

        <a href = "results.php">Aggregate Results </a>

    
</body>
</html>