const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://cogops.vercel.app"]
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("  CogOps DATABASE: SYNCHRONIZED"))
  .catch(err => console.error("DATABASE CONNECTION ERROR:", err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hire', require('./routes/hireRoutes')); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke in the Protocol!');
});

app.get('/', (req, res) => res.send("CogOps BACKEND PROTOCOL LIVE"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SYSTEM ONLINE: PORT ${PORT}`));