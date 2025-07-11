import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let userTasks;
    if (startDate && endDate) {
      userTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, session.user.sub),
            gte(tasks.date, startDate),
            lte(tasks.date, endDate)
          )
        );
    } else {
      userTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, session.user.sub));
    }
    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newTask = {
      id: crypto.randomUUID(),
      userId: session.user.sub,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(tasks).values(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
