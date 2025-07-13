import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks, users } from "@/drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import type { User } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Get the local user ID first
    const user = await db.select().from(users).where(eq(users.auth0Id, session.user.sub)).get();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let userTasks;
    if (startDate && endDate) {
      userTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.id), // Use local user ID
            gte(tasks.date, startDate),
            lte(tasks.date, endDate)
          )
        );
    } else {
      userTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, user.id)); // Use local user ID
    }

    // console.log('Fetched tasks:', userTasks); // Add logging
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

    // Get or create user first
    let user = await db.select().from(users).where(eq(users.auth0Id, session.user.sub)).get();

    if (!user) {
      const userId = crypto.randomUUID();
      const newUser: User = {
        id: userId,
        auth0Id: session.user.sub,
        email: session.user.email ?? '',
        name: session.user.name ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await db.insert(users).values(newUser);
      user = newUser;
    }

    const body = await request.json();
    const taskId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newTask = {
      id: taskId,
      userId: user.id, // Use the local user ID, not the Auth0 ID
      title: body.title,
      description: body.description ?? null,
      date: body.date,
      completed: body.completed ?? false,
      color: body.color ?? '#3B82F6',
      position: body.position ?? 0,
      parentTaskId: body.parentTaskId ?? null,
      isRecurring: body.isRecurring ?? false,
      recurringPattern: body.recurringPattern ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(tasks).values(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");
    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const body = await request.json();
    // Remove userId from updates to prevent foreign key issues
    const { ...updateData } = body;
    const updates = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Get the local user ID first
    const user = await db.select().from(users).where(eq(users.auth0Id, session.user.sub)).get();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db
      .update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");
    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Get the local user ID first
    const user = await db.select().from(users).where(eq(users.auth0Id, session.user.sub)).get();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
