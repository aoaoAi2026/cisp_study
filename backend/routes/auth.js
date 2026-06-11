const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production-please-very-long';
const JWT_EXPIRES = '30d';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

router.post('/register', (req, res) => {
  const { username, password, email } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码必填' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: '用户名至少3个字符' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少6个字符' });
  }

  try {
    const existing = db.findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: '用户名已存在' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = (db.query.users().length > 0
      ? Math.max(...db.query.users().map((u) => u.id))
      : 0) + 1;

    const user = {
      id: userId,
      username,
      email: email || null,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    };

    db.insertUser(user);
    db.setPreferences(userId, { current_day: 1, mode: 'full', last_study_date: '' });

    const token = generateToken(user);

    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: userId, username, email: email || null }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器内部错误', detail: err.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码必填' });
  }

  try {
    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(user);

    res.json({
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器内部错误', detail: err.message });
  }
});

router.get('/me', require('../middleware/auth'), (req, res) => {
  try {
    const user = db.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;
