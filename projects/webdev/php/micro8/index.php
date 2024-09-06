<!doctype html>
<html>
  <head>
    <title>Micro 08</title>
    <style>
      .box {
        width: 25px;
        height: 25px;
        border: 1px solid black;
        float: left;
      }
      .yellow {
        background-color: yellow;
      }
      .green {
        background-color: green;
      }
      .blue {
        background-color: blue;
      }
      .orange {
        background-color: orange;
      }
      .red {
        background-color: red;
      }
      .pink {
        background-color: pink;
      }
    </style>
  </head>

  <body>
    <h1>Micro 08</h1>

    Pick a box color:
    <select id="colordropdown">
      <option value="yellow">Yellow</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
      <option value="orange">Orange</option>
      <option value="red">Red</option>
      <option value="pink">Pink</option>
    </select>
    <button id="add">Add a new box</button>

    <div id="boxes"></div>

    <!-- the fetch convenience function -->
    <script src="fetch_convenience_function.js"></script>

    <!-- your custom code -->
    <script>
      // DOM references to our HTML elements
      let btn = document.getElementById('add');
      let boxes = document.getElementById('boxes');
      let color = document.getElementById('colordropdown');

      btn.addEventListener('click', function(){
        let selectedColor = color.value;

        performFetch({
            url: 'savebox.php',
            method: 'post', 
            data: {
                color: selectedColor
            },
            success: function(data) {
                console.log("success POST:", data);
                processColor(data,selectedColor);
            },
            error: function(error) {
                console.log("error POST:", error);
            }
        });
    })

    function processColor(data,selectedColor) {
      console.log("color processing..."); 
        let newBox = document.createElement('div');
        newBox.classList.add('box');
        newBox.classList.add(selectedColor);
        newBox.style.backgroundColor = selectedColor;
        boxes.appendChild(newBox);
  }

      // Task #1 -  when the page loads you should initiate
      // a 'fetch' request to load the 'load_boxes.php' file --
      // this file will query a database and will obtain the
      // previously added boxes.
      performFetch({
        url: 'get_boxes.php',
        method: 'get',
        data: {
            boxId: 'id',
            color: 'color'
        },
        success: function(data) {
            // console.log("success GET:", data);
            const jsonData = JSON.parse(data);
            // console.log(jsonData);
            processData(jsonData);
        },
        error: function(error) {
            console.log("error GET:", error);
        }
    });

  function processData(data) {
    console.log("data processing..."); 
    data.forEach(function(box) {
      let newBox = document.createElement('div');
      newBox.classList.add('box');
      newBox.style.backgroundColor = box.color;
      newBox.classList.add(box.color);
      newBox.setAttribute("id",box.id);
      boxes.appendChild(newBox);
    });

  }
      //
      // The PHP file has been written for you, but you should read through
      // it as it represents a very common pattern for web development
      // (using a small file to obtain specific data for a piece of an application)
      // Note that the file uses a techique called JSON (JavaScript
      // Object Notation) which will allow the PHP file to send over a fully
      // populated Array that can be used right here in JavaScript!
      //
      // Once this information has been loaded you should create
      // divs for each one of these boxes and add them to the page. Each div
      // should be given a class of 'box', and a color class based on its color property.
      // This will have the effect of making the page "sticky" and
      // all boxes will exist forever, as long as they are represented
      // in the database.  The data itself is in a JSON format -- to
      // turn it into a JavaScript array simply use the "JSON.parse" function
      // For example:
      //
      //  success: function(data) {
      //      console.log("Success!");
      //      const jsonData = JSON.parse(data);
      //      console.log(jsonData);
      //  }
      //
      // note that the end result will be an array of objects


      // Task #2 - when the button is pressed initiate
      // a 'fetch' request to 'savebox.php' - send it
      // the current value of the drop down list and it
      // will save a record for you in the 'boxes.db'
      // database on the server.
      //
      // Ensure that you've set up the file path in
      // 'config.php' to make this work.
      //
      // If the server returns a successful message then
      // you should create a new div on the page with the
      // class of 'box' and another class of whatever color
      // the user selected and add it to the 'boxes' div.



    </script>

  </body>

</html>
