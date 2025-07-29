export class ApiCollection {
    constructor(
      public id: string,
      public name: string,
      public folderIds: string[] = [],
      public createdAt: number = Date.now()
    ) {}
  }