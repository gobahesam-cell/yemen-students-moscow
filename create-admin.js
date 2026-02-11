const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();

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
    // Using generic create because Role enum might not be available in JS easily without typescript
    // Actually PrismaClient exports enums generally, but let's send string "ADMIN" which prisma usually accepts if it matches enum

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "Admin",
            passwordHash,
            role: "ADMIN",
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
