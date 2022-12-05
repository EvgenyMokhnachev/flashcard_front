import BaseApiRepository from "~/repositories/BaseApiRepository";
import PaginationResponse from "~/repositories/PaginationResponse";
import UsersFilter from "~/repositories/user/UsersFilter";
import User from "~/repositories/user/User";
import config from "~/config/config";

class UsersApi extends BaseApiRepository {

  public async get(filter?: UsersFilter): Promise<PaginationResponse<User>> {
    return await this.POST(config.getApiUrl() + "/users/get", filter);
  }

  public async getFirst(filter?: UsersFilter): Promise<User | undefined> {
    let result = undefined;

    let paginationResponse = await this.get(filter);
    if (paginationResponse && paginationResponse.items && paginationResponse.items.length) {
      result = paginationResponse.items[0];
    }

    return result;
  }

}

export const usersApi: UsersApi = new UsersApi();
export default usersApi;
