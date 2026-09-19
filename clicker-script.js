// Variabili di stato iniziali
let coins = 0;
let coinsPerClick = 1;
let coinsPerSecond = 0;
let currentLevel = 1;

let upgradeClickCost = 15;
let upgradeAutoCost = 50;
let upgradeLevelCost = 200;

const levelNames = [
    "",
    "LIVELLO 1: Isola Iniziale",
    "LIVELLO 2: Mondo Sotterraneo",
    "LIVELLO 3: Città Neon Spaziale",
    "LIVELLO 4: Dimensione Divina (Max)"
];

const levelBackgrounds = [
    "",
    "linear-gradient(135deg, #111e2e, #0a111a)",
    "linear-gradient(135deg, #2b1a11, #140c08)",
    "linear-gradient(135deg, #1a0f30, #0d071a)",
    "linear-gradient(135deg, #3d3411, #1a1607)"
];

// --- FUNZIONE DI SALVATAGGIO ---
function saveGame() {
    const saveData = {
        coins: coins,
        coinsPerClick: coinsPerClick,
        coinsPerSecond: coinsPerSecond,
        currentLevel: currentLevel,
        upgradeClickCost: upgradeClickCost,
        upgradeAutoCost: upgradeAutoCost,
        upgradeLevelCost: upgradeLevelCost
    };
    // Salva i dati convertiti in testo nel browser sotto il nome 'clickerSaveGame'
    localStorage.setItem('clickerSaveGame', JSON.stringify(saveData));
}

// --- FUNZIONE DI CARICAMENTO ---
function loadGame() {
    const savedData = localStorage.getItem('clickerSaveGame');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Ripristina tutte le variabili di gioco
        coins = data.coins;
        coinsPerClick = data.coinsPerClick;
        coinsPerSecond = data.coinsPerSecond;
        currentLevel = data.currentLevel;
        upgradeClickCost = data.upgradeClickCost;
        upgradeAutoCost = data.upgradeAutoCost;
        upgradeLevelCost = data.upgradeLevelCost;
        
        // Ripristina l'aspetto visivo e i testi del livello
        document.body.style.background = levelBackgrounds[currentLevel];
        document.getElementById('level-display').innerText = levelNames[currentLevel];
        document.getElementById('click-lv').innerText = coinsPerClick;
        
        // Calcola il livello dell'Auto-Miner per lo schermo
        document.getElementById('auto-lv').innerText = coinsPerSecond;

        // Gestisce la descrizione del livello in base a dove si era rimasti
        if (currentLevel === 2) {
            document.getElementById('next-level-desc').innerText = "Passa al livello 3 (Città Neon Spaziale)";
        } else if (currentLevel === 3) {
            document.getElementById('next-level-desc').innerText = "Passa al livello 4 (Dimensione Divina)";
        } else if (currentLevel === 4) {
            document.getElementById('next-level-desc').innerText = "Hai raggiunto il livello massimo!";
            document.getElementById('up-level-btn').style.display = 'none';
        }
    }
}

function clickCoin() {
    coins += coinsPerClick;
    updateUI();
    saveGame(); // Salva a ogni click
}

function buyUpgrade(type) {
    if (type === 'click' && coins >= upgradeClickCost) {
        coins -= upgradeClickCost;
        coinsPerClick += 1;
        upgradeClickCost = Math.round(upgradeClickCost * 1.5);
        document.getElementById('click-lv').innerText = coinsPerClick;
    } else if (type === 'auto' && coins >= upgradeAutoCost) {
        coins -= upgradeAutoCost;
        coinsPerSecond += 1;
        upgradeAutoCost = Math.round(upgradeAutoCost * 1.6);
        document.getElementById('auto-lv').innerText = coinsPerSecond;
    }
    updateUI();
    saveGame(); // Salva dopo un acquisto
}

function nextLevel() {
    if (coins >= upgradeLevelCost && currentLevel < 4) {
        coins -= upgradeLevelCost;
        currentLevel += 1;
        
        document.body.style.background = levelBackgrounds[currentLevel];
        document.getElementById('level-display').innerText = levelNames[currentLevel];
        
        if (currentLevel === 2) {
            upgradeLevelCost = 1000;
            document.getElementById('next-level-desc').innerText = "Passa al livello 3 (Città Neon Spaziale)";
        } else if (currentLevel === 3) {
            upgradeLevelCost = 5000;
            document.getElementById('next-level-desc').innerText = "Passa al livello 4 (Dimensione Divina)";
        } else if (currentLevel === 4) {
            document.getElementById('next-level-desc').innerText = "Hai raggiunto il livello massimo!";
            document.getElementById('up-level-btn').style.display = 'none';
        }
    }
    updateUI();
    saveGame(); // Salva dopo il passaggio di livello
}

// Guadagno automatico ogni secondo
setInterval(function() {
    if (coinsPerSecond > 0) {
        coins += coinsPerSecond;
        updateUI();
        saveGame(); // Salva i guadagni automatici ogni secondo
    }
}, 1000);

function updateUI() {
    document.getElementById('coins').innerText = coins;
    document.getElementById('cps-display').innerText = "Monete al secondo: " + coinsPerSecond;
    
    document.getElementById('up-click-btn').innerText = "Costo: " + upgradeClickCost;
    document.getElementById('up-click-btn').disabled = (coins < upgradeClickCost);

    document.getElementById('up-auto-btn').innerText = "Costo: " + upgradeAutoCost;
    document.getElementById('up-auto-btn').disabled = (coins < upgradeAutoCost);

    if (currentLevel < 4) {
        document.getElementById('up-level-btn').innerText = "Costo: " + upgradeLevelCost;
        document.getElementById('up-level-btn').disabled = (coins < upgradeLevelCost);
    }
}

// --- AVVIO DEL GIOCO ---
// 1. Carica i vecchi salvataggi (se esistono)
loadGame();
// 2. Aggiorna la grafica
updateUI();
