const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

function getToday() {
  return new Date().toISOString().split('T')[0];
}

router.get('/all', (req, res) => {
  const userId = req.user.userId;
  try {
    const preferences = db.getPreferences(userId);
    const completedDays = db.getCompletedDays(userId).map((d) => ({
      dayId: d.dayId,
      completedAt: d.completedAt,
      quizScore: d.quizScore
    }));
    const completedLabs = db.getCompletedLabs(userId).map((l) => l.labId);
    const quizResultsRows = db.getQuizResults(userId);
    const quizResults = {};
    quizResultsRows.forEach((r) => {
      quizResults[r.quizId] = { score: r.score, date: r.completedAt };
    });

    let streak = 0;
    if (preferences.last_study_date) {
      const lastDate = new Date(preferences.last_study_date);
      const today = new Date(getToday());
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 1) {
        streak = completedDays.length;
      }
    }

    res.json({
      currentDay: preferences.current_day,
      mode: preferences.mode,
      streak,
      lastStudyDate: preferences.last_study_date || '',
      completedDays,
      completedLabs,
      quizResults
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '获取进度失败', detail: err.message });
  }
});

router.post('/day/:dayId/complete', (req, res) => {
  const userId = req.user.userId;
  const { dayId } = req.params;
  const { quizScore } = req.body || {};
  const today = getToday();

  try {
    db.markDayComplete(userId, dayId, quizScore || null);
    const dayNum = parseInt(dayId.replace('day-', ''), 10) || 0;
    const prefs = db.getPreferences(userId);
    const nextDay = Math.max(prefs.current_day || 1, dayNum + 1);
    db.setPreferences(userId, { current_day: nextDay, last_study_date: today });

    res.json({ success: true, currentDay: nextDay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存进度失败', detail: err.message });
  }
});

router.post('/lab/:labId/complete', (req, res) => {
  const userId = req.user.userId;
  const { labId } = req.params;
  try {
    db.markLabComplete(userId, labId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存实验进度失败', detail: err.message });
  }
});

router.post('/quiz/:quizId', (req, res) => {
  const userId = req.user.userId;
  const { quizId } = req.params;
  const { score } = req.body || {};
  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'score 必填' });
  }
  try {
    db.saveQuiz(userId, quizId, score);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存测验结果失败', detail: err.message });
  }
});

router.put('/preferences', (req, res) => {
  const userId = req.user.userId;
  const { currentDay, mode } = req.body || {};
  try {
    const updates = {};
    if (typeof currentDay === 'number') updates.current_day = currentDay;
    if (typeof mode === 'string') updates.mode = mode;
    const result = db.setPreferences(userId, updates);
    res.json({ success: true, preferences: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '更新偏好设置失败', detail: err.message });
  }
});

router.post('/reset', (req, res) => {
  const userId = req.user.userId;
  try {
    db.resetUserProgress(userId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '重置进度失败', detail: err.message });
  }
});

module.exports = router;
