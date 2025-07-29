export class ApiRequest {
    constructor(
      public id: string,
      public name: string,
      public method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      public url: string,
      public headers: Record<string, string> = {},
      public body?: string,
      public params?: Record<string, string>,
      public createdAt: number = Date.now(),
      public folderId?: string
    ) {}
  }