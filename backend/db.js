const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'database.json');

const defaultData = {
  users: [],
  progress: [],
  labs: [],
  quiz: [],
  preferences: {},
  userIdCounter: 1
};

function loadDB() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return { ...defaultData };
    }
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('读取数据库文件失败:', err.message);
    return { ...defaultData };
  }
}

function saveDB(data) {
  try {
    const tmpPath = dbFilePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, dbFilePath);
  } catch (err) {
    console.error('写入数据库文件失败:', err.message);
  }
}

let cache = loadDB();

const db = {
  getUsers: () => cache,
  save: () => saveDB(cache),
  reset: () => {
    cache = loadDB();
    return cache;
  },
  query: {
    users: () => cache.users,
    progress: () => cache.progress,
    labs: () => cache.labs,
    quiz: () => cache.quiz,
    preferences: () => cache.preferences
  },
  insertUser(user) {
    cache.users.push(user);
    saveDB(cache);
    return user;
  },
  findUserByUsername(username) {
    return cache.users.find((u) => u.username === username);
  },
  findUserById(id) {
    return cache.users.find((u) => u.id === id);
  },
  markDayComplete(userId, dayId, quizScore) {
    const existing = cache.progress.find(
      (p) => p.userId === userId && p.dayId === dayId
    );
    if (existing) return existing;
    const entry = { userId, dayId, completedAt: new Date().toISOString(), quizScore };
    cache.progress.push(entry);
    saveDB(cache);
    return entry;
  },
  getCompletedDays(userId) {
    return cache.progress.filter((p) => p.userId === userId);
  },
  markLabComplete(userId, labId) {
    const existing = cache.labs.find((l) => l.userId === userId && l.labId === labId);
    if (existing) return existing;
    const entry = { userId, labId, completedAt: new Date().toISOString() };
    cache.labs.push(entry);
    saveDB(cache);
    return entry;
  },
  getCompletedLabs(userId) {
    return cache.labs.filter((l) => l.userId === userId);
  },
  saveQuiz(userId, quizId, score) {
    const existing = cache.quiz.find((q) => q.userId === userId && q.quizId === quizId);
    const now = new Date().toISOString();
    if (existing) {
      existing.score = score;
      existing.completedAt = now;
    } else {
      cache.quiz.push({ userId, quizId, score, completedAt: now });
    }
    saveDB(cache);
  },
  getQuizResults(userId) {
    return cache.quiz.filter((q) => q.userId === userId);
  },
  setPreferences(userId, prefs) {
    const existing = cache.preferences[userId] || { current_day: 1, mode: 'full', last_study_date: '' };
    cache.preferences[userId] = { ...existing, ...prefs };
    saveDB(cache);
    return cache.preferences[userId];
  },
  getPreferences(userId) {
    return cache.preferences[userId] || { current_day: 1, mode: 'full', last_study_date: '' };
  },
  resetUserProgress(userId) {
    cache.progress = cache.progress.filter((p) => p.userId !== userId);
    cache.labs = cache.labs.filter((l) => l.userId !== userId);
    cache.quiz = cache.quiz.filter((q) => q.userId !== userId);
    cache.preferences[userId] = { current_day: 1, mode: 'full', last_study_date: '' };
    saveDB(cache);
  }
};

console.log(`数据库已初始化: ${dbFilePath}`);

module.exports = db;
