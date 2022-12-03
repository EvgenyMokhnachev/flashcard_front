export default class FoldersFilter {
  ids?: number[] | undefined[];
  parentIds?: number[] | undefined[];
  userIds?: number[] | undefined[];
  onlyRoot?: boolean;

  constructor(filter?: FoldersFilter) {
    this.ids = filter?.ids;
    this.parentIds = filter?.parentIds;
    this.userIds = filter?.userIds;
    this.onlyRoot = filter?.onlyRoot;
  }
}
