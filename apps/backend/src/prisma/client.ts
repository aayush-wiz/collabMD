import { PrismaClient } from "@prisma/client";
import { loadEnv } from "../env";

// Ensure env is loaded before Prisma initializes (controllers import prisma early).
loadEnv();

const prisma = new PrismaClient();

export default prisma;
