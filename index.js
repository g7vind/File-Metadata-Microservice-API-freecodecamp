const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const storage = multer.memoryStorage();
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
// multer ships no default fileSize limit: without this option every request
// body is buffered in memory, whatever its size.
const upload = multer({ storage: storage, limits: { fileSize: MAX_UPLOAD_BYTES } });

// Reject a body that declares itself oversized before multer reads it.
const rejectOversize = (req, res, next) => {
    const declared = Number(req.headers['content-length']);
    if (Number.isFinite(declared) && declared > MAX_UPLOAD_BYTES + 65536) {
        return res.status(413).json({ error: 'File too large; the limit is 5 MB.' });
    }
    next();
};

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/api/fileanalyse', rejectOversize, upload.single('upfile'), (req, res) => {
    res.json({
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large; the limit is 5 MB.' });
    }
    next(err);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
