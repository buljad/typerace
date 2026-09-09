/* ==========================================================
   TYPING RACER ENGINE // SPEED TYPING ARENA
   ========================================================== */

// Калиброванная база: Академгородок, Технопарк, факты из геймдева и IT (150–165 символов)
const RUSSIAN_LONG_QUOTES = [
  // ── Академгородок & Технопарк ──
  "Знаменитые наклонные башни Академпарка в Новосибирске называют в народе гусями, и именно там рождаются передовые космические приборы и мощный софт.",
  "В новосибирском Академгородке вековые сосны растут прямо между научными институтами и серверными стойками, создавая уникальную атмосферу для стартапов.",
  "Инженеры Академпарка разрабатывают уникальные датчики мониторинга воздуха и лазерные комплексы, доказывая мощь сибирской науки на мировом рынке технологий.",
  "Ученые сибирского отделения Академии наук проектируют сложные физические модели, пока резиденты технопарка обучают нейросети и тестируют умных дронов.",

  // ── Факты из индустрии игр ──
  "Легендарная компания Нинтендо была основана еще в конце девятнадцатого века и долгие десятилетия производила исключительно традиционные игральные карты.",
  "Знаменитый Тетрис советский программист Алексей Пажитнов разработал на скромном компьютере Электроника шестьдесят в вычислительном центре Академии наук.",
  "Культовую игру Дум энтузиасты умудрились запустить на микроволновке, калькуляторе, электронном тесте на беременность и даже на табло умного термостата.",
  "В оригинальной игре Пакман максимальный возможный счет составляет три миллиона триста тридцать три тысячи триста шестьдесят очков из-за бага на уровне.",

  // ── Факты из истории технологий ──
  "Первый в истории настоящий компьютерный баг был буквальным насекомым: ученые нашли мотылька, который застрял между контактами реле гарвардской машины.",
  "Первая в мире компьютерная мышь была бережно вырезана из цельного куска дерева Дугласом Энгельбартом и внутри нее крутились два металлических колесика.",
  "Первый в истории интернет-домен был зарегистрирован весной восемьдесят пятого года задолго до появления привычных сайтов и браузеров в глобальной сети.",
  "Создатель языка программирования Си Денис Ритчи и автор системы Линукс Линус Торвальдс создали фундамент, на котором сегодня держится весь интернет.",

  // ── Классический IT-юмор & Продакшен ──
  "Каждый раз, когда разработчики обещают сделать временный прототип на пару дней без тестов, на свет появляется система, которая проживет следующие десять лет.",
  "Главное правило деплоя гласит: если тебе кажется, что крошечное изменение ничего не сломает, именно оно уронит сервер в пятницу перед самым уходом домой."
];

const state = {
  playerNick: '',
  playerPass: '',
  targetText: '',
  lastQuoteIndex: -1,
  currentIndex: 0,
  errorsCount: 0,
  totalKeystrokes: 0,
  startTime: null,
  timerHandle: null,
  isRacing: false,
  soundEnabled: true,
  prevScreen: 'start',
  cachedDb: []
};

const screens = {
  start:       document.getElementById('screen-start'),
  race:        document.getElementById('screen-race'),
  result:      document.getElementById('screen-result'),
  leaderboard: document.getElementById('screen-leaderboard')
};

const playerNickInput = document.getElementById('player-nick');
const playerPassInput = document.getElementById('player-pass');
const userTip         = document.getElementById('user-tip');
const btnStart        = document.getElementById('btn-start');

const raceCar         = document.getElementById('race-car');
const textDisplay     = document.getElementById('text-display');
const typingContainer = document.getElementById('typing-box-container');
const hiddenInput     = document.getElementById('hidden-input');

const liveCpm         = document.getElementById('live-cpm');
const liveWpm         = document.getElementById('live-wpm');
const liveAcc         = document.getElementById('live-acc');
const liveTime        = document.getElementById('live-time');

const resPilotName    = document.getElementById('res-pilot-name');
const resRankTitle    = document.getElementById('result-rank-title');
const resCpm          = document.getElementById('res-cpm');
const resWpm          = document.getElementById('res-wpm');
const resAcc          = document.getElementById('res-acc');
const resTime         = document.getElementById('res-time');
const resErrors       = document.getElementById('res-errors');
const recordAlert     = document.getElementById('record-notification');

