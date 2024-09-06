<!doctype html>
<html>
  <head>
    <title>Macro Assignment 09: Let's Chat!</title>

    <script src="helpers.js"></script>

    <style>
      h1 {
        margin-left: 5%;
        margin-top: 5%;
        margin-bottom: 5%;
        font-size: 40px;
      }

      #previous {
        margin-left: 5%;
        margin-right: 5%;
        border: 1px solid black;
        overflow-y: scroll; /* Enable vertical scrollbar */
        height: 400px; /* Set fixed height */
        padding: 10px; /* Add padding */
      }

      .entry {
        padding: 10px;
      }

      .message {
        margin-top: 5%;
        margin-left: 5%;
        display:flex;
        flex-direction: row; 
        align-items:center;
        gap: 10px;
      }

      #message{
        height: 20px;
        width: 30%;
      }

      .error {
        margin-top: 5%;
        margin-left: 5%;
        color: red;
      }

      body {
        margin-bottom: 5%;
      }

      .roomSelect{
        margin-left: 5%;
        margin-bottom: 2%;
      }

      #login{
        top:5%;
        right: 5%;
       position: absolute;
      }
     
  
    </style>
  </head>
  <body>

    <h1>Let's Chat!</h1>

    <button id="login">Login</button>

    <?php 
        if(isset($_GET['username']) && !empty($_GET['username'])) {
          $username = $_GET['username'];
      } else {
        header("Location: index.php?error=missing");
        exit();
      }

      ?>

      <div class = "roomSelect">
      Select a Room:
      <select id="roomSelect">
        <option value="room1">Room 1</option>
        <option value="room2">Room 2</option>
        <option value="room3">Room 3</option>
      </select>
    </div>

    <div id="previous"></div>

    <div class="message">
      Message
      <textarea id="message" maxlength="50"></textarea> 
      <button id="save">Save Message</button>
    </div>

    
    <script>
    const message = document.getElementById('message');
    const saveButton = document.getElementById('save');
    const previous = document.getElementById('previous');
    const roomSelect = document.getElementById('roomSelect');
    const login = document.getElementById('login');


    window.addEventListener("load", (event) => {
      getExistingEntries();
    });

    

    roomSelect.addEventListener('change', function() {
      previous.innerHTML = '';
      getExistingEntries();
    });

    function getExistingEntries() {
      const selectedRoom = roomSelect.value;

      performFetch({
        method: 'GET',
        url: `getentries.php`,
        data: {
          room: selectedRoom
        },
        success: function(data, status) {
          console.log("Success, got the data from the server");

          let arrayData = JSON.parse(data);

          for (let i = 0; i < arrayData.length; i++) {
            if (!document.getElementById(arrayData[i]['id'])) {
              createEntry(arrayData[i]['id'], arrayData[i]['username'], arrayData[i]['message']);
            }
          }

          previous.scrollTop = previous.scrollHeight;
          setTimeout(getExistingEntries, 2000);
        },
        error: function(req, data, status) {
          console.log("Error, couldn't get file");
          setTimeout(getExistingEntries, 2000);
        }
      });
    }

    function createEntry(id, username, msg) {
      let tempDiv = document.createElement('div');
      tempDiv.id = id;
      tempDiv.classList.add('entry');

      let tempP = document.createElement('p');
      tempP.innerHTML = `${username}: ${msg}`;
      tempDiv.appendChild(tempP);

      if (previous.children.length == 0) {
        previous.appendChild(tempDiv);
      } else {
        previous.appendChild(tempDiv);
        previous.scrollTop = previous.scrollHeight;
      }
    }

    saveButton.onclick = function(event) {
      let messageText = message.value.trim();
      message.value = ""; 

      if (messageText.length < 1) {
        let tempDiv = document.createElement('div');
        tempDiv.classList.add('error');

        let tempP = document.createElement('p');
        tempP.innerHTML = "Error: Message must be at least 1 character long.";
        tempDiv.appendChild(tempP);

        let body = document.querySelector('body');
        body.appendChild(tempDiv);
        return;
      } else {

        let error = document.querySelector('.error');
        if (error) {
          error.remove();
        }
      }

      let username = "<?php echo isset($_GET['username']) ? $_GET['username'] : ''; ?>";
      let time =  new Date().toLocaleString();
      performFetch({
        method: 'POST',
        url: 'saveentry.php',
        data: {
          message: messageText,
          username: username,
          room: roomSelect.value,
          time: time,
        },
        success: function(data, status) {
          console.log("Success! Received this data from the server: ", data);
          // createEntry(data, username, messageText);
        },
        error: function(req, data, status) {
          console.log("Error!");
        }
      });
    }

    login.addEventListener('click', function() {
      window.location.href = 'admin.php';
    });
  </script>


  </body>
</html>
