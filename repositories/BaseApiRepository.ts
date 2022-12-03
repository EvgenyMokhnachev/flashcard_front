import authService from "~/services/AuthService";

class BaseApiRepository {

  private static onAuthErrorCallbacks: Function[] = [];

  private static doOnAuthErrorCallbacks() {
    BaseApiRepository.onAuthErrorCallbacks.forEach(callback => callback());
  }

  public static onAuthError(callback: Function) {
    BaseApiRepository.onAuthErrorCallbacks.push(callback);
  }

  private static async postData(url = '', data = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authService.getToken() || ''
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      if (response.status >= 400) {
        throw await response.json();
      }
      return await response.json(); // parses JSON response into native JavaScript objects
    } catch (e) {
      if (e && e.code) {
        if (e.code === 100) {
          authService.clearAuthToken();
          BaseApiRepository.doOnAuthErrorCallbacks();
        }
      }
      throw e;
    }
  }

  protected async POST(url: string, data: any): Promise<any> {
    try {
      return await BaseApiRepository.postData(url, data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

}

export default BaseApiRepository;