const btnChangeQuote  = document.getElementById('btn-change-quote');
const btnAgain        = document.getElementById('btn-again');
const btnOpenLb       = document.getElementById('btn-open-lb');
const btnShowLb       = document.getElementById('btn-show-lb');
const btnLbBack       = document.getElementById('btn-lb-back');
const btnLbClear      = document.getElementById('btn-lb-clear');
const lbBody          = document.getElementById('lb-body');
const lbEmpty         = document.getElementById('lb-empty');

const btnSound        = document.getElementById('btn-sound');
const btnHelp         = document.getElementById('btn-help');
const btnHelpClose    = document.getElementById('btn-help-close');
const modalHelp       = document.getElementById('modal-help');

// Аудиосинтезатор (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playKeyClick(isError = false) {
  if (!state.soundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (isError) {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } else {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620 + Math.random() * 180, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  }
}

function playWinSound() {
  if (!state.soundEnabled) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }, i * 90);
  });
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// Работа с лидербордом
async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('API offline');
    state.cachedDb = await res.json();
  } catch {
    state.cachedDb = JSON.parse(localStorage.getItem('typing_leaderboard_v3') || '[]');
  }
  return state.cachedDb;
}

async function commitLeaderboard(data) {
  state.cachedDb = data;
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.slice(0, 200))
    });
  } catch (e) {
    localStorage.setItem('typing_leaderboard_v3', JSON.stringify(data.slice(0, 200)));
  }
}

async function checkUserStatus() {
  const nick = playerNickInput.value.trim();
  if (!nick) {
    userTip.className = 'user-status-tip';
    userTip.textContent = 'Введите никнейм и пароль для сохранения результата';
    return null;
  }

  await fetchLeaderboard();
  const existing = state.cachedDb.find(e => e.handle.toLowerCase() === nick.toLowerCase());

  if (existing) {
    userTip.className = 'user-status-tip existing-user';
    userTip.textContent = `Никнейм зарегистрирован! Рекорд: ${existing.cpm} CPM. Введите пароль.`;
    return existing;
  } else {
    userTip.className = 'user-status-tip new-user';
    userTip.textContent = 'Новый никнейм! Придумайте пароль (до 20 символов) для защиты рекорда.';
    return false;
  }
}

playerNickInput.addEventListener('input', checkUserStatus);

btnStart.addEventListener('click', async () => {
  const nick = playerNickInput.value.trim();
  const pass = playerPassInput.value.trim();

  if (!nick) {
    playerNickInput.focus();
    userTip.className = 'user-status-tip error';
    userTip.textContent = 'Укажите никнейм!';
    return;
  }

  if (!pass) {
    playerPassInput.focus();
    userTip.className = 'user-status-tip error';
    userTip.textContent = 'Укажите пароль (до 20 символов)!';
    return;
  }

  const existingUser = await checkUserStatus();

  if (existingUser && existingUser.pass !== pass) {
    playerPassInput.focus();
    userTip.className = 'user-status-tip error';
    userTip.textContent = 'Неверный пароль для этого никнейма!';
    return;
  }

  state.playerNick = existingUser ? existingUser.handle : nick;
  state.playerPass = pass;
  startRaceSession();
});

// Случайный подбор фразы без повтора подряд
function getRandomQuote() {
  let newIdx;
  do {
    newIdx = Math.floor(Math.random() * RUSSIAN_LONG_QUOTES.length);
  } while (newIdx === state.lastQuoteIndex && RUSSIAN_LONG_QUOTES.length > 1);

  state.lastQuoteIndex = newIdx;
  return RUSSIAN_LONG_QUOTES[newIdx];
}

