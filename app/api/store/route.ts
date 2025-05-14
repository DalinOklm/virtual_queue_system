import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all stores
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: { ratings: true }, // include ratings or owner if needed
    });
    return NextResponse.json({ stores });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

// CREATE new store
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, type, description, color, openTime, closeTime, ownerId,
    } = body;

    const store = await prisma.store.create({
      data: {
        name, type, description, color, openTime, closeTime, ownerId,
      }
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
  }
}
