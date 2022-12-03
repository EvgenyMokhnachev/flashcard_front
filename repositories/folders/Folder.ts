export default class Folder {
  id?: number;
  name?: string;
  parentId?: number;
  userId?: number;

  constructor(data?: Folder) {
    this.id = data?.id;
    this.name = data?.name;
    this.parentId = data?.parentId;
    this.userId = data?.userId;
  }
}
