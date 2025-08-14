const questions = [
    {
      text: "Do you prefer quick decisions or slow careful thinking?",
      system1: "Quick and instinctive",
      system2: "Slow and analytical"
    },
    {
      text: "Do you rely on gut feeling or evidence?",
      system1: "Gut feeling",
      system2: "Evidence and logic"
    },
    {
      text: "How do you judge a product?",
      system1: "Brand/image",
      system2: "Specs, reviews, comparison"
    },
    {
      text: "When solving a math problem, do you:",
      system1: "Estimate roughly",
      system2: "Work through it step-by-step"
    }
  ];
  
  let currentQ = 0;
  let score = { system1: 0, system2: 0 };
  let chart;
  let system1Count = 0;
  let system2Count = 0;
  
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const questionText = document.getElementById("question-text");
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");
  const yourResult = document.getElementById("your-result");
  
  const bc = new BroadcastChannel("thinking-quiz");
  
  function startQuiz() {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    currentQ = 0;
    score = { system1: 0, system2: 0 };
    showQuestion();
  }
  
  function showQuestion() {
    const q = questions[currentQ];
    questionText.textContent = q.text;
    option1.textContent = q.system1;
    option2.textContent = q.system2;
  }
  
  function choose(type) {
    score[type]++;
    currentQ++;
    if (currentQ < questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }
  
  function finishQuiz() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
  
    const result = score.system1 > score.system2 ? "System 1 ⚡️" : "System 2 🧠";
    yourResult.textContent = result;
  
    if (result.includes("System 1")) system1Count++;
    else system2Count++;
  
    updateChart();
    bc.postMessage(result);
  }
  
  function restartQuiz() {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }
  
  function initChart() {
    const ctx = document.getElementById("resultChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["System 1 ", "System 2 "],
        datasets: [{
          label: "Number of Students",
          data: [system1Count, system2Count],
          backgroundColor: ["#ff4d4d", "#4d79ff"]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        }
      }
    });
  }
  
  function updateChart() {
    if (!chart) return;
    chart.data.datasets[0].data = [system1Count, system2Count];
    chart.update();
  }
  
  // Listen for others' results
  bc.onmessage = (e) => {
    if (e.data.includes("System 1")) system1Count++;
    else system2Count++;
    updateChart();
  };
  
  window.onload = () => {
    initChart();
  };
  