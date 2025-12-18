import { NextResponse } from "next/server";
import homepageData from "@/data/api-responses/homepage.json";

export async function GET() {
  return NextResponse.json(homepageData);
}
