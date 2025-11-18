import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bugRoutes from './src/routes/bug.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/bugs', bugRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Server ready at port ${port}`));
