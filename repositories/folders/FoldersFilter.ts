export default class FoldersFilter {
  ids?: number[];
  parentIds?: number[];
  userIds?: number[];
  onlyRoot?: boolean;

  constructor(filter?: FoldersFilter) {
    this.ids = filter?.ids;
    this.parentIds = filter?.parentIds;
    this.userIds = filter?.userIds;
    this.onlyRoot = filter?.onlyRoot;
  }
}
