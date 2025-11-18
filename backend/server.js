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
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());

app.use('/bugs', bugRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(3030, () => console.log('Server ready at port 3030'));
