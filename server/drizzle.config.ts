import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    //where migrations will be stored
    out: './drizzle',
    //where our schema file resides
    schema: './src/db/schema',
    //which db we will be using
    dialect: 'postgresql',
    //url to that db
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    //will now show step by step code when doing migrations, pushing to the db etc (more output in terminal)
    verbose: true,
    //will warn us from generating migrations that could case data loss(security measure)
    strict: true
});
