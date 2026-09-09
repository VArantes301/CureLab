const express = require('express');
const userRoutes = require('./routes/user');
const diaryRoutes = require('./routes/diary');
const path = require('path');
const app = express();

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/users', userRoutes);
app.use('/users', diaryRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})