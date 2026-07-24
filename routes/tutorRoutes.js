const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { tutorLimiter } = require('../middleware/rateLimit');
const { startSession, sendMessage, getSessions, getSessionById, startSessionFromImage, renameSession, deleteSession } = require('../controllers/tutorController');

router.delete('/sessions/:id', protect, deleteSession);
router.post('/start', protect, tutorLimiter, startSession);
router.post('/message', protect, tutorLimiter, sendMessage);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:id', protect, getSessionById);
router.post('/start-image', protect, tutorLimiter, startSessionFromImage);
router.patch('/sessions/:id', protect, renameSession);

module.exports = router;