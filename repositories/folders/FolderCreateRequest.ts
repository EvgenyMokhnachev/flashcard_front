export default class FolderCreateRequest {
  name: string;
  parentId?: number;

  constructor(data: FolderCreateRequest) {
    this.name = data.name;
    this.parentId = data.parentId;
  }
}
