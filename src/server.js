import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => `Listening on port ${PORT}`);
