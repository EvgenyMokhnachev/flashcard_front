import BaseApiRepository from "~/repositories/BaseApiRepository";
import CardsFilter from "~/repositories/cards/CardsFilter";
import Card from "~/repositories/cards/Card";
import CardCreateRequest from "~/repositories/cards/CardCreateRequest";
import PaginationResponse from "~/repositories/PaginationResponse";
import config from "~/config/config";

class CardsApi extends BaseApiRepository {

  public async get(filter?: CardsFilter): Promise<PaginationResponse<Card>> {
    return await this.POST(config.getApiUrl() + "/cards/get", filter);
  }

  public async getFirst(filter?: CardsFilter): Promise<Card | undefined> {
    let result = undefined;

    let paginationResponse = await this.get(filter);
    if (paginationResponse && paginationResponse.items && paginationResponse.items.length) {
      result = paginationResponse.items[0];
    }

    return result;
  }

  public async create(cardCreateData: CardCreateRequest): Promise<Card> {
    return await this.POST(config.getApiUrl() + "/cards/create", cardCreateData);
  }

  public async update(card: Card): Promise<Card> {
    return await this.POST(config.getApiUrl() + "/cards/update", card);
  }

  public async delete(id: number): Promise<undefined> {
    return await this.POST(config.getApiUrl() + "/cards/delete", {id});
  }

}

export const cardsApi: CardsApi = new CardsApi();
export default cardsApi;
