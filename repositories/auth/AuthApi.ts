import BaseApiRepository from "~/repositories/BaseApiRepository";

class AuthApi extends BaseApiRepository {

  public async auth(email: string, pass: string): Promise<AuthToken> {
    return await this.POST("https://api-flashcards.mokhnachev.org/auth", {email, pass});
  }

}

export const authApi: AuthApi = new AuthApi();
export default authApi;
