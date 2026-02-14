import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();
        // Use .lean() for faster queries (returns plain JS objects, no Mongoose hydratation)
        // Limit to 10 most recent projects to prevent massive payload downloads
        const projects = await Project.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json(
            { success: true, data: projects },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                }
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const project = await Project.create(body);
        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
