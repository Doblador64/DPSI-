const questions = [
  {
    question: "¿Para que sirve un bogie?",
    options: [
      "Es un sistema de bogies con suspensión neumática para mayor confort",
      "",
      "",
    ],
    correctAnswer:
      "Es un sistema de bogies con suspensión neumática para mayor confort",
  },
  {
    question:
      "¿Cual es la capacidad de un tanque de combustible de una locmotora?",
    options: ["30000 Lts", "3000 Lts", "5000 Lts", "10000 Lts"],
    correctAnswer: "5000 Lts",
  },
  {
    question: "¿Cuantos tipos de locotoras que existen?",
    options: ["3", "6", "4", "5"],
    correctAnswer: "4",
  },
  {
    question: "¿Qué tipo de frenos neumaticos utiliza la locmotora?",
    options: ["Ruedas de acero", "De disco", "De tambor", "De zapata"],
    correctAnswer: "De disco",
  },
  {
    question: "¿Cual es el ultimo desarrollo para trenes?",
    options: ["Tecnologias de hidrógeno y levitación magnética", "", ""],
    correctAnswer: "Tecnologias de hidrógeno y levitación magnética",
  },
];

// Función para validar respuestas
function validateAnswers(userAnswers) {
  let score = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      score++;
    }
  });
  return score;
}

// Exportamos las preguntas y la función
export { questions, validateAnswers };

// Seleccionar el contenedor donde se mostrarán las preguntas
const questionContainer = document.getElementById("question-container");

// Renderizar preguntas en el contenedor
questions.forEach((q, index) => {
  const questionElement = document.createElement("div");
  questionElement.classList.add("question");
  questionElement.innerHTML = `<h3>${index + 1}. ${q.question}</h3>`;

  const optionsElement = document.createElement("ul");
  q.options.forEach((option) => {
    const optionItem = document.createElement("li");
    optionItem.textContent = option;
    optionsElement.appendChild(optionItem);
  });

  questionElement.appendChild(optionsElement);
  questionContainer.appendChild(questionElement);
});
