import BaseApiRepository from "~/repositories/BaseApiRepository";
import PaginationResponse from "~/repositories/PaginationResponse";
import FoldersFilter from "~/repositories/folders/FoldersFilter";
import Folder from "~/repositories/folders/Folder";
import FolderCreateRequest from "~/repositories/folders/FolderCreateRequest";
import FolderTree from "~/repositories/folders/FolderTree";

class FoldersApi extends BaseApiRepository {

  private foldersCRUDCallbacks: Function[] = [];

  public onFoldersCrud(callback: Function) {
    this.foldersCRUDCallbacks.push(callback);
  }

  private doFoldersCRUDCallbacks() {
    this.foldersCRUDCallbacks.forEach(callback => callback())
  }

  public async get(filter?: FoldersFilter): Promise<PaginationResponse<Folder>> {
    return new PaginationResponse(await this.POST("http://localhost:3000/folders/get", filter));
  }

  public async tree(filter?: FoldersFilter): Promise<PaginationResponse<FolderTree>> {
    return new PaginationResponse(await this.POST("http://localhost:3000/folders/get/tree", filter));
  }

  public async create(createData: FolderCreateRequest): Promise<Folder> {
    try {
      let result = await this.POST("http://localhost:3000/folders/create", createData);
      this.doFoldersCRUDCallbacks();
      return result;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id?: number): Promise<boolean> {
    try {
      let result = await this.POST("http://localhost:3000/folders/delete", {folderId: id});
      this.doFoldersCRUDCallbacks();
      return result.success;
    } catch (e) {
      throw e;
    }
  }

  public async update(folder: Folder): Promise<Folder> {
    try {
      let result = await this.POST("http://localhost:3000/folders/update", folder);
      this.doFoldersCRUDCallbacks();
      return result;
    } catch (e) {
      throw e;
    }
  }

}

export const foldersApi: FoldersApi = new FoldersApi();
export default foldersApi;