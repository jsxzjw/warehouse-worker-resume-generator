import { NextRequest } from "next/server";

// ==================== 类型定义 ====================
interface SaveResumeRequest {
  email: string;
  name: string;
  resume: string;
  template: "modern" | "classic" | "professional";
  experience?: any[];
  education?: any[];
  skills?: string[];
}

interface SaveResumeResponse {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
  data?: any;
}

// ==================== 错误处理 ====================
function createErrorResponse(message: string, status: number): Response {
  console.error("[Resume Save Error]", message);

  return new Response(JSON.stringify({
    success: false,
    error: message
  }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

// ==================== 主 API 路由 ====================
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 解析请求体
    let body: SaveResumeRequest;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse("Invalid request body", 400);
    }

    // 验证必需字段
    if (!body.email || !body.name || !body.resume) {
      return createErrorResponse(
        "Missing required fields: email, name, and resume are required",
        400
      );
    }

    // 验证邮箱格式
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(body.email)) {
      return createErrorResponse("Invalid email address", 400);
    }

    // 创���简历记录
    const resumeId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // TODO: 在实际生产环境中，这里应该：
    // 1. 保存到数据库 (PostgreSQL, MongoDB, etc.)
    // 2. 使用 ORM 或数据库客户端
    // 3. 示例代码：
    //
    // await db.resumes.create({
    //   id: resumeId,
    //   email: body.email,
    //   name: body.name,
    //   resume: body.resume,
    //   template: body.template,
    //   experience: body.experience,
    //   education: body.education,
    //   skills: body.skills,
    //   createdAt: new Date()
    // });

    // 临时：保存到 localStorage（仅用于演示）
    const resumeData = {
      id: resumeId,
      email: body.email,
      name: body.name,
      resume: body.resume,
      template: body.template,
      experience: body.experience,
      education: body.education,
      skills: body.skills,
      createdAt: new Date().toISOString()
    };

    // 记录到控制台（演示用）
    console.log("[Resume Saved]", JSON.stringify(resumeData, null, 2));

    // 保存到浏览器的 localStorage 会在客户端处理
    // 这里返回简历数据供客户端保存

    const response: SaveResumeResponse = {
      success: true,
      id: resumeId,
      message: "Resume saved successfully",
      data: resumeData
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Resume-ID": resumeId
      }
    });

  } catch (error: unknown) {
    console.error("[Resume Save API Error]", error);

    return createErrorResponse(
      "Failed to save resume. Please try again.",
      500
    );
  }
}

// ==================== GET 路由 - 检索保存的简历 ====================
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email parameter is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // TODO: 从数据库检索用户的简历
    // 示例代码：
    //
    // const resumes = await db.resumes.findMany({
    //   where: { email },
    //   orderBy: { createdAt: 'desc' }
    // });

    // 临时：返回空数组（演示用）
    const resumes: any[] = [];

    return new Response(JSON.stringify({
      success: true,
      resumes,
      count: resumes.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    console.error("[Resume Get API Error]", error);

    return new Response(JSON.stringify({
      success: false,
      error: "Failed to retrieve resumes"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
