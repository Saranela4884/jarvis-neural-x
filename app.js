
"use strict";

// JARVIS NEURAL X — MARK VIII
// Royal Purple AI Website + Local Ollama
// Model: llama3.2:1b

const $ = (id) => document.getElementById(id);

const USER_KEY = "jnx-demo-users-v1";
const SESSION_KEY = "jnx-demo-session-v1";
const MODEL = "llama3.2:1b";
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

let formMode = "login";
let currentName = "";
let listening = false;
let processing = false;

// =====================================
// LOCAL DEMO LOGIN
// =====================================
// This is not secure authentication.
// Do not use a real password.

function users() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  } catch {
    return [];
  }
}

function setMsg(message) {
  $("authMessage").textContent = message;
}

function setMode(mode) {
  formMode = mode;

  $("loginTab").classList.toggle("selected", mode === "login");
  $("signupTab").classList.toggle("selected", mode === "signup");

  $("formTitle").innerHTML =
    mode === "login"
      ? "Welcome back<span>.</span>"
      : "Join Neural X<span>.</span>";

  $("formSub").textContent =
    mode === "login"
      ? "Sign in to enter your Neural X command center."
      : "Create your local demo profile.";

  $("authSubmit").innerHTML =
    mode === "login"
      ? "ACCESS SYSTEM <span>→</span>"
      : "CREATE DEMO PROFILE <span>→</span>";

  setMsg("");
}

$("loginTab").addEventListener("click", () => setMode("login"));
$("signupTab").addEventListener("click", () => setMode("signup"));

$("showPass").addEventListener("click", () => {
  const input = $("password");

  input.type =
    input.type === "password" ? "text" : "password";

  $("showPass").textContent =
    input.type === "password" ? "SHOW" : "HIDE";
});

$("authForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("username").value.trim();
  const password = $("password").value;
  const known = users();

  if (name.length < 3 || password.length < 6) {
    setMsg("Username must have 3+ characters and demo password 6+.");
    return;
  }

  if (formMode === "signup") {
    if (known.some((u) => u.toLowerCase() === name.toLowerCase())) {
      setMsg("Username already exists. Please log in.");
      return;
    }

    known.push(name);
    localStorage.setItem(USER_KEY, JSON.stringify(known));
  } else {
    if (!known.some((u) => u.toLowerCase() === name.toLowerCase())) {
      setMsg("Profile not found. Please sign up first.");
      return;
    }
  }

  // Demo only: passwords are neither stored nor verified.
  $("password").value = "";

  if ($("remember").checked) {
    sessionStorage.setItem(SESSION_KEY, name);
  }

  showDashboard(name);
});

function showDashboard(name) {
  currentName = name;

  $("welcomeName").textContent = name;
  $("authPage").classList.add("hidden");
  $("dashPage").classList.remove("hidden");

  if (!$("chatMessages").children.length) {
    addChat(
      "assistant",
      "JARVIS Neural X activated. Welcome, " +
      name +
      "! I am ready to connect to your local Ollama AI."
    );
  }

  window.scrollTo(0, 0);
}

$("logout").addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);

  currentName = "";
  $("dashPage").classList.add("hidden");
  $("authPage").classList.remove("hidden");
  $("authForm").reset();

  setMsg("");
  window.scrollTo(0, 0);
});

const previous = sessionStorage.getItem(SESSION_KEY);

if (previous && users().includes(previous)) {
  showDashboard(previous);
}

// =====================================
// CLOCK AND NETWORK STATUS
// =====================================

function updateNet() {
  const online = navigator.onLine;

  $("netStatus").textContent =
    online ? "BROWSER ONLINE" : "OFFLINE MODE";

  $("networkReadout").textContent =
    online ? "ONLINE" : "OFFLINE";
}

window.addEventListener("online", updateNet);
window.addEventListener("offline", updateNet);

updateNet();

function clock() {
  $("clock").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

clock();
setInterval(clock, 1000);

// =====================================
// AUDIO VISUALIZER
// =====================================

for (let i = 0; i < 38; i++) {
  const bar = document.createElement("i");

  bar.style.height =
    8 + Math.abs(Math.sin(i * 0.62)) * 30 + "px";

  bar.style.animationDelay = -i * 0.067 + "s";

  $("wave").append(bar);
}

// =====================================
// CHAT INTERFACE
// =====================================

function addChat(who, message) {
  const bubble = document.createElement("div");
  bubble.className = "bubble " + who;

  const label = document.createElement("small");
  label.textContent =
    who === "user" ? "YOU" : "JARVIS / NEURAL AI";

  const content = document.createElement("div");
  content.textContent = String(message);

  bubble.append(label, content);
  $("chatMessages").append(bubble);

  $("chatMessages").scrollTop =
    $("chatMessages").scrollHeight;

  return content;
}

// =====================================
// BUILT-IN OFFLINE COMMANDS
// =====================================

function localCommand(question) {
  const text = question.toLowerCase().trim();
  const tamil = $("language").value === "ta";

  if (/^(hi|hello|hey|vanakkam|வணக்கம்)[!.\s]*$/.test(text)) {
    return tamil
      ? "வணக்கம்! நான் ஜார்விஸ் நியூரல் எக்ஸ்."
      : "Hello! I am JARVIS Neural X. How can I help?";
  }

  if (/^(time|what time is it|what is the time|what's the time|whats is the time now|what is the time now)\??$/.test(text) ||
      /நேரம்/.test(text)) {
    return tamil
      ? "இப்போது நேரம்: " +
          new Date().toLocaleTimeString("ta-IN")
      : "The current time is " +
          new Date().toLocaleTimeString();
  }

  if (/^(date|today|what is the date|what is today's date)\??$/.test(text) ||
      /தேதி/.test(text)) {
    return tamil
      ? "இன்றைய தேதி: " +
          new Date().toLocaleDateString("ta-IN")
      : "Today's date is " +
          new Date().toLocaleDateString();
  }

  if (/^(help|commands)\??$/.test(text)) {
    return "JARVIS supports AI questions, Tamil, English, voice, time, date and offline commands. Full AI requires local Ollama.";
  }

  return null;
}

// =====================================
// REAL OLLAMA AI CONNECTION
// =====================================

async function askOllama(question) {
  const tamil = $("language").value === "ta";

  const systemPrompt = tamil
    ? "You are JARVIS Neural X, a helpful AI assistant. Answer in Tamil using simple and clear language."
    : "You are JARVIS Neural X, a smart and friendly AI assistant. Answer in simple English. Be clear, accurate and helpful.";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        model: MODEL,
        system: systemPrompt,
        prompt: question,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 350
        }
      }),

      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("Ollama HTTP " + response.status);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Ollama returned an empty response.");
    }

    return data.response.trim();

  } finally {
    clearTimeout(timeout);
  }
}

