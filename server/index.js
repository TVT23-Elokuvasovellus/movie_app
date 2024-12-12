import express from 'express';
import cors from 'cors';
import groupRouter from './routers/group-router.js';
import authRouter from './routers/auth-router.js';
import movieRouter from './routers/movie-router.js';
import accountDeletionRouter from './routers/account-deletion-router.js';
import reviewRouter from './routers/review-router.js';
import groupMemRouter from './routers/group-mem-router.js';
import myGroupsRouter from './routers/my-groups-router.js';
import favoritesRouter from './routers/favorites-router.js'
import groupShareRouter from './routers/group-share-router.js';
import userInfoRouter from './routers/user-info-router.js';

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/ping', (req, res) => {
  console.log('Ping received:', req.body.message);
  res.sendStatus(200);
});

app.use('/', groupRouter);
app.use('/', authRouter);
app.use('/', accountDeletionRouter);
app.use('/', reviewRouter);
app.use('/movie', movieRouter)
app.use('/', groupMemRouter);
app.use('/', myGroupsRouter);
app.use('/', favoritesRouter);
app.use('/', groupShareRouter);
app.use('/api', userInfoRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
