import { NextResponse } from "next/server";
import contactUsData from "@/data/api-responses/contact-us.json";

export async function GET() {
  return NextResponse.json(contactUsData);
}