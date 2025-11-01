// DOM Elements
const video = document.getElementById('webcam');
const canvas = document.getElementById('output_canvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const scoreDiv = document.getElementById('score');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const roundsSelector = document.getElementById('rounds-selector');

// Model & Game State
let model;
let gameInProgress = false;
let playerScore = 0;
let computerScore = 0;
let currentRound = 0;
let maxRounds = 3; // Default
let roundTimer; // To store the setTimeout reference

// --- Gesture Definitions ---
const GE_ROCK = new fp.GestureDescription('rock');
GE_ROCK.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
GE_ROCK.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 0.9);
GE_ROCK.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
GE_ROCK.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);
GE_ROCK.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
GE_ROCK.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);
GE_ROCK.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
GE_ROCK.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);
GE_ROCK.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
GE_ROCK.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

const GE_PAPER = new fp.GestureDescription('paper');
GE_PAPER.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
GE_PAPER.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
GE_PAPER.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
GE_PAPER.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
GE_PAPER.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);


// --- ⭐️ NEW, STRICTER SCISSORS GESTURE ⭐️ ---
const GE_SCISSORS = new fp.GestureDescription('scissors');
// Index and Middle fingers are the most important
GE_SCISSORS.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
GE_SCISSORS.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
GE_SCISSORS.setWeight(fp.Finger.Index, 2.0); // Make this finger extra important
GE_SCISSORS.setWeight(fp.Finger.Middle, 2.0); // Make this finger extra important

// Ring and Pinky must be FULLY curled
GE_SCISSORS.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
// Removed: GE_SCISSORS.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);
GE_SCISSORS.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
// Removed: GE_SCISSORS.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

// Thumb is not important and can be in any position (original logic)
GE_SCISSORS.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
GE_SCISSORS.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
GE_SCISSORS.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
GE_SCISSORS.setWeight(fp.Finger.Thumb, 0.5); // Make thumb half as important
// --- END OF GESTURE MODIFICATION ---

const knownGestures = [GE_ROCK, GE_PAPER, GE_SCISSORS];

// --- Setup & Initialization ---

async function setupCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            await new Promise(resolve => video.onloadedmetadata = resolve);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            statusDiv.innerText = 'Camera ready. Loading model...';
        } catch (error) {
            console.error('Error accessing camera:', error);
            statusDiv.innerText = 'Error: Could not access camera.';
        }
    } else {
        statusDiv.innerText = 'Error: Your browser does not support camera access.';
    }
}

async function loadModel() {
    model = await handpose.load();
    statusDiv.innerText = 'Model loaded. Press Start!';
    startButton.disabled = false;
    // Start the visual feedback loop
    detectLoop();
}

// Main visual loop
async function detectLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (model) {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                const hand = predictions[i];
                for (let j = 0; j < hand.landmarks.length; j++) {
                    const [x, y] = hand.landmarks[j];
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                }
            }
        }
    }
    requestAnimationFrame(detectLoop);
}

// --- Game Logic Functions ---

function startGame() {
    playerScore = 0;
    computerScore = 0;
    currentRound = 0;
    maxRounds = parseInt(roundsSelector.value);
    gameInProgress = true;
    updateScore();

    statusDiv.innerText = 'Game starting!';
    resultDiv.innerText = '';
    startButton.style.display = 'none';
    roundsSelector.style.display = 'none';
    stopButton.style.display = 'block';

    startRound();
}

function stopGame() {
    gameInProgress = false;
    clearTimeout(roundTimer); 

    statusDiv.innerText = 'Game stopped. Press Start to play!';
    resultDiv.innerText = '';
    startButton.style.display = 'block';
    roundsSelector.style.display = 'block';
    stopButton.style.display = 'none';
    
    playerScore = 0;
    computerScore = 0;
    currentRound = 0;
    updateScore();
}

function startRound() {
    if (!gameInProgress) return;

    currentRound++;
    if (currentRound > maxRounds) {
        endGame();
        return;
    }

    resultDiv.innerText = '';
    statusDiv.innerText = `Round ${currentRound} / ${maxRounds}`;

    roundTimer = setTimeout(() => { statusDiv.innerText = 'Rock...'; }, 1000);
    roundTimer = setTimeout(() => { statusDiv.innerText = 'Paper...'; }, 2000);
    roundTimer = setTimeout(() => { statusDiv.innerText = 'Scissors...'; }, 3000);
    roundTimer = setTimeout(() => {
        statusDiv.innerText = 'SHOOT!';
        playRound();
    }, 4000);
}

async function playRound() {
    if (!gameInProgress) return;

    let playerChoice = 'none';
    const predictions = await model.estimateHands(video);

    if (predictions.length > 0) {
        const hand = predictions[0];
        const gestureEstimator = new fp.GestureEstimator(knownGestures);
        
        // ⭐️ --- CHANGE IS HERE --- ⭐️
        // Increased confidence threshold to require a better match
        const gesture = gestureEstimator.estimate(hand.landmarks, 8.5); 
        // ⭐️ --- END OF CHANGE --- ⭐️

        if (gesture.gestures.length > 0) {
            playerChoice = gesture.gestures[0].name; 
        }
    }

    if (playerChoice === 'none') {
        statusDiv.innerText = 'No hand gesture detected!';
        resultDiv.innerText = 'Please show a clear gesture.';
    } else {
        const computerChoice = getComputerChoice();
        const winner = determineWinner(playerChoice, computerChoice);

        statusDiv.innerText = `You: ${playerChoice.toUpperCase()} | PC: ${computerChoice.toUpperCase()}`;
        resultDiv.innerText = winner;
        updateScore();
    }

    roundTimer = setTimeout(startRound, 3000);
}

function endGame() {
    gameInProgress = false;
    statusDiv.innerText = 'Game Over!';

    if (playerScore > computerScore) {
        resultDiv.innerText = 'You win the game! 🏆';
    } else if (computerScore > playerScore) {
        resultDiv.innerText = 'Computer wins! 💻';
    } else {
        resultDiv.innerText = "It's a draw overall!";
    }

    startButton.style.display = 'block';
    roundsSelector.style.display = 'block';
    stopButton.style.display = 'none';
}

// --- Helper Functions ---
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
}

function determineWinner(player, computer) {
    if (player === computer) {
        return "It's a tie!";
    }
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        playerScore++;
        return 'You win this round!';
    } else {
        computerScore++;
        return 'Computer wins this round!';
    }
}

function updateScore() {
    scoreDiv.innerText = `Player: ${playerScore} | Computer: ${computerScore}`;
}

// --- Event Listeners ---
startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
startButton.disabled = true;

// --- Start the application ---
setupCamera().then(loadModel);