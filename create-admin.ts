import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "admin@ysm.local";
    const password = "Admin12345!";

    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("Upserting admin user...");
    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "Admin",
            passwordHash,
            role: Role.ADMIN,
        },
    });

    console.log("✅ Admin user is ready");
    console.log("Email:", admin.email);
    console.log("Password:", password);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
