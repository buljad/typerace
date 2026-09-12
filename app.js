/* ==========================================================
   TYPING RACER ENGINE // SPEED TYPING ARENA
   Исправленная версия: безопасный коннект + Smart Attempts
   ========================================================== */

const RUSSIAN_LONG_QUOTES = [
  // ── Академгородок & Технопарк ──
  "Знаменитые наклонные башни Академпарка в Новосибирске называют в народе гусями, и именно там сегодня создаются передовые приборы и наукоемкий софт.",
  "В новосибирском Академгородке был создан один из первых в мире синхротронов, а сегодня здесь проектируют накопительное кольцо СКИФ для физики частиц.",
  "Ученые новосибирского Академгородка первыми в мире одомашнили диких лисиц, доказав прямую связь между поведением животных и генетическими мутациями.",
  
  // ── Факты из индустрии игр ──
  "Легендарная компания Нинтендо была основана еще в конце девятнадцатого века и долгие десятилетия производила исключительно традиционные игральные карты.",
  "Знаменитый Тетрис советский программист Алексей Пажитнов разработал на скромном компьютере Электроника шестьдесят в вычислительном центре Академии наук.",
  "Культовую игру Дум энтузиасты умудрились запустить на микроволновке, калькуляторе, электронном тесте на беременность и даже на табло умного термостата.",
  "В оригинальной игре Пакман максимальный возможный счет составляет три миллиона триста тридцать три тысячи триста шестьдесят очков из-за бага на уровне.",
  "Знаменитый крипер из Майнкрафта появился из-за банальной ошибки разработчика, который случайно перепутал высоту и длину модели свиньи в коде игры.",
  "Изначально в первой части ГТА полиция вела себя мирно, но программный сбой заставил патрульные машины безумно таранить игрока и создал культовую механику.",
  "Первая консоль Плейстейшн создавалась как дисковый привод для Нинтендо, но после разрыва контракта компания Сони выпустила ее как отдельную систему.",
  "Японский аркадный хит Спейс Инвейдерс был настолько популярным, что вызвал временный дефицит монет номиналом сто иен по всей стране в семидесятых годах.",

  // ── Факты из истории технологий ──
  "Первый в истории настоящий компьютерный баг был буквальным насекомым: ученые нашли мотылька, который застрял между контактами реле гарвардской машины.",
  "Первая в мире компьютерная мышь была бережно вырезана из цельного куска дерева Дугласом Энгельбартом и внутри нее крутились два металлических колесика.",
  "Первый в истории интернет-домен был зарегистрирован весной восемьдесят пятого года задолго до появления привычных сайтов и браузеров в глобальной сети.",
  "Создатель языка программирования Си Денис Ритчи и автор системы Линукс Линус Торвальдс создали фундамент, на котором сегодня держится весь интернет.",
  "Бортовой компьютер лунной миссии Аполлон одиннадцать обладал меньшей вычислительной мощностью и объемом памяти, чем самый дешевый современный калькулятор.",
  "Термин спам обязан своему появлению навязчивой рекламе мясных консервов, которую высмеяла британская комик-группа Монти Пайтон в своем знаменитом скетче.",
  "Первый в истории коммерческий жесткий диск весил больше тонны и вмещал всего около пяти мегабайт данных на пятидесяти гигантских металлических пластинах.",
  "На протяжении двадцати лет секретный код для запуска всех ядерных ракет Соединенных Штатов Америки состоял исключительно из восьми нулей ради скорости ввода.",

  // ── Классический IT-юмор & Продакшен ──
  "Архитектура любого масштабного проекта выглядит безупречно ровно до тех пор, пока в нее не вмешиваются реальные бизнес требования и внезапные правки клиентов.",
  "Каждый раз, когда разработчики обещают сделать временный прототип на пару дней без тестов, на свет появляется система, которая проживет следующие десять лет.",
  "Главное правило деплоя гласит: если тебе кажется, что крошечное изменение ничего не сломает, именно оно уронит сервер в пятницу перед самым уходом домой.",
  "В компьютерных науках есть две сложные задачи: инвалидация кэша, правильный выбор имен для переменных и внезапная ошибка на единицу в граничном условии.",
  "Хороший программист часами думает над тем, как решить рутинную задачу за пару минут, чтобы потом целую неделю исправлять скрытые баги в написанном скрипте.",
  "Когда на продакшене все неожиданно работает гладко и без единой ошибки, опытный системный администратор начинает тревожно проверять логи и сетевые пакеты."
];

