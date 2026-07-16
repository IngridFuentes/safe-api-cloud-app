import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const answers: Record<string, string> = {};
let currentStep = 1;

const copy: Record<string, Record<string, string>> = {
  en: {
    subtitle: "Your personal finance coach — built for your journey",
    q1: "What's your main money goal right now?",
    "q1-sub": "Choose the one that feels most urgent.",
    q2: "How comfortable are you with money topics?",
    "q2-sub": "No wrong answer — this helps us explain things the right way.",
    q3: "Do you send money to family abroad?",
    "q3-sub": "We'll help you manage remittances as part of your budget.",
    q4: "What's your name?",
    "q4-sub": "Your coach will use this to make things feel personal.",
    g1: "Start saving money", g1s: "Build an emergency fund or rainy day savings",
    g2: "Build or fix my credit", g2s: "I want to understand and improve my credit score",
    g3: "Get out of debt", g3s: "Manage credit cards, loans, or bills",
    g4: "Learn the basics", g4s: "I'm starting from zero — teach me everything",
    l1: "Totally new to this", l1s: "Money stuff confuses me — start from scratch",
    l2: "I know a little", l2s: "I've heard the terms but get lost in the details",
    l3: "Getting there", l3s: "I budget sometimes and want to do more",
    r1: "Yes, regularly", r1s: "It's part of my monthly expenses",
    r2: "Sometimes", r2s: "When family needs help",
    r3: "No, not currently", r3s: "",
    sl1: "Step 1 of 4",
  },
  es: {
    subtitle: "Tu coach de finanzas personales — hecho para tu camino",
    q1: "¿Cuál es tu objetivo financiero principal?",
    "q1-sub": "Elige el que sientes más urgente.",
    q2: "¿Qué tan cómodo/a te sientes con el dinero?",
    "q2-sub": "No hay respuesta incorrecta.",
    q3: "¿Envías dinero a tu familia en el extranjero?",
    "q3-sub": "Te ayudaremos a incluir las remesas en tu presupuesto.",
    q4: "¿Cómo te llamas?",
    "q4-sub": "Tu coach usará tu nombre para personalizar la experiencia.",
    g1: "Empezar a ahorrar", g1s: "Crear un fondo de emergencia",
    g2: "Construir o mejorar mi crédito", g2s: "Quiero entender y mejorar mi puntaje de crédito",
    g3: "Salir de deudas", g3s: "Manejar tarjetas, préstamos o facturas",
    g4: "Aprender lo básico", g4s: "Empiezo desde cero — enséñame todo",
    l1: "Completamente nuevo/a", l1s: "El dinero me confunde — empieza desde el principio",
    l2: "Sé un poco", l2s: "He escuchado los términos pero me pierdo en los detalles",
    l3: "Voy bien", l3s: "A veces hago presupuesto y quiero hacer más",
    r1: "Sí, regularmente", r1s: "Es parte de mis gastos mensuales",
    r2: "A veces", r2s: "Cuando la familia necesita ayuda",
    r3: "No, actualmente no", r3s: "",
    sl1: "Paso 1 de 4",
  },
};

function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

function updateProgress() {
  getEl<HTMLElement>("progressFill").style.width = `${currentStep * 25}%`;
}

function goToStep(n: number) {
  document.querySelectorAll<HTMLElement>(".step").forEach((s) => s.classList.remove("active"));
  getEl<HTMLElement>(`step-${n}`).classList.add("active");
  currentStep = n;
  updateProgress();
}

function applyLang(lang: string) {
  const c = copy[lang];
  Object.keys(c).forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.textContent = c[key];
  });
}

function bindOptions(groupId: string, answerKey: string, nextBtnId: string) {
  const group = getEl<HTMLElement>(groupId);
  const nextBtn = getEl<HTMLButtonElement>(nextBtnId);
  group.querySelectorAll<HTMLElement>(".option").forEach((opt) => {
    opt.addEventListener("click", () => {
      group.querySelectorAll(".option").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      answers[answerKey] = opt.dataset.value ?? "";
      nextBtn.disabled = false;
    });
  });
}

async function finish() {
  const name = getEl<HTMLInputElement>("nameInput").value.trim();
  const uid = localStorage.getItem('uid');

  if (!uid) {
    window.location.href = "/index.html";
    return;
  }

  try {
    await setDoc(doc(db, "users", uid), {
      name,
      goal: answers.goal,
      level: answers.level,
      remittances: answers.remit,
      onboardingComplete: true,
      createdAt: new Date(),
    });

    window.location.href = "/dashboard.html";
  } catch (error) {
    console.error("Error saving onboarding:", error);
  }
}

// init
getEl("langEn").addEventListener("click", () => {
  applyLang("en");
  getEl("langEn").classList.add("active");
  getEl("langEs").classList.remove("active");
});
getEl("langEs").addEventListener("click", () => {
  applyLang("es");
  getEl("langEs").classList.add("active");
  getEl("langEn").classList.remove("active");
});

bindOptions("options-goal", "goal", "next1");
bindOptions("options-level", "level", "next2");
bindOptions("options-remit", "remit", "next3");

getEl("next1").addEventListener("click", () => goToStep(2));
getEl("back2").addEventListener("click", () => goToStep(1));
getEl("next2").addEventListener("click", () => goToStep(3));
getEl("back3").addEventListener("click", () => goToStep(2));
getEl("next3").addEventListener("click", () => goToStep(4));
getEl("back4").addEventListener("click", () => goToStep(3));

getEl<HTMLInputElement>("nameInput").addEventListener("input", () => {
  const val = getEl<HTMLInputElement>("nameInput").value.trim();
  getEl<HTMLButtonElement>("next4").disabled = val.length < 1;
});

getEl("next4").addEventListener("click", () => finish());

updateProgress();