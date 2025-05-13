import path from 'path';
import { fileURLToPath } from 'url';

// Only needed if using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 Current route path:', __dirname);



import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      type,
      description,
      color,
      openTime,
      closeTime,
      ownerId,
    } = body;

    const store = await prisma.store.create({
      data: {
        name,
        type,
        description,
        color,
        openTime,
        closeTime,
        owner: {
          connect: { id: ownerId }  // this line ensures the foreign key relationship is respected
        }
      }
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error('❌ Prisma error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
  }
}
