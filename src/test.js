const questions = [
  {
    question: "¿Para que sirve un bogie?",
    options: [
      "Es un sistema de bogies con suspensión neumática para mayor confort",
      "Es un sistema de bogies con suspensión de resortes para mayor confort",
      "Es un sistema de bogies con suspensión de acero para mayor confort",
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
    options: [
      "Tecnologias de hidrógeno y levitación magnética",
      "Trenes de alta velocidad",
      "Trenes de carga pesada",
      "Trenes de pasajeros",
    ],
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

  const optionsElement = document.createElement("form");
  q.options.forEach((option) => {
    const optionItem = document.createElement("div");
    optionItem.innerHTML = `<input type="radio" name="question${index}" value="${option}"> ${option}`;
    optionsElement.appendChild(optionItem);
  });

  questionElement.appendChild(optionsElement);
  questionContainer.appendChild(questionElement);
});

// Agregar un botón para validar respuestas
const validateButton = document.createElement("button");
validateButton.textContent = "Check";
validateButton.addEventListener("click", () => {
  const userAnswers = [];
  questions.forEach((q, index) => {
    const selectedOptions = document.querySelectorAll(
      `input[name='question${index}']:checked`
    );
    const selectedValues = Array.from(selectedOptions).map(
      (option) => option.value
    );
    userAnswers.push(selectedValues.join(",")); // Combina respuestas seleccionadas
  });

  const score = validateAnswers(userAnswers);
  alert(`Tu puntuación es: ${score}/${questions.length}`);
});

questionContainer.appendChild(validateButton);
