const socket = io.connect(window.location.origin);
const bar = document.getElementById('bar');
const webcamBox = document.getElementById('webcam-box');
const webcamFeed = document.getElementById('webcam-feed');
const spotifyPlayerContainer = document.getElementById('spotify-player-container');
let totalEmotionsDetected = 0;
const maxEmotions = 10;
let emotionCounts = {};

socket.on('emotion_update', function(data) {
console.log("Received emotion update:", data);

const emotionDiv = document.createElement('div');
emotionDiv.classList.add('emotion-box');
emotionDiv.style.width = `${100 / maxEmotions}%`;

if (!emotionCounts[data.emotion]) {
    emotionCounts[data.emotion] = 0;
}
emotionCounts[data.emotion]++;

switch (data.emotion) {
    case 'happy':
        emotionDiv.style.backgroundColor = 'yellow';
        break;
    case 'sad':
        emotionDiv.style.backgroundColor = 'blue';
        break;
    case 'neutral':
        emotionDiv.style.backgroundColor = 'gray';
        break;
    case 'angry':
        emotionDiv.style.backgroundColor = 'red';
        break;
    case 'surprise':
        emotionDiv.style.backgroundColor = 'orange';
        break;
    default:
        emotionDiv.style.backgroundColor = 'green';
}

bar.appendChild(emotionDiv);
totalEmotionsDetected++;

const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

function calculateEmotionPercentages(emotionCounts, totalEmotions) {
    let emotionPercentages = {};
    for (let emotion in emotionCounts) {
        emotionPercentages[emotion] = (emotionCounts[emotion] / totalEmotions) * 100;
    }
    return emotionPercentages;
}

const emotionPhraseDict = {
    happy: {
        "20-50%": "content",
        "50-70%": "happy",
        "70-100%": "joyous"
    },
    sad: {
        "20-50%": "blue",
        "50-70%": "sad",
        "70-100%": "heart-broken"
    },
    calm: {
        "20-50%": "calm",
        "50-70%": "balanced",
        "70-100%": "emotionless"
    },
    neutral: {
        "20-50%": "calm",
        "50-70%": "balanced",
        "70-100%": "emotionless"
    },
    angry: {
        "20-50%": "upset",
        "50-70%": "angry",
        "70-100%": "furious"
    }
};

function getPhraseForEmotion(emotion, percentage) {
    let phraseDict = emotionPhraseDict[emotion];
    if (percentage >= 70) {
        return phraseDict["70-100%"];
    } else if (percentage >= 50) {
        return phraseDict["50-70%"];
    } else if (percentage >= 20) {
        return phraseDict["20-50%"];
    } else {
        return "";
    }
}

function generateFeelingSentence(emotionPercentages) {
    let phrases = [];
    for (let emotion in emotionPercentages) {
        let percentage = emotionPercentages[emotion];
        let phrase = getPhraseForEmotion(emotion, percentage);
        if (phrase) {
            phrases.push(phrase);
        }
    }
    return "You're feeling: " + phrases.join(", ");
}

if (totalEmotionsDetected >= maxEmotions) {
    const emotionPercentages = calculateEmotionPercentages(emotionCounts, totalEmotions);
    const feelingSentence = generateFeelingSentence(emotionPercentages);

    let prominentEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b);
    if (prominentEmotion === 'neutral') {
        prominentEmotion = 'calm';
    }

    console.log("Prominent Emotion:", prominentEmotion);

    webcamBox.innerHTML = '<div class="loading-text">Loading...</div>';

    const playlistSearchQuery = `${prominentEmotion} beats`;
    console.log("Query:", playlistSearchQuery);

    fetch(`/search_playlist/${playlistSearchQuery}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(data.error);
                webcamBox.innerHTML = '<p>Cannot read</p>';
            } else {
                const randomTrackId = data.track_id;

                spotifyPlayerContainer.style.border = 'none';
                spotifyPlayerContainer.style.backgroundColor = 'transparent';

                spotifyPlayerContainer.innerHTML = `
                    <iframe src="https://open.spotify.com/embed/track/${randomTrackId}" 
                            width="100%" 
                            height="100%" 
                            frameborder="0" 
                            allowtransparency="true" 
                            allow="encrypted-media">
                    </iframe>`;

                webcamBox.innerHTML = `<p>${feelingSentence}</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching playlist:', error);
            webcamBox.innerHTML = '<p>Cannot read</p>';
        });
}
});
