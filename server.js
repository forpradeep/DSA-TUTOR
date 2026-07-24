require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tutor', require('./routes/tutorRoutes'));

app.get('/', (req, res) => res.send('DSA Tutor API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


