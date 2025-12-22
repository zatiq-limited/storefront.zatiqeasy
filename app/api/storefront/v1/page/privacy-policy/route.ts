import { NextResponse } from "next/server";
import privacyPolicyData from "@/data/api-responses/privacy-policy.json";

export async function GET() {
  return NextResponse.json(privacyPolicyData);
}