const state = {
  playerNick: '',
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

// DOM элементы
const screens = {
  start:       document.getElementById('screen-start'),
  race:        document.getElementById('screen-race'),
  result:      document.getElementById('screen-result'),
  leaderboard: document.getElementById('screen-leaderboard')
};

const playerNickInput = document.getElementById('player-nick');
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
  Object.values(screens).forEach(s => {
    if (s) s.classList.remove('active');
  });
  if (screens[name]) screens[name].classList.add('active');
}

// ── Безопасный парсинг сущностей лидерборда ───────────────
function getItemNick(item) {
  if (!item) return '';
  return String(item.handle || item.name || item.nick || '').trim();
}

function getItemScore(item) {
  if (!item) return 0;
  return Number(item.cpm ?? item.score ?? item.totalScore ?? 0);
}

// Извлечение корня никнейма (срезает любые _2, _3, _2_2 на конце)
function getBaseNick(rawNick) {
  if (!rawNick || typeof rawNick !== 'string') return '';
  const cleaned = rawNick.trim().replace(/(_\d+)+$/i, '').trim();
  return cleaned || rawNick.trim();
}

// Поиск следующего свободного имени вида nick_2, nick_3 без цепочек _2_2
function getNextAvailableNick(rawNick, existingList) {
  const base = getBaseNick(rawNick);
  const escapeBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapeBase}(_(\\d+))?$`, 'i');

  let maxNum = 1;
  let baseFound = false;

  existingList.forEach(item => {
    const nick = getItemNick(item);
    const match = nick.match(regex);
    if (match) {
      if (!match[2]) {
        baseFound = true;
      } else {
        const num = parseInt(match[2], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  });

  if (!baseFound && maxNum === 1) {
    return base;
  }
  return `${base}_${maxNum + 1}`;
}

// ── Работа с бэкендом и локальным кэшем ──────────────────
async function fetchLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('API unavailable');
    const text = await res.text();
    const data = text && text.trim() ? JSON.parse(text) : [];
    if (Array.isArray(data)) {
      state.cachedDb = data;
      localStorage.setItem('typing_leaderboard_stable', JSON.stringify(data));
    }
  } catch {
    state.cachedDb = JSON.parse(localStorage.getItem('typing_leaderboard_stable') || '[]');
  }
  return state.cachedDb;
}

async function commitLeaderboard(data) {
  state.cachedDb = data;
  const payload = data.slice(0, 200);
  localStorage.setItem('typing_leaderboard_stable', JSON.stringify(payload));
  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Сервер недоступен, результат сохранен локально:', e);
  }
}

// Проверка уникальности никнейма с кликабельной подсказкой
async function checkUserStatus() {
  if (!playerNickInput || !userTip) return false;
  const raw = playerNickInput.value.trim();
  if (!raw) {
    userTip.className = 'user-status-tip';
    userTip.textContent = 'Никнейм должен быть уникальным';
    return false;
  }

  await fetchLeaderboard();
  const lower = raw.toLowerCase();
  const existing = state.cachedDb.find(e => getItemNick(e).toLowerCase() === lower);

  if (existing) {
    const bestScore = getItemScore(existing);
    const nextAvailable = getNextAvailableNick(raw, state.cachedDb);

    userTip.className = 'user-status-tip error';
    userTip.innerHTML = `Занят (${bestScore} CPM). Жми для выбора: <b id="suggested-nick-btn" style="cursor:pointer; text-decoration:underline; color:var(--gold); padding:2px 6px; background:rgba(250,204,21,0.15); border-radius:6px;">${nextAvailable}</b>`;

    const suggestBtn = document.getElementById('suggested-nick-btn');
    if (suggestBtn) {
      suggestBtn.onclick = () => {
        playerNickInput.value = nextAvailable;
        checkUserStatus();
        playerNickInput.focus();
      };
    }
    return false;
  } else {
    userTip.className = 'user-status-tip new-user';
    userTip.textContent = 'Никнейм свободен! Можно начинать заезд.';
    return true;
  }
}

if (playerNickInput) {
  playerNickInput.addEventListener('input', checkUserStatus);
  playerNickInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && btnStart) btnStart.click();
  });
}

if (btnStart) {
  btnStart.addEventListener('click', async () => {
    const nick = playerNickInput.value.trim();
    if (!nick) {
      playerNickInput.focus();
      if (userTip) {
        userTip.className = 'user-status-tip error';
        userTip.textContent = 'Введи никнейм для участия!';
      }
      return;
    }

    const isAvailable = await checkUserStatus();
    if (!isAvailable) {
      playerNickInput.focus();
      return;
    }

    state.playerNick = nick;
    startRaceSession();
  });
}

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

  if (btnChangeQuote) btnChangeQuote.disabled = false;
  if (liveCpm) liveCpm.textContent = '0';
  if (liveWpm) liveWpm.textContent = '0';
  if (liveAcc) liveAcc.textContent = '100%';
  if (liveTime) liveTime.textContent = '0.0с';
  if (raceCar) raceCar.style.left = '0%';

  renderText();
  showScreen('race');
  if (hiddenInput) {
    hiddenInput.value = '';
    hiddenInput.focus();
  }
}

function renderText() {
  if (!textDisplay) return;
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
  if (liveTime) liveTime.textContent = elapsedSeconds.toFixed(1) + 'с';

  if (elapsedSeconds > 0.4) {
    const cpm = Math.round((state.currentIndex / elapsedSeconds) * 60);
    const wpm = Math.round(cpm / 5);
    if (liveCpm) liveCpm.textContent = cpm;
    if (liveWpm) liveWpm.textContent = wpm;

    const acc = state.totalKeystrokes > 0
      ? Math.max(0, Math.round(((state.totalKeystrokes - state.errorsCount) / state.totalKeystrokes) * 100))
      : 100;
    if (liveAcc) liveAcc.textContent = acc + '%';
  }
}

function handleCharacter(char) {
  if (!state.isRacing) return;

  if (!state.startTime) {
    state.startTime = performance.now();
    if (btnChangeQuote) btnChangeQuote.disabled = true;
    state.timerHandle = setInterval(updateMetrics, 100);
  }

  state.totalKeystrokes++;
  const spans = textDisplay.querySelectorAll('.char');
  const currentSpan = spans[state.currentIndex];

  if (char === state.targetText[state.currentIndex]) {
    playKeyClick(false);
    if (currentSpan) currentSpan.className = 'char correct';
    state.currentIndex++;

    const pct = (state.currentIndex / state.targetText.length) * 100;
    if (raceCar) raceCar.style.left = pct + '%';

    if (state.currentIndex >= state.targetText.length) {
      finishRace();
      return;
    }

    if (spans[state.currentIndex]) spans[state.currentIndex].classList.add('current');
  } else {
    playKeyClick(true);
    state.errorsCount++;
    if (currentSpan) currentSpan.className = 'char incorrect current';
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

if (typingContainer && hiddenInput) {
  typingContainer.addEventListener('click', () => hiddenInput.focus());
}

async function finishRace() {
  state.isRacing = false;
  if (state.timerHandle) clearInterval(state.timerHandle);
  if (btnChangeQuote) btnChangeQuote.disabled = true;
  playWinSound();

  const elapsed = Math.max(0.5, (performance.now() - state.startTime) / 1000);
  const finalCpm = Math.round((state.targetText.length / elapsed) * 60);
  const finalWpm = Math.round(finalCpm / 5);
  const accuracy = Math.max(0, Math.round(((state.totalKeystrokes - state.errorsCount) / state.totalKeystrokes) * 100));

  if (resPilotName) resPilotName.textContent = state.playerNick;
  if (resCpm) resCpm.textContent = `${finalCpm} знаков/мин`;
  if (resWpm) resWpm.textContent = `${finalWpm} WPM`;
  if (resAcc) resAcc.textContent = `${accuracy}%`;
  if (resTime) resTime.textContent = `${elapsed.toFixed(1)} сек`;
  if (resErrors) resErrors.textContent = state.errorsCount;

  const list = await fetchLeaderboard();
  const newEntry = {
    handle: state.playerNick.trim(),
    cpm: finalCpm,
    wpm: finalWpm,
    accuracy: accuracy,
    date: new Date().toLocaleDateString('ru-RU')
  };

  list.push(newEntry);
  list.sort((a, b) => getItemScore(b) - getItemScore(a));
  await commitLeaderboard(list);

  if (recordAlert) {
    recordAlert.className = 'record-alert new-record';
    recordAlert.textContent = '🎉 Твой результат успешно зафиксирован в лидерборде!';
  }

  const finalRank = list.indexOf(newEntry) + 1;
  const totalCount = list.length;

  if (resRankTitle) {
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
  }

  showScreen('result');
}

function rankSymbol(i) { return ['🥇', '🥈', '🥉'][i] ?? (i + 1); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

async function renderLeaderboard() {
  if (!lbBody) return;
  lbBody.innerHTML = '<tr><td colspan="6" style="color:var(--muted);padding:24px">Загрузка данных…</td></tr>';
  if (lbEmpty) lbEmpty.classList.add('hidden');
  const rows = await fetchLeaderboard();

  if (!rows || rows.length === 0) {
    lbBody.innerHTML = '';
    if (lbEmpty) lbEmpty.classList.remove('hidden');
    return;
  }
  if (lbEmpty) lbEmpty.classList.add('hidden');

  lbBody.innerHTML = rows.map((item, i) => {
    const nick = getItemNick(item);
    const cpm = getItemScore(item);
    const wpm = item.wpm || Math.round(cpm / 5);
    const acc = item.accuracy !== undefined ? item.accuracy + '%' : '100%';
    const date = item.date || '—';

    return `
      <tr class="${i < 3 ? 'rank-' + (i + 1) : ''}">
        <td>${rankSymbol(i)}</td>
        <td><b>${esc(nick)}</b></td>
        <td><span class="lb-score ${cpm >= 350 ? 'excellent' : 'good'}">${cpm}</span></td>
        <td>${wpm}</td>
        <td>${acc}</td>
        <td style="font-size:0.85rem;color:var(--muted)">${date}</td>
      </tr>
    `;
  }).join('');
}

async function openLeaderboard(from) {
  state.prevScreen = from;
  showScreen('leaderboard');
  await renderLeaderboard();
}

if (btnChangeQuote) {
  btnChangeQuote.addEventListener('click', () => {
    if (!state.startTime) startRaceSession();
  });
}

if (btnAgain) {
  btnAgain.addEventListener('click', () => {
    if (playerNickInput) playerNickInput.value = '';
    checkUserStatus();
    showScreen('start');
  });
}

if (btnOpenLb) btnOpenLb.addEventListener('click', () => openLeaderboard('start'));
if (btnShowLb) btnShowLb.addEventListener('click', () => openLeaderboard('result'));
if (btnLbBack) btnLbBack.addEventListener('click', () => showScreen(state.prevScreen));

if (btnLbClear) {
  btnLbClear.addEventListener('click', async () => {
    if (!confirm('Внимание! Это очистит все результаты участников. Продолжить?')) return;
    await commitLeaderboard([]);
    localStorage.removeItem('typing_leaderboard_stable');
    renderLeaderboard();
  });
}

if (btnSound) {
  btnSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
  });
}

if (btnHelp && modalHelp) {
  btnHelp.addEventListener('click', () => modalHelp.classList.remove('hidden'));
}
if (btnHelpClose && modalHelp) {
  btnHelpClose.addEventListener('click', () => modalHelp.classList.add('hidden'));
}
if (modalHelp) {
  modalHelp.addEventListener('click', (e) => {
    if (e.target === modalHelp) modalHelp.classList.add('hidden');
  });
}

// Первоначальная загрузка
fetchLeaderboard();