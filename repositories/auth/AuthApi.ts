import BaseApiRepository from "~/repositories/BaseApiRepository";
import config from "~/config/config";

class AuthApi extends BaseApiRepository {

  public async auth(email: string, pass: string): Promise<AuthToken> {
    return await this.POST(config.getApiUrl() + "/auth", {email, pass});
  }

}

export const authApi: AuthApi = new AuthApi();
export default authApi;
