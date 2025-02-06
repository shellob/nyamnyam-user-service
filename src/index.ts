import express from "express";
import userRoutes from './user.routes'

const app = express();
app.use(express.json());
app.use(userRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});
