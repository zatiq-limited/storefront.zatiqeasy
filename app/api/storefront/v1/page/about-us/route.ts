import { NextResponse } from "next/server";
import aboutUsData from "@/data/api-responses/about-us.json";

export async function GET() {
  return NextResponse.json(aboutUsData);
}