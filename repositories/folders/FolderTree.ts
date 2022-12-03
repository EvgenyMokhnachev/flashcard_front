import Folder from "~/repositories/folders/Folder";

export default class FolderTree extends Folder {
  parent?: FolderTree;
  children?: FolderTree[];

  constructor(data: Folder, parent: FolderTree, children: FolderTree[]) {
    super(data);
    this.parent = parent;
    this.children = children;
  }
}
