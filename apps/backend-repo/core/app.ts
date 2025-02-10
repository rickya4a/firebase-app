import express from 'express';
import cors from 'cors';
import userRoutes from '../routes/userRoutes';

const app = express();

// Configure CORS for development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', userRoutes);
app.post('/create-url', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

const PORT = process.env.PORT || 3000;

// Only listen directly if not running in Firebase Functions
if (process.env.NODE_ENV !== 'production' && !process.env.FUNCTIONS_EMULATOR) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;