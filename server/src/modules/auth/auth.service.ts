import { drizzle } from 'drizzle-orm/node-postgres';
import "dotenv/config";
import bcrypt from 'bcrypt';
import { and, eq, or } from 'drizzle-orm';
import { UserTable } from '../../db/schema/users';
import { verificationTokenTable } from '../../db/schema/verify.token';


const db = drizzle(process.env.DATABASE_URL!);

export const authService = {

    async createUserAccount(name: string, email: string, password: string, imgURL: string | null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = await db.insert(UserTable).values({
            username: name,
            email,
            password: hashedPassword,
            img: imgURL
        }).returning();
        return createUser;
    },

    async findUserViaCredentials(name: string, email: string) {
        const findUser = await db.select().from(UserTable).where(or(
            eq(UserTable.username, name),
            eq(UserTable.email, email)
        )).limit(1);

        const theUser = findUser[0];
        return theUser;
    },

    async createVerificationToken(userId: string, randomOTP: string) {
        const tokens = await db.insert(verificationTokenTable).values({
            userId,
            token: randomOTP,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) //15 minute's
        }).returning();

        const token = tokens[0];

        return token;
    },

    async verifyEmailToken(tokenId: string, otp: string) {
        const getToken = await db.select().from(verificationTokenTable).where(and(
            eq(verificationTokenTable.id, tokenId),
            eq(verificationTokenTable.token, otp)
        ));
        return getToken;
    },

    async getUserThroughEmailToken(tokenId: string) {
        const getTokenData = await db.select().from(verificationTokenTable).rightJoin(UserTable,
            eq(UserTable.id, tokenId)
        );

        const bothData = getTokenData[0];

        return bothData;
    },

    async updateUserAccount(userId: string) {
        const update = await db.update(UserTable).set({ status: 'VERIFIED' }).where(
            eq(UserTable.id, userId)
        ).returning();

        const updatedAccount = update[0];

        return updatedAccount;
    },

    async verifyUser(email: string) {
        const users = await db
            .select()
            .from(UserTable)
            .where(eq(UserTable.email, email))
            .limit(1);

        const user = users[0];

        return user;
    }
};
