document.body.style.backgroundColor = 'black';

let barMaxedOut = false;
const stressBarText = document.getElementById('stressCaption');
stressBarText.style.color = 'white';

const stressBar = document.getElementById('stressBar');
var stressHeight = 0; 

function addStress(stressAdded) {
    if (stressHeight < stressBar.clientHeight) {
        const currStress = document.createElement('div');
        currStress.style.boxSizing = 'border-box';
        currStress.style.width = `${stressBar.clientWidth}px`;
        currStress.style.height = `${stressAdded}px`;
        currStress.style.backgroundColor = 'red';

        stressBar.appendChild(currStress);
        stressHeight += stressAdded;

        if (stressHeight >= stressBar.clientHeight) {
            barMaxedOut = true;
        }

    } else {
        console.log("max reached");
    }
}


const question = document.getElementById('question');
const answer = document.getElementById('answer');
const questionList = [ ['How are you?',10], ['How tired are you?',20]]

const videoContainer = document.getElementById('videosContainer');
videoContainer.style.visibility = 'hidden';

const skipBtn = document.getElementById('skip');
skipBtn.style.visibility = 'hidden';
let skipVideo = false;

skipBtn.addEventListener('click', function () {
    skipVideo = true; 
    insideVideo.pause(); 
    
    if (insideVideo.onended) insideVideo.onended();
});


async function askQuestions() {
    for (const [q, num] of questionList) {
        question.innerText = q;
        answer.value = "0"; 

        await new Promise(resolve => {
            answer.onchange = () => resolve(parseFloat(answer.value));
        });

        let currNum = parseFloat(answer.value) + num;
        addStress(currNum);
    }

    question.innerText = 'Time to wake up!';
    answer.style.visibility = 'hidden';

    const foot = document.getElementById('foot');

      await new Promise(resolve => {
        setTimeout(() => {
            document.body.style.backgroundColor = 'white';
            stressBarText.style.color = 'black';
            videoContainer.style.visibility = 'visible';
            skipBtn.style.visibility = 'visible';
            question.style.visibility = 'hidden';
            foot.style.color = 'black';
            resolve(); 
        }, 1000);
    });
}


const videoList = [
    ["media/inside/1_mirror.mp4",40],
    ["media/inside/2_ready.mp4",10],
    ["media/inside/3_breakfast.mp4",1],
    ["media/inside/4_elevator.mp4",50],
    ["media/inside/5_subway.mp4",70],
    ["media/inside/6_class.mp4",30],
    
]; 

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  
const insideVideo = document.getElementById('insideBoxVideo'); 

async function playVideo() {
    for (const [insideSrc, num] of videoList) {
        if (barMaxedOut) break;

        skipVideo = false;
        insideVideo.src = insideSrc;
        insideVideo.muted = false;
        insideVideo.load();

        await showContinueOverlay();
        await insideVideo.play();

        await new Promise(resolve => {
            insideVideo.onended = resolve;
        });

        addStress(num);

        if (barMaxedOut) break;
    }

    videoContainer.style.display = 'none';
    showEndVideo(); 
}

  

  async function showEndVideo() {
    const endText = document.getElementById('endText');
    const stressBar = document.getElementById('stressBar');
    const stressC = document.getElementById('stressCaption');
    const endDiv = document.getElementById('end');
    const endVideo = document.getElementById('endVideo');
  
    endText.style.display = 'block';
    stressBar.classList.add('shake');
  
    await wait(1000);
  
    stressBar.classList.remove('shake');
    stressBar.style.display = 'none';
    stressC.style.display = 'none';
    videoContainer.style.display = 'none';
  
    endDiv.style.display = 'block';
    endVideo.muted = false;
    endVideo.play();
  }
  
  

async function start() {
    await askQuestions();  
    await playVideo();   
}


function showContinueOverlay() {
    return new Promise(resolve => {
      const overlay = document.getElementById('continueOverlay');
      overlay.style.display = 'flex';
  
      overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        resolve();
      }, { once: true });
    });
}
  

start();
