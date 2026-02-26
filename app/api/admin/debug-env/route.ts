import { NextResponse } from "next/server";
import { ENV } from "../../../lib/env";

export async function GET() {
  // 仅允许开发环境或特定IP访问
  return NextResponse.json({
    environment: {
      ADMIN_EMAIL: ENV.ADMIN_EMAIL,
      ADMIN_EMAIL_SET: !!process.env.ADMIN_EMAIL,
      ADMIN_EMAIL_VALUE: process.env.ADMIN_EMAIL || "NOT_SET",
      ADMIN_PASSWORD_HASH_SET: !!process.env.ADMIN_PASSWORD_HASH,
      ADMIN_PASSWORD_HASH_LENGTH: process.env.ADMIN_PASSWORD_HASH?.length || 0,
      ADMIN_PASSWORD_HASH_STARTS_WITH_2B: process.env.ADMIN_PASSWORD_HASH?.startsWith("$2b$") || false,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
      NODE_ENV: ENV.NODE_ENV,
    },
    message: "This endpoint shows environment variable status. Remove this file in production!"
  });
}
