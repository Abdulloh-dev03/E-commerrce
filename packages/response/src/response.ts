// packages/response/src/response.ts

type FrameworkResponse = any; 
type FrameworkContext = any;  

const defaultMessages: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

class Send {
  private static sendResponse(
    target: FrameworkResponse | FrameworkContext,
    status: number,
    message?: string,
    data?: any
  ) {
    const body: any = {
      status,
      message: message || defaultMessages[status] || "Unknown Status",
    };

    if (data !== undefined) body.data = data;

    // Fastify (best to detect first)
    if (typeof target.send === "function" && typeof target.status === "function") {
      return target.status(status).send(body);
    }

    // Express
    if (typeof target.status === "function" && typeof target.json === "function") {
      return target.status(status).json(body);
    }

    // Hono
    if (typeof target.json === "function" && typeof target.req === "object") {
      return target.json(body, status);
    }

    throw new Error("Unsupported response object");
  }

  static status200(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 200, message, data);
  }
  static status201(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 201, message, data);
  }

  static status400(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 400, message, data);
  }
  static status401(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 401, message, data);
  }
  static status403(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 403, message, data);
  }
  static status404(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 404, message, data);
  }

  static status500(res: FrameworkResponse, message?: string, data?: any) {
    return this.sendResponse(res, 500, message, data);
  }
}


export { Send };