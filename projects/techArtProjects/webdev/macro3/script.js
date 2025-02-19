const pokemonList = [ 'pikachu', 'bulbasaur','charmander','eevee','squirtle'];
const pokeballsLeft = document.querySelector('#pokeballsLeft');
const pokemonCaught = document.querySelector('#pokemonCaught');
const phrase = document.querySelector('#phrase');
const resetBtn = document.getElementById("resetBtn");
const gameRestartBtn = document.getElementById("gameReset");
const historyDiv = document.getElementById("history");
const pokedexDiv = document.getElementById('pokedex');


function randomAssign(){
    let choices = [1,2,3]
    let randArr = [];

    while (randArr.length < 3){
        let randomIndex = Math.floor(Math.random() * choices.length);
        randArr.push(choices.splice(randomIndex, 1)[0]) // removes from choices and returns the removed number  
    }
    return randArr;
}

var random;
var Gpokemon;
var Gpokemon_grass; 
var Gball;
var Gball_grass;
var Gnone;
var Gnone_grass;
var valid = true;
var historyArray =[]; 

var remaining = 5;
pokeballsLeft.innerHTML = `Pokeballs left: ${remaining}`;
var caught = 0;

var pokemonCount = {"pikachu":0,'bulbasaur':0,'charmander':0,'eevee':0,'squirtle':0};
var sum = 0;


function pokedex(){
    for(var count in pokemonCount){
        sum += pokemonCount[count]; 
    }

    for(var count in pokemonCount){
        let percent = 0;
        percent = Math.round( (parseInt(pokemonCount[count]) / sum) * 100);
        if(pokemonCount[count] == 0){percent = 0;}
        pokedexDiv.innerHTML += `<tr><td>${count}</td><td>${pokemonCount[count]}</td><td style="padding-right: 0px;"><div class="bar" style="width: ${percent}px;">&nbsp;</div></td><td>${percent}%</td></tr>`;
    }

    
}

function updateCounts(){
    pokeballsLeft.innerHTML = `Pokeballs left: ${remaining}`;
    pokemonCaught.innerHTML = `Pokemon caught: ${caught}`;
    verfiyRemain();
}

function verfiyRemain(){
    if(remaining <= 0){
        document.getElementById("gameOver").style['opacity'] = '1';
        document.querySelectorAll('.grass').forEach(grass => {grass.onclick = null;});
        resetBtn.onclick = null;
        gameRestartBtn.style.opacity = '1';

        // display history 
        historyDiv.innerHTML += "<h1>History</h2>";
        for(let i = (historyArray.length-1); i >= 0; i--){
            historyDiv.innerHTML += `<p> ${historyArray[i]} </p>` + "<br>";
        }

        pokedex();

    }
    else{
        document.getElementById("gameOver").style['opacity'] = '0';
    }
}

function disableGrassClicks() {
    valid = false; 
    document.querySelectorAll('.grass').forEach(grass => {grass.onclick = null;});
    resetBtn.style['display'] = 'block';
    resetBtn.onclick = restart;
}

function restart(){
    document.querySelectorAll('.grass').forEach(grass => {grass.setAttribute('src', `images/grass.png`);});
    document.querySelectorAll('.grass').forEach(grass => {grass.style['opacity'] = '1';});
    valid = true;

    let randArr = randomAssign();
    gameStart(randArr);
    verfiyRemain();
}

function gameStart(randArr){
//  Assigning 
    for (let i = 0; i < randArr.length; i++) {
        switch (randArr[i]) {
            case 1:
                Gpokemon_grass = document.querySelector(`#grass${i + 1}`);
                Gpokemon = document.querySelector(`#grass${i + 1}_under`);
                random = Math.floor(Math.random() * 4);
                Gpokemon.setAttribute('src', `images/${pokemonList[random]}.png`);
                Gpokemon.style['opacity'] = '0';
                break;
            case 2:
                Gball_grass = document.querySelector(`#grass${i + 1}`);
                Gball = document.querySelector(`#grass${i + 1}_under`);
                Gball.setAttribute('src', `images/pokeballs.png`);
                Gball.style['opacity'] = '0';
                break;
            case 3:
                Gnone_grass = document.querySelector(`#grass${i + 1}`);
                Gnone = document.querySelector(`#grass${i + 1}_under`);
                Gnone.style['opacity'] = '0';
                break;
            default:
                break;
        }
    }

    // for(let i = 1; i <= randArr.length; i++){
    //     if(randArr[i] == 1){
    //             Gpokemon_grass = document.querySelector(`#grass${i}`);
    //             Gpokemon = document.querySelector(`#grass${i}_under`);
    //             random = Math.floor(Math.random() * 4);
    //             Gpokemon.setAttribute('src', `images/${pokemonList[random]}.png`);
    //             Gpokemon.style['opacity'] = '0';
    //     } else if(randArr[i] == 2){
    //             Gball_grass = document.querySelector(`#grass${i}`);
    //             Gball = document.querySelector(`#grass${i}_under`);
    //             Gball.setAttribute('src', `images/pokeballs.png`);
    //             Gball.style['opacity'] = '0';
    //     } else {
    //         Gnone_grass = document.querySelector(`#grass${i}`);
    //         Gnone = document.querySelector(`#grass${i}_under`);
    //         Gnone.style['opacity'] = '0';
    //     }
    // }

    Gpokemon_grass.onclick = function(){
        Gpokemon.style['opacity'] = '1';
        Gpokemon_grass.style['opacity'] = '0';

        Gnone.style['opacity'] = '0';
        Gnone_grass.style['opacity'] = '0.5';
        Gball.style['opacity'] = '1';
        Gball_grass.style['opacity'] = '0.5';

        let words = `You caught a(n) ${pokemonList[random]}!`;
        phrase.innerHTML = words;
        historyArray.push(words);
        pokemonCount[pokemonList[random]] += 1;
        remaining -= 1;
        caught += 1; 
        updateCounts();
        disableGrassClicks();
    }

    Gball_grass.onclick = function(){
        Gball.style['opacity'] = '1';
        Gball_grass.style['opacity'] = '0';

        Gnone.style['opacity'] = '0';
        Gnone_grass.style['opacity'] = '0.5';
        Gpokemon.style['opacity'] = '1';
        Gpokemon_grass.style['opacity'] = '0.5';
        let words = "You found two Pokeballs!";
        phrase.innerHTML = words;
        historyArray.push(words);
        remaining += 2;
        updateCounts();
        disableGrassClicks();
    }

    Gnone_grass.onclick = function(){
        Gnone.style['opacity'] = '0';
        Gnone_grass.style['opacity'] = '0';

        Gball.style['opacity'] = '1';
        Gball_grass.style['opacity'] = '0.5';
        Gpokemon.style['opacity'] = '1';
        Gpokemon_grass.style['opacity'] = '0.5';

        let words = "Nothing here!";
        phrase.innerHTML = words;
        historyArray.push(words);
        remaining -= 1;
        updateCounts();
        disableGrassClicks();
    }
}

function gameReset(){
    // erase history 
    historyDiv.innerHTML = '';

    gameRestartBtn.style.opacity ='0';
    remaining = 5;
    caught = 0; 
    updateCounts();
    restart(); 
}


let randArr = randomAssign();
gameStart(randArr);
