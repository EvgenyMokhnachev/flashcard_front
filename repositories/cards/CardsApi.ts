import BaseApiRepository from "~/repositories/BaseApiRepository";
import CardsFilter from "~/repositories/cards/CardsFilter";
import Card from "~/repositories/cards/Card";
import CardCreateRequest from "~/repositories/cards/CardCreateRequest";
import PaginationResponse from "~/repositories/PaginationResponse";

class CardsApi extends BaseApiRepository {

  public async get(filter?: CardsFilter): Promise<PaginationResponse<Card>> {
    return await this.POST("https://api-flashcards.mokhnachev.org/cards/get", filter);
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
    return await this.POST("https://api-flashcards.mokhnachev.org/cards/create", cardCreateData);
  }

  public async update(card: Card): Promise<Card> {
    return await this.POST("https://api-flashcards.mokhnachev.org/cards/update", card);
  }

  public async delete(id: number): Promise<undefined> {
    return await this.POST("https://api-flashcards.mokhnachev.org/cards/delete", {id});
  }

}

export const cardsApi: CardsApi = new CardsApi();
export default cardsApi;
