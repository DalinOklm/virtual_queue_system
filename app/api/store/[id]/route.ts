import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET store by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: { ratings: true },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    return NextResponse.json({ error: 'Error retrieving store' }, { status: 500 });
  }
}

// UPDATE store
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();

    const updated = await prisma.store.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update store' }, { status: 500 });
  }
}

// DELETE store
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.store.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Store deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 });
  }
}
