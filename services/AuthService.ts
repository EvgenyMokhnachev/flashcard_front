import authApi from "~/repositories/auth/AuthApi";
import BaseApiRepository from "~/repositories/BaseApiRepository";
import usersApi from "~/repositories/user/UsersApi";
import User from "~/repositories/user/User";

class AuthService {
  private token?: AuthToken;
  public isAuthenticated: boolean = false;
  private _userMe?: User = undefined;

  constructor() {
    BaseApiRepository.onAuthError(() => {
      this.clearAuthToken();
    });

    this.processStoredToken();
  }

  private onAuthErrorCallbacks: Function[] = [];

  private doOnAuthErrorCallbacks() {
    this.onAuthErrorCallbacks.forEach(callback => callback());
  }

  public onAuthError(callback: Function) {
    this.onAuthErrorCallbacks.push(callback);
  }

  public getUserId(): number | undefined {
    if (!this.token) return;
    if (!this.token.token) return;
    if (!this.token.userId) return;
    return this.token.userId;
  }

  public getToken(): string | undefined {
    if (!this.token) return;
    if (!this.token.token) return;
    if (!this.token.userId) return;
    return this.token.token;
  }

  public async auth(email: string, pass: string) {
    try {
      let token: AuthToken = await authApi.auth(email, pass);
      if (token && token.token) {
        this.isAuthenticated = true;
        this.token = token;
        AuthService.storeAuthToken(this.token);
      }

      if (this.token?.userId) {
        let userMe = await usersApi.getFirst({
          ids: [this.token?.userId]
        });

        if (userMe) {
          this._userMe = userMe;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  private static getStoredAuthToken(): AuthToken | undefined {
    let authTokenString = window.localStorage.getItem("token");
    if (!authTokenString) {
      return;
    }

    try {
      return JSON.parse(authTokenString);
    } catch (e) {
      return;
    }
  }

  private processStoredToken() {
    let storedAuthToken: AuthToken | undefined = AuthService.getStoredAuthToken();
    if (storedAuthToken && storedAuthToken.token) {
      this.isAuthenticated = true;
      this.token = storedAuthToken;
    }
  }

  private static storeAuthToken(authToken: AuthToken) {
    if (!authToken) return;
    try {
      let authTokenJson = JSON.stringify(authToken);
      window.localStorage.setItem("token", authTokenJson);
    } catch (e) {
      return;
    }
  }

  public clearAuthToken() {
    this.isAuthenticated = false;
    this.token = undefined;
    window.localStorage.removeItem("token");
    this._userMe = undefined;
    this.doOnAuthErrorCallbacks();
  }

  public async getUserMe(): Promise<User | undefined> {
    if (this._userMe) return this._userMe;
    if (!this.token?.userId) return this._userMe;
    this._userMe = await usersApi.getFirst({ids: [this.token?.userId]});
    return this._userMe;
  }

}

let authService = new AuthService();
export default authService;
