import { NextResponse } from "next/server";
import { db } from "@/db";
import { wordsTable } from "@/db/schema";
import { userInputSchema } from "@/lib/defs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }

    let ip = req.headers.get("x-forwarded-for") || "Unknown IP";
    console.log("ip", ip);
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    const values = parsed.data.word
      .match(/\S+/g)
      ?.filter((value) => value)
      .map((value) => ({
        word: value,
        ip,
      }));

    if (!values)
      return NextResponse.json({ message: "Error" }, { status: 404 });

    await db.insert(wordsTable).values(values);

    return NextResponse.json(
      { message: "Word added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
