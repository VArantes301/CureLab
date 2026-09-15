const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const diaryRoutes = require('./routes/diary');
const achievementRoutes = require('./routes/achievement');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', userRoutes);
app.use('/users', diaryRoutes);
app.use('/users', achievementRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});