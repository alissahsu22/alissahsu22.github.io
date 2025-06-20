while(true){
    let numPrompt = prompt("Provide a positive number greater than or equal to 3:");
    var num = parseInt(numPrompt);
    if(num >= 3){
        break;
    }
    else{
        continue;
    }
};

const words = ['Awesome', 'Fantastic', 'Fabulous', 'Superb', 'Perfect', 'Brilliant', 'Coming up Roses'];
let randIndex = parseInt(Math.random() * (words.length));
let randWord= String(words[randIndex]);
document.querySelector('#title').innerHTML = `Everything is ${randWord}`;

var hour = new Date().getHours();
var minute = new Date().getMinutes();
var time;
var backgroundTime;

if(minute < 10){
    minute = '0' + minute;
}

if(0 <= hour && hour <= 5){
    backgroundTime = "night";
    if(hour == 0){
        time = `${hour+12}:${minute}am - Good Night!`;
    }
    else{
        time = `${hour}:${minute}am - Good Night!`;
    }
    
}
else if(6 <= hour && hour <= 11){
    backgroundTime = "morning";
    time = `${hour}:${minute}am - Good Morning!`;}

else if(12 <= hour && hour <= 17){
    backgroundTime = "afternoon";
    if(hour == 12){
        time = `${hour}:${minute}pm - Good Afternoon!`
    }
    else{
        time = `${hour-12}:${minute}pm - Good Afternoon!`;
    }  
}
else{
    backgroundTime = "evening";
    time = `${hour-12}:${minute}pm - Good Evening!`;
}

document.querySelector('#time').innerHTML = `The time is currently ${time}`;
document.write(`<img id = "background" src = "images/backgrounds/${backgroundTime}.png"></img>`)


let luckyNum = parseInt(Math.random() * (num));
var luckyList = [];

while( luckyList.length < 3){
    let luckyNum = parseInt(Math.random() * (num));
    if(luckyList.includes(luckyNum)){
        continue;
    }
    else{
        luckyList += [luckyNum];
    }
}

document.querySelector('#message').innerHTML = `Your three lucky numbers today are ${luckyList[0]}, ${luckyList[1]}, and ${luckyList[2]}`;

const heads = ['head1','head2','head3','head4','head5','head6'];
let randIndex2 = parseInt(Math.random() * (heads.length));
let randHead= String(heads[randIndex2]);

const bodies = ['body1','body2','body3','body4','body5','body6']
let randIndex3 = parseInt(Math.random() * (bodies.length));
let randBody= String(bodies[randIndex3]);

document.write(`<div class = "container">
 <img id = "head" src = "images/heads/${randHead}.png"></img>
<img id = "bodies" src = "images/bodies/${randBody}.png"></img>
</div>`);