function startRaceSession() {
  state.targetText = getRandomQuote();
  state.currentIndex = 0;
  state.errorsCount = 0;
  state.totalKeystrokes = 0;
  state.startTime = null;
  state.isRacing = true;

  if (state.timerHandle) clearInterval(state.timerHandle);

  // Кнопка доступна до начала ввода
  btnChangeQuote.disabled = false;

  liveCpm.textContent = '0';
  liveWpm.textContent = '0';
  liveAcc.textContent = '100%';
  liveTime.textContent = '0.0с';
  raceCar.style.left = '0%';

  renderText();
  showScreen('race');
  hiddenInput.value = '';
  hiddenInput.focus();
}

function renderText() {
  textDisplay.innerHTML = '';
  state.targetText.split('').forEach((char, idx) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    if (idx === 0) span.classList.add('current');
    textDisplay.appendChild(span);
  });
}

function updateMetrics() {
  if (!state.startTime) return;
  const elapsedSeconds = (performance.now() - state.startTime) / 1000;
  liveTime.textContent = elapsedSeconds.toFixed(1) + 'с';

  if (elapsedSeconds > 0.4) {
    const cpm = Math.round((state.currentIndex / elapsedSeconds) * 60);
    liveCpm.textContent = cpm;
    liveWpm.textContent = Math.round(cpm / 5);

    const acc = state.totalKeystrokes > 0
      ? Math.max(0, Math.round(((state.totalKeystrokes - state.errorsCount) / state.totalKeystrokes) * 100))
      : 100;
    liveAcc.textContent = acc + '%';
  }
}

function handleCharacter(char) {
  if (!state.isRacing) return;

  // Момент начала заезда: запуск таймера и блокировка кнопки смены текста
  if (!state.startTime) {
    state.startTime = performance.now();
    btnChangeQuote.disabled = true;
    state.timerHandle = setInterval(updateMetrics, 100);
  }

  state.totalKeystrokes++;
  const spans = textDisplay.querySelectorAll('.char');
  const currentSpan = spans[state.currentIndex];

  if (char === state.targetText[state.currentIndex]) {
    playKeyClick(false);
    currentSpan.className = 'char correct';
    state.currentIndex++;

    const pct = (state.currentIndex / state.targetText.length) * 100;
    raceCar.style.left = pct + '%';

    if (state.currentIndex >= state.targetText.length) {
      finishRace();
      return;
    }

    spans[state.currentIndex].classList.add('current');
  } else {
    playKeyClick(true);
    state.errorsCount++;
    currentSpan.className = 'char incorrect current';
  }

  updateMetrics();
}

window.addEventListener('keydown', (e) => {
  if (!state.isRacing) return;
  if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].includes(e.key)) return;
  if (e.key === 'Backspace') { e.preventDefault(); return; }

  if (e.key.length === 1) {
    e.preventDefault();
    handleCharacter(e.key);
  }
});

typingContainer.addEventListener('click', () => hiddenInput.focus());

