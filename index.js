const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
