document.addEventListener('DOMContentLoaded', () => {
  const quizContainer = document.getElementById('quiz-container');
  const quizTitle = document.getElementById('quiz-title');
  const questionContainer = document.getElementById('question-container');

  const IMAGE_BASE_PATH = 'tests/.net_programozas/'; // Global variable for image base path

  let currentQuestionIndex = 0;
  let quizData = null;
  let statusBar = null;

  // Load quiz data
  fetch('tests/.net_programozas/test.json')
    .then((response) => response.json())
    .then((data) => {
      quizData = data;
      quizTitle.textContent = quizData.title;
      showQuestion();
    })
    .catch((error) => {
      console.error('Error loading quiz data:', error);
    });

  // Show a question
  function showQuestion() {
    if (!quizData || currentQuestionIndex >= quizData.questions.length) {
      quizContainer.innerHTML = '<h2>Quiz Completed!</h2>';
      return;
    }

    const questionData = quizData.questions[currentQuestionIndex];
    questionContainer.innerHTML = `
      <h2>${questionData.question}</h2>
      ${
        questionData.image
          ? `<img src="${IMAGE_BASE_PATH}${questionData.image}" alt="Question Image" class="question-image">`
          : ''
      }
      <div class="options-container">
        ${questionData.options
          .map((option, index) => `<button class="option-button" data-index="${index}">${option}</button>`)
          .join('')}
      </div>
      <div id="status-bar" class="status-bar">
        <span id="status-message"></span>
        <button id="verify-button">Verify</button>
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

      const correctAnswers = new Set(questionData.answer);
      const isCorrect =
        [...selectedIndices].every((index) => correctAnswers.has(index)) &&
        selectedIndices.size === correctAnswers.size;

      if (isCorrect) {
        statusMessage.textContent = 'Correct!';
        statusBar.style.backgroundColor = '#28a745'; // Green for correct
      } else {
        statusMessage.textContent = 'Wrong!';
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
