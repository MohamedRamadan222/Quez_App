// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);
      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);
      // Start Countdown
      countdown(3, qCount);
      // Click On Submit
      submitButton.onclick = () => {
        // Get The Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        // Increase Index
        currentIndex++;
        // Check The Answer
        checkAnswer(theRightAnswer, qCount);
        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        // Add Question Data
        if (currentIndex < qCount) {
          addQuestionData(questionsObject[currentIndex], qCount);
        }
        // Handle Bullets Class
        handleBullets();
        // Start Countdown
        clearInterval(countdownInterval);
        countdown(3, qCount);
        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "HTML_Questions.Json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
      // Append Bullet To Main Bullet Container
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");
    // Create Question Text
    let questionText = document.createTextNode(obj.title);
    // Append Text To Heading
    questionTitle.appendChild(questionText);
    // Append H2 To Quiz Area
    quizArea.appendChild(questionTitle);
    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Not Good`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      // Ensure numbers are two digits
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
