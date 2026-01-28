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

    async createGoogleUser(email: string, username: string, img: string) {
        const createUser = await db.insert(UserTable).values({
            username,
            email,
            img,
            authType: "GOOGLE",
            status: "VERIFIED"
        }).returning();
        return createUser[0];
    },

    async findUserViaCredentials(name: string, email: string) {
        const findUser = await db.select().from(UserTable).where(or(
            eq(UserTable.username, name),
            eq(UserTable.email, email)
        )).limit(1);

        const theUser = findUser[0];
        return theUser;
    },

    async linkUserWithCredentialsAndGoogle(email: string, username: string, img: string) {
        const linkedUser = await db.update(UserTable).set({
            email,
            username,
            img,
            authType: 'BOTH',
            status: 'VERIFIED'
        }).where(eq(UserTable.email, email)).returning();

        return linkedUser[0];
    },

    async createVerificationToken(userId: string, randomOTP: string, type: "EMAIL_VERIFICATION" | "PASSWORD_RESET") {
        const tokens = await db.insert(verificationTokenTable).values({
            userId,
            token: randomOTP,
            createdAt: new Date(),
            type,
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

    async verifyResetToken(resetToken: string) {
        const [getToken] = await db.select().from(verificationTokenTable).where(and(
            eq(verificationTokenTable.token, resetToken),
            eq(verificationTokenTable.type, 'PASSWORD_RESET'),
        ));

        return getToken;
    },

    async updatePassword(userId: string, password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        const [updatePassword] = await db.update(UserTable).set({
            password: hashPassword
        }).where(eq(UserTable.id, userId)).returning();

        return updatePassword;
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
            .where(
                eq(UserTable.email, email),
            )
            .limit(1);

        const user = users[0];

        return user;
    }
};