// Завершение заезда
async function finishRace() {
  state.isRacing = false;
  clearInterval(state.timerHandle);
  btnChangeQuote.disabled = true;
  playWinSound();

  const elapsed = Math.max(0.5, (performance.now() - state.startTime) / 1000);
  const finalCpm = Math.round((state.targetText.length / elapsed) * 60);
  const finalWpm = Math.round(finalCpm / 5);
  const accuracy = Math.max(0, Math.round(((state.totalKeystrokes - state.errorsCount) / state.totalKeystrokes) * 100));

  resPilotName.textContent = state.playerNick;
  resCpm.textContent = `${finalCpm} знаков/мин`;
  resWpm.textContent = `${finalWpm} WPM`;
  resAcc.textContent = `${accuracy}%`;
  resTime.textContent = `${elapsed.toFixed(1)} сек`;
  resErrors.textContent = state.errorsCount;

  const list = await fetchLeaderboard();
  const userIndex = list.findIndex(e => e.handle.toLowerCase() === state.playerNick.toLowerCase());

  if (userIndex === -1) {
    list.push({
      handle: state.playerNick,
      pass: state.playerPass,
      cpm: finalCpm,
      wpm: finalWpm,
      accuracy: accuracy,
      date: new Date().toLocaleDateString('ru-RU')
    });
    recordAlert.className = 'record-alert new-record';
    recordAlert.textContent = '🎉 Твой результат зафиксирован в общем зачете стенда!';
  } else {
    const prevBest = list[userIndex].cpm;
    if (finalCpm > prevBest) {
      list[userIndex].cpm = finalCpm;
      list[userIndex].wpm = finalWpm;
      list[userIndex].accuracy = accuracy;
      list[userIndex].date = new Date().toLocaleDateString('ru-RU');

      recordAlert.className = 'record-alert new-record';
      recordAlert.textContent = `🚀 Новый личный рекорд! Было: ${prevBest} CPM ➔ Стало: ${finalCpm} CPM!`;
    } else {
      recordAlert.className = 'record-alert keep-record';
      recordAlert.textContent = `Результат: ${finalCpm} CPM. Личный рекорд (${prevBest} CPM) остался защищен!`;
    }
  }

  list.sort((a, b) => b.cpm - a.cpm);
  await commitLeaderboard(list);

  const finalRank = list.findIndex(e => e.handle.toLowerCase() === state.playerNick.toLowerCase()) + 1;
  const totalCount = list.length;

  resRankTitle.className = 'rank-title';
  if (finalRank === 1) {
    resRankTitle.classList.add('rank-1');
    resRankTitle.textContent = `🥇 1-е место из ${totalCount} участников!`;
  } else if (finalRank === 2) {
    resRankTitle.classList.add('rank-2');
    resRankTitle.textContent = `🥈 2-е место из ${totalCount} участников!`;
  } else if (finalRank === 3) {
    resRankTitle.classList.add('rank-3');
    resRankTitle.textContent = `🥉 3-е место из ${totalCount} участников!`;
  } else {
    resRankTitle.classList.add('rank-general');
    resRankTitle.textContent = `🏁 ${finalRank}-е место из ${totalCount} участников`;
  }

  showScreen('result');
}

// Лидерборд
function rankSymbol(i) { return ['🥇', '🥈', '🥉'][i] ?? (i + 1); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function renderLeaderboard() {
  lbBody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);padding:24px">Загрузка данных…</td></tr>';
  lbEmpty.classList.add('hidden');
  const rows = await fetchLeaderboard();

  if (rows.length === 0) {
    lbBody.innerHTML = '';
    lbEmpty.classList.remove('hidden');
    return;
  }
  lbEmpty.classList.add('hidden');

  lbBody.innerHTML = rows.map((item, i) => `
    <tr class="${i < 3 ? 'rank-' + (i + 1) : ''}">
      <td>${rankSymbol(i)}</td>
      <td><b>${esc(item.handle)}</b></td>
      <td><span class="lb-score ${item.cpm >= 350 ? 'excellent' : 'good'}">${item.cpm}</span></td>
      <td>${item.wpm || Math.round(item.cpm / 5)}</td>
      <td>${item.accuracy}%</td>
      <td style="font-size:0.85rem;color:var(--muted)">${item.date}</td>
    </tr>
  `).join('');
}

async function openLeaderboard(from) {
  state.prevScreen = from;
  showScreen('leaderboard');
  await renderLeaderboard();
}

// Клик по «Поменять текст» работает только до начала тайпинга
btnChangeQuote.addEventListener('click', () => {
  if (!state.startTime) {
    startRaceSession();
  }
});

btnAgain.addEventListener('click', () => {
  checkUserStatus();
  showScreen('start');
});

btnOpenLb.addEventListener('click', () => openLeaderboard('start'));
btnShowLb.addEventListener('click', () => openLeaderboard('result'));
btnLbBack.addEventListener('click', () => showScreen(state.prevScreen));

btnLbClear.addEventListener('click', async () => {
  if (!confirm('Внимание! Это удалит все результаты участников. Очистить?')) return;
  await commitLeaderboard([]);
  localStorage.removeItem('typing_leaderboard_v3');
  renderLeaderboard();
});

btnSound.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
});

btnHelp.addEventListener('click', () => modalHelp.classList.remove('hidden'));
btnHelpClose.addEventListener('click', () => modalHelp.classList.add('hidden'));
modalHelp.addEventListener('click', e => {
  if (e.target === modalHelp) modalHelp.classList.add('hidden');
});

fetchLeaderboard();