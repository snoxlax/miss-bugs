import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bugRoutes from './src/routes/bug.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import msgRoutes from './src/routes/msg.routes.js';
import { dbService } from './src/services/db.service.js';
import { getConfig } from './src/config/index.js';

const config = getConfig();

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.static('public'));

(async () => {
  try {
    await dbService.getCollection('bug'); // Test connection
    console.log('MongoDB connection initialized');
  } catch (err) {
    console.error('Failed to initialize MongoDB:', err);
  }
})();

app.use('/bugs', bugRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/msg', msgRoutes);

app.listen(config.app.port, () =>
  console.log(`Server ready at port ${config.app.port}`)
);
