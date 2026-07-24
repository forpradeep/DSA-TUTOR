const Session = require('../models/Session');
const { getTutorReply, extractProblemFromImage } = require('../utils/geminiClient');

// POST /api/tutor/start
const startSession = async (req, res) => {
  try {
    const { problemText } = req.body;
    if (!problemText) {
      return res.status(400).json({ message: 'problemText is required' });
    }
    if (problemText.length > 3000) {
      return res.status(400).json({ message: 'Problem text too long (max 3000 characters)' });
    }

    const session = await Session.create({
  userId: req.userId,
  title: problemText.slice(0, 50),
  problemText,
  conversationHistory: [{ role: 'user', content: problemText }]
});

    const reply = await getTutorReply(session.conversationHistory, session.hintCount + 1);

    session.hintCount += 1;
    session.conversationHistory.push({ role: 'model', content: reply });
    await session.save();

    res.status(201).json({ sessionId: session._id, reply, hintCount: session.hintCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tutor/message
const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ message: 'sessionId and message are required' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ message: 'Message too long (max 1000 characters)' });
    }

    const session = await Session.findOne({ _id: sessionId, userId: req.userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.conversationHistory.push({ role: 'user', content: message });
    session.hintCount += 1;

    const reply = await getTutorReply(session.conversationHistory, session.hintCount);

    session.conversationHistory.push({ role: 'model', content: reply });
    if (session.hintCount >= 5) session.skeletonProvided = true;
    await session.save();

    res.json({ reply, hintCount: session.hintCount, skeletonProvided: session.skeletonProvided });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tutor/sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId })
      .select(' title problemText createdAt hintCount')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tutor/sessions/:id
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tutor/start-image
const startSessionFromImage = async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
      return res.status(400).json({ message: 'image and mimeType are required' });
    }

    const problemText = await extractProblemFromImage(image, mimeType);
    if (!problemText) {
      return res.status(400).json({ message: 'Could not read a problem from that image' });
    }

    const session = await Session.create({
  userId: req.userId,
  title: problemText.slice(0, 50),
  problemText,
  conversationHistory: [{ role: 'user', content: problemText }]
});

    const reply = await getTutorReply(session.conversationHistory, session.hintCount + 1);

    session.hintCount += 1;
    session.conversationHistory.push({ role: 'model', content: reply });
    await session.save();

    res.status(201).json({ sessionId: session._id, problemText, reply, hintCount: session.hintCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// PATCH /api/tutor/sessions/:id
const renameSession = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'title is required' });
    }
    if (title.length > 80) {
      return res.status(400).json({ message: 'Title too long (max 80 characters)' });
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title: title.trim() },
      { returnDocument: 'after' }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ _id: session._id, title: session.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// DELETE /api/tutor/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



module.exports = { startSession, sendMessage, getSessions, getSessionById, startSessionFromImage, renameSession, deleteSession };