// =====================================
// JARVIS MAIN RESPONSE ENGINE
// =====================================

async function respond(question) {
  const command = localCommand(question);

  if (command !== null) {
    return command;
  }

  try {
    return await askOllama(question);

  } catch (error) {
    console.error("JARVIS AI ERROR:", error);

    if (error.name === "AbortError") {
      return "The local AI took too long to respond. Please try again.";
    }

    return (
      "I cannot connect to the local Ollama AI.\n\n" +
      "Please check:\n" +
      "1. Ollama is running.\n" +
      "2. The llama3.2:1b model is installed.\n" +
      "3. Browser access to Ollama is allowed.\n\n" +
      "Built-in offline commands are still available."
    );
  }
}

// =====================================
// SEND MESSAGE
// =====================================

async function sendMessage(question) {
  const q = question.trim();

  if (!q || processing) return;

  processing = true;

  addChat("user", q);

  $("modeText").textContent = "AI PROCESSING";

  const answerElement = addChat(
    "assistant",
    "Processing your request..."
  );

  try {
    const answer = await respond(q);

    answerElement.textContent = answer;

    $("modeText").textContent = "SYSTEM READY";

  } catch (error) {
    console.error(error);

    answerElement.textContent =
      "JARVIS encountered an unexpected error.";

    $("modeText").textContent = "SYSTEM ERROR";

  } finally {
    processing = false;
  }
}

$("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = $("message");
  const question = input.value;

  if (!question.trim() || processing) return;

  input.value = "";

  sendMessage(question);
});

document.querySelectorAll("[data-ask]").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.ask);
  });
});

// =====================================
// TAMIL + ENGLISH TEXT TO SPEECH
// =====================================

function say(message) {
  if (!("speechSynthesis" in window)) {
    addChat(
      "assistant",
      "Voice output is not supported in this browser."
    );
    return;
  }

  speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(message);

  voice.lang =
    $("language").value === "ta"
      ? "ta-IN"
      : "en-US";

  voice.rate = 0.94;
  voice.pitch = 1.0;
  voice.volume = 1.0;

  speechSynthesis.speak(voice);
}

$("testVoice").addEventListener("click", () => {
  const message =
    $("language").value === "ta"
      ? "வணக்கம்! நான் ஜார்விஸ் நியூரல் எக்ஸ்."
      : "Hello! I am JARVIS Neural X. System online.";

  say(message);
});

// =====================================
// MICROPHONE VOICE RECOGNITION
// =====================================

$("voiceBtn").addEventListener("click", () => {
  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!Recognition) {
    addChat(
      "assistant",
      "This browser does not support speech recognition."
    );
    return;
  }

  if (listening || processing) return;

  const recognition = new Recognition();

  recognition.lang =
    $("language").value === "ta"
      ? "ta-IN"
      : "en-US";

  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    listening = true;
    $("modeText").textContent = "LISTENING";
  };

  recognition.onresult = (event) => {
    const question = event.results[0][0].transcript;
    sendMessage(question);
  };

  recognition.onerror = (event) => {
    addChat(
      "assistant",
      "Microphone error: " + event.error
    );
  };

  recognition.onend = () => {
    listening = false;

    if (!processing) {
      $("modeText").textContent = "SYSTEM READY";
    }
  };

  try {
    recognition.start();

  } catch (error) {
    listening = false;
    console.error(error);
  }
});

// =====================================
// PURPLE PARTICLE BACKGROUND
// =====================================

const canvas = $("stars");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  const ratio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles = Array.from(
    {
      length: Math.min(
        130,
        Math.floor(innerWidth / 11)
      )
    },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      radius: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.04
    })
  );
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (const particle of particles) {
    ctx.fillStyle = "rgba(184,109,255,0.52)";

    ctx.beginPath();

    ctx.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    particle.y -= particle.speed;

    if (particle.y < 0) {
      particle.y = innerHeight;
      particle.x = Math.random() * innerWidth;
    }
  }

  requestAnimationFrame(drawParticles);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawParticles();
}

// =====================================
// OFFLINE PWA
// =====================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(console.error);
  });
}

console.log("JARVIS NEURAL X — MARK VIII INITIALIZED");
