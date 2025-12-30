import { NextResponse } from "next/server";
import themeData from "@/data/api-responses/theme.json";

export async function GET() {
  return NextResponse.json(themeData);
}