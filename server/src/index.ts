import express from 'express';
import 'dotenv/config';
import { router as authRoutes } from './modules/auth/auth.route';


const app = express();


//express middleware which parses incoming JSON data from req into json object and stored in req.body
app.use(express.json());


app.use("/api/auth", authRoutes);

const PORT = 4000;

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
});