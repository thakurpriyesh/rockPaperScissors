# 🖐️ Rock Paper Scissors - Gesture Edition ✂️ 🧻

This isn't your average Rock Paper Scissors game!

This project uses your webcam and the power of machine learning (via TensorFlow.js) to recognize your hand gestures in real-time. You can challenge the computer to a classic game, no mouse or keyboard required!

## ✨ Features

* **Gesture-Based Control:** Use your actual hand to make a "rock", "paper", or "scissors" gesture.
* **Real-time Detection:** See your hand landmarks detected live on the camera feed.
* **🤖 Smart AI Opponent:** Challenge a computer that makes a random choice each round.
* **📈 Score Tracking:** The game keeps track of the score between you and the computer.
* **⚙️ Selectable Rounds:** Choose to play a quick 3-round game or a longer 5, 7, or 10-round match.
* **📱 Responsive Design:** The layout adapts to look great on both desktop and mobile devices.

---

## 🛠️ Technologies Used

* **HTML5:** For the basic page structure (`index.html`).
* **CSS3:** For all styling (included directly in the `<style>` tag of `index.html`).
* **JavaScript (ES6+):** For all game logic and DOM manipulation (`script.js`).
* **[TensorFlow.js](https://www.tensorflow.org/js):** The core machine learning library for running models in the browser.
* **[Handpose](https://github.com/tensorflow/tfjs-models/tree/master/handpose):** A pre-trained TensorFlow.js model for detecting 21 keypoints of a hand.
* **[Fingerpose](https://github.com/andypotato/fingerpose):** A fantastic small library for gesture recognition based on the Handpose model's output.

---

## 🎮 How to Play

1.  **Allow Camera Access:** When you first load the page, your browser will ask for permission to use your webcam. You **must click 'Allow'** for the game to work.
2.  **Wait for the Model:** The status will show "Loading..." and then change to **"Model loaded. Press Start!"** This means the game is ready.
3.  **Select Rounds:** (Optional) Use the dropdown menu to select how many rounds you want to play.
4.  **Start Game:** Press the green **"Start Game"** button.
5.  **Follow the Cues:** The game will count down for you: "Rock...", "Paper...", "Scissors..."
6.  **SHOOT!** 💥 When you see **"SHOOT!"**, make your chosen gesture (Rock ✊, Paper 🖐️, or Scissors ✌️) clearly and hold it in front of the camera.
7.  **See the Result:** The game will detect your move, show the computer's move, and declare a winner for the round.
8.  **Win the Game!** The first player to win the majority of rounds wins the whole game! 🏆

---

## 🚀 How to Run This Project

**IMPORTANT:** Because this project needs to access your webcam (`getUserMedia`), modern browsers require it to be run from a **secure context**. This means you **cannot** just double-click the `index.html` file to run it from your hard drive (e.g., `file:///...`).

It **must** be run from a server (either `https://` or `http://localhost`).

### The Easiest Way to Run Locally:

The simplest method is to use a basic local server. If you have **Node.js** installed, you can do this in under a minute.

1.  Make sure you have [Node.js](https://nodejs.org/) installed on your computer.
2.  Open your terminal or command prompt.
3.  Install `http-server`, a simple, zero-configuration server, by running this command:
    ```bash
    npm install -g http-server
    ```
4.  Using your terminal, navigate into your `rockPaperScissors` project folder:
    ```bash
    cd path/to/rockPaperScissors
    ```
5.  Start the server by typing:
    ```bash
    http-server
    ```
6.  Your terminal will show you a list of URLs. Open your web browser and go to one of the `localhost` addresses, (e.g., `http://127.0.0.1:8080`).

Now the game will load correctly and ask for camera permission!
