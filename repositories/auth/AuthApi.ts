import BaseApiRepository from "~/repositories/BaseApiRepository";

class AuthApi extends BaseApiRepository {

  public async auth(email: string, pass: string): Promise<AuthToken> {
    return await this.POST("http://localhost:3000/auth", {email, pass});
  }

}

export const authApi: AuthApi = new AuthApi();
export default authApi;
