/* =====================================================
   Tasbeeh Web App
   File: script.js
   ===================================================== */

/* ================= APP STATE ================= */

const AppState = {
    currentZikrIndex: 0,
    currentCount: 0,
    sessionCount: 0,
    vibrationEnabled: true,
    quietMode: false,
    language: "MIX", // EN | AR | MIX
    completed: false
};

/* ================= DATA ================= */

let zikrList = [
    { text: "سبحان الله", limit: 33 },
    { text: "الحمد لله", limit: 33 },
    { text: "الله أكبر", limit: 34 },
    { text: "لا إله إلا الله", limit: 33 },
    { text: "صلّي على محمد", limit: 100 }
];

const duaaList = [
    "اللهم اغفر له وارحمه واجعل مثواه الجنة",
    "اللهم اجعل قبره روضة من رياض الجنة",
    "اللهم آنس وحشته ونوّر قبره",
    "اللهم ارفع درجته في المهديين",
    "اللهم اجعل ما قدمه في ميزان حسناته",
    "اللهم اغفر لنا وله",
    "اللهم اجعل هذا الذكر صدقة جارية عنه",
    "اللهم تقبل منا ومنكم صالح الأعمال",
    "اللهم اجمعنا به في مستقر رحمتك",
    "اللهم اجعل عملنا هذا خالصًا لوجهك",
    "اللهم اجعل القرآن شفيعًا له",
    "اللهم ثبته عند السؤال",
    "اللهم ارحم موتانا وموتى المسلمين",
    "اللهم عوضه دارًا خيرًا من داره",
    "اللهم ارزقه الفردوس الأعلى بغير حساب",
    "اللهم اجعل هذا العمل نورًا له في قبره",
    "اللهم لا تحرمنا أجره ولا تفتنا بعده",
    "اللهم اجعل قبره نورًا وسعة",
    "اللهم اجعل ملائكة الرحمة تؤنسه",
    "اللهم اغسله بالماء والثلج والبرد"
];

let currentDuaaIndex = 0;

/* ================= ELEMENTS ================= */

const counterValue = document.getElementById("counterValue");
const sessionCountEl = document.getElementById("sessionCount");
const progressCircle = document.querySelector(".progress-ring-fill");

const tasbeehBtn = document.getElementById("tasbeehBtn");
const resetBtn = document.getElementById("resetBtn");
const editBtn = document.getElementById("editBtn");

const duaaText = document.getElementById("duaaText");
const zikrChips = document.querySelectorAll(".zikr-chip");

const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startAppBtn");

const editModal = document.getElementById("editModal");
const editTextInput = document.getElementById("editZikrText");
const editLimitInput = document.getElementById("editZikrLimit");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const themeToggle = document.getElementById("themeToggle");
const vibrationToggle = document.getElementById("vibrationToggle");
const quietToggle = document.getElementById("quietToggle");
const langToggle = document.getElementById("langToggle");

const counterTapArea = document.getElementById("counterTapArea");

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

/* ================= CORE FUNCTIONS ================= */

function incrementTasbeeh() {
    if (AppState.completed) return;

    const zikr = zikrList[AppState.currentZikrIndex];

    AppState.currentCount++;
    AppState.sessionCount++;

    if (!AppState.quietMode && AppState.vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(35);
    }

    if (AppState.currentCount >= zikr.limit) {
        completeZikr();
    } else {
        updateUI();
    }
}

function completeZikr() {
    AppState.completed = true;
    counterValue.innerHTML = "✔️";
    playCompleteSound();

    setTimeout(() => {
        AppState.currentCount = 0;
        AppState.completed = false;
        moveToNextZikr();
    }, 800);
}

function moveToNextZikr() {
    AppState.currentZikrIndex =
        (AppState.currentZikrIndex + 1) % zikrList.length;
    updateUI();
}

function resetCounter() {
    AppState.currentCount = 0;
    updateUI();
}

/* ================= UI UPDATE ================= */

function updateUI() {
    const zikr = zikrList[AppState.currentZikrIndex];
    const progress = AppState.currentCount / zikr.limit;
    const circumference = 628;
    const offset = circumference - progress * circumference;

    counterValue.textContent = AppState.currentCount;
    sessionCountEl.textContent = AppState.sessionCount;

    progressCircle.style.strokeDashoffset = offset;

    zikrChips.forEach((chip, index) => {
        chip.classList.toggle("active", index === AppState.currentZikrIndex);
    });
}

/* ================= DUAA ================= */

function nextDuaa() {
    // Fade out
    duaaText.style.opacity = 0;

    setTimeout(() => {
        currentDuaaIndex = (currentDuaaIndex + 1) % duaaList.length;
        duaaText.textContent = duaaList[currentDuaaIndex];

        // Fade in
        duaaText.style.opacity = 1;
    }, 150);

    duaaText.style.transform = "scale(0.98)";
    setTimeout(() => {
        duaaText.style.transform = "scale(1)";
    }, 150);

}

/* ================= EDIT ================= */

function openEditModal() {
    const zikr = zikrList[AppState.currentZikrIndex];
    editTextInput.value = zikr.text;
    editLimitInput.value = zikr.limit;
    editModal.classList.remove("hidden");
}

function saveEdit() {
    zikrList[AppState.currentZikrIndex] = {
        text: editTextInput.value.trim(),
        limit: parseInt(editLimitInput.value)
    };
    editModal.classList.add("hidden");
    resetCounter();
}

function closeEditModal() {
    editModal.classList.add("hidden");
}

/* ================= TOGGLES ================= */

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

function toggleVibration() {
    AppState.vibrationEnabled = !AppState.vibrationEnabled;
}

function toggleQuietMode() {
    AppState.quietMode = !AppState.quietMode;
}

function toggleLanguage() {
    const modes = ["EN", "AR", "MIX"];
    const index = modes.indexOf(AppState.language);
    AppState.language = modes[(index + 1) % modes.length];
    document.documentElement.dir =
        AppState.language === "AR" ? "rtl" : "ltr";
}

/* ================= SOUND ================= */

function playCompleteSound() {
    if (AppState.quietMode) return;
    const audio = new Audio("assets/complete.mp3");
    audio.volume = 0.4;
    audio.play();
}

/* ================= EVENTS ================= */

tasbeehBtn.addEventListener("click", incrementTasbeeh);
counterTapArea.addEventListener("click", incrementTasbeeh);

resetBtn.addEventListener("click", resetCounter);
editBtn.addEventListener("click", openEditModal);

saveEditBtn.addEventListener("click", saveEdit);
cancelEditBtn.addEventListener("click", closeEditModal);

duaaText.addEventListener("click", nextDuaa);

themeToggle.addEventListener("click", toggleTheme);
vibrationToggle.addEventListener("click", toggleVibration);
quietToggle.addEventListener("click", toggleQuietMode);
langToggle.addEventListener("click", toggleLanguage);

startBtn.addEventListener("click", () => {
    startModal.style.display = "none";
});

zikrChips.forEach((chip, index) => {
    chip.addEventListener("click", () => {
        AppState.currentZikrIndex = index;
        AppState.currentCount = 0;
        AppState.completed = false;
        updateUI();
    });
});


