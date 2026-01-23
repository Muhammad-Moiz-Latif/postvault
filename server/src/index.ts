import express from 'express';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { UserTable } from './db/schema/users';



const app = express();
const db = drizzle(process.env.DATABASE_URL!);



app.get('/', (req, res) => {
    res.status(200).json("How are you doing?");
});

const PORT = 4000;


app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
})