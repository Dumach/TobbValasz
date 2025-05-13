document.addEventListener('DOMContentLoaded', () => {
  const testMenu = document.getElementById('quiz-nav');
  const quizContainer = document.getElementById('quiz-container');
  const quizTitle = document.getElementById('quiz-title');
  const questionContainer = document.getElementById('question-container');
  const homeButton = document.getElementById('home-button');

  let currentQuestionIndex = 0;
  let quizData = null;
  let statusBar = null;
  let IMAGE_BASE_PATH = '';
  let points = 0;

  homeButton.addEventListener('click', () => {
    quizTitle.textContent = 'Select a Test';
    questionContainer.style.textAlign = 'left';
    questionContainer.innerHTML = `<ol>
      <li>Update the <strong>tests/tests.json</strong> file with the new test details.</li>
      <li>Add the test file to the <strong>tests</strong> folder.</li>
      <li>Ensure the test file is in the correct JSON format.</li>
      <li>Click on the test name in the menu to start the quiz.</li>
    </ol>`;
    currentQuestionIndex = 0;
  });

  // Call homepage first
  homeButton.click();

  // Load available tests
  fetch('tests/tests.json')
    .then((response) => response.json())
    .then((data) => {
      data.tests.forEach((test) => {
        const menuItem = document.createElement('a');
        menuItem.textContent = test.title;
        menuItem.href = '#';
        menuItem.className = 'menu-item';
        menuItem.id = test.path;
        menuItem.addEventListener('click', () => loadTest(menuItem.id));
        testMenu.appendChild(menuItem);
      });
    })
    .catch((error) => {
      console.error('Error loading tests:', error);
    });

  function loadTest(testPath) {
    questionContainer.style.textAlign = 'center';
    IMAGE_BASE_PATH = testPath.substring(0, testPath.lastIndexOf('/') + 1); // Update base path dynamically
    fetch(testPath)
      .then((response) => response.json())
      .then((data) => {
        quizData = data;
        quizData.questions = shuffleArray(quizData.questions); // Shuffle questions
        quizTitle.textContent = quizData.title; // Update title correctly
        currentQuestionIndex = 0;
        showQuestion();
      })
      .catch((error) => {
        console.error('Error loading quiz data:', error);
      });
  }

  // Shuffle array utility function ES6 / ECMAScript 2015
  function shuffleArray(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Show a question
  function showQuestion() {
    if (!quizData || currentQuestionIndex >= quizData.questions.length) {
      quizContainer.innerHTML = '<h2>Quiz Completed!</h2>';
      return;
    }

    const questionData = quizData.questions[currentQuestionIndex];

    // Get asnwers
    const correctAnswers = [...questionData.answers];
    if (correctAnswers.length == 0) {
      alert('No correct answers provided for this question!', ...questionData.answers);
    }

    // Shuffle options
    const shuffledOptions = shuffleArray([...questionData.options]);
    const questionImages = questionData.images;

    questionContainer.innerHTML = `
      Showing question ${currentQuestionIndex + 1} of ${quizData.questions.length}, ${points} points
      <h2 class="quiz-subtitle">${questionData.question}</h2>
      <ul class="image-container">
      ${
        questionImages && questionImages.length > 0
          ? questionImages
              .map(
                (image, index) =>
                  `<li>
              <figure>
                <img src="${IMAGE_BASE_PATH}${image}" alt="Question Image" class="question-image" data-index="${index}">
                <figcaption>${image}</figcaption>
              </figure>
            </li>
          `
              )
              .join('')
          : ''
      }      
      </ul>
      <div class="options-container">
        ${shuffledOptions
          .map(
            (option, index) => `<button class="option-button" data-index="${index}">
          <em>${option}</em>
          </button>`
          )
          .join('')}
      </div>
      <div id="status-bar" class="status-bar">
        <span id="status-message"></span>
        <button id="verify-button">Verify<br>
        Num of answers: ${correctAnswers.length}</button>
        <button id="next-button" style="display: none;">Next</button>
      </div>
    `;

    const optionButtons = document.querySelectorAll('.option-button');
    let selectedIndices = new Set();

    optionButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        if (selectedIndices.has(index)) {
          selectedIndices.delete(index);
          e.target.classList.remove('selected');
        } else {
          selectedIndices.add(index);
          e.target.classList.add('selected');
        }
      });
    });

    const verifyButton = document.getElementById('verify-button');
    const nextButton = document.getElementById('next-button');
    const statusMessage = document.getElementById('status-message');
    statusBar = document.getElementById('status-bar');

    verifyButton.addEventListener('click', () => {
      if (selectedIndices.size === 0) {
        statusMessage.textContent = 'Please select at least one answer!';
        statusBar.style.backgroundColor = '#ffc107'; // Yellow for warning
        return;
      }

      const selectedAnswers = [...selectedIndices].map((index) => shuffledOptions[index]); // Map selected indices to options
      const isCorrect =
        selectedAnswers.every((answer) => correctAnswers.includes(answer)) &&
        selectedAnswers.length === correctAnswers.length;

      if (isCorrect) {
        points += 1;
        statusMessage.textContent = 'Correct!';
        statusBar.style.backgroundColor = '#28a745'; // Green for correct
      } else {
        statusMessage.textContent = 'Wrong!';
        statusMessage.textContent += ' Correct answers: ';
        correctAnswers.forEach((answer) => {
          statusMessage.innerHTML += `<p>${answer}</p>`;
        });
        statusBar.style.backgroundColor = '#dc3545'; // Red for wrong
      }

      verifyButton.style.display = 'none';
      nextButton.style.display = 'inline-block';
    });

    nextButton.addEventListener('click', () => {
      currentQuestionIndex++;
      showQuestion();
    });
  }
});
