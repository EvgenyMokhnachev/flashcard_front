class Config {

  public getApiUrl() {
    return process.env.NUXT_ENV_API_URL
  }

}

export default new Config();
