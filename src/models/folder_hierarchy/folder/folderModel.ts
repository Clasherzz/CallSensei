export class ApiFolder {
    constructor(
      public id: string,
      public name: string,
      public collectionId: string,
      public parentFolderId?: string,
      public requestIds: string[] = [],
      public subFolderIds: string[] = []
    ) {}
  }
  