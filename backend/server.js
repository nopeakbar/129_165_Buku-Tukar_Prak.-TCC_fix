// import 'dotenv/config'
// import './models/index.js';           // ❗ register semua association
// import express from 'express';
// import cors from 'cors';
// import { sequelize } from './models/index.js';
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import bookRoutes from './routes/bookRoutes.js';
// import exchangeRoutes from './routes/exchangeRoutes.js';
// import exchangeHitoryRoutes from './routes/exchangeHitoryRoutes.js'
// import protectedRoutes from './routes/protectedRoutes.js';

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/exchanges', exchangeRoutes);
// app.use('/api/exchanges/history', exchangeHitoryRoutes);
// app.use('/api', protectedRoutes);

// app.get('/', (_req, res) => res.send('Welcome API'));

// sequelize.sync().then(() => {
//   console.log('✅ Database connected...');
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// });

// // sequelize.sync({ alter: true });





import 'dotenv/config'
import './models/index.js';           // ❗ register semua association
import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import exchangeHitoryRoutes from './routes/exchangeHitoryRoutes.js'
import protectedRoutes from './routes/protectedRoutes.js';

const app = express();
const PORT = process.env.PORT || 5010;

// Simple CORS configuration - this should work
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://exchange-book-dot-xenon-axe-450704-n3.uc.r.appspot.com/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/exchanges/history', exchangeHitoryRoutes);
app.use('/api', protectedRoutes);

app.get('/', (_req, res) => res.send('Welcome API'));

sequelize.sync().then(() => {
  console.log('✅ Database connected...');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// sequelize.sync({ alter: true });