import express from 'express';
import cors from 'cors';
import groupRouter from './routers/groupRouter.js';
import AuthRouter from './routers/AuthRouter.js';
import movieRouter from './routers/movieRouter.js';
import AccountDeletionRouter from './routers/AccountDeletionRouter.js';
import ReviewRouter from './routers/ReviewRouter.js';
import GroupMemRouter from './routers/GroupMemRouter.js';
import MyGroupsRouter from './routers/MyGroupsRouter.js';
import favoritesRouter from './routers/favoritesRouter.js'
import GroupShareRouter from './routers/GroupShareRouter.js';

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', groupRouter);
app.use('/', AuthRouter);
app.use('/', AccountDeletionRouter);
app.use('/', ReviewRouter);
app.use('/movie', movieRouter)
app.use('/', GroupMemRouter);
app.use('/', MyGroupsRouter);
app.use('/', favoritesRouter);
app.use('/', GroupShareRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
