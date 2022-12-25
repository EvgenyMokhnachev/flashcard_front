import CardDifficultType from "~/services/CardDifficultType";

export default class Card {
  id?: number;
  public folderId?: number;
  userId?: number;
  frontSide?: string;
  backSide?: string;
  difficult?: CardDifficultType;
  bookmarked?: boolean;

  constructor(card?: Card) {
    this.id = card?.id;
    this.folderId = card?.folderId;
    this.userId = card?.userId;
    this.frontSide = card?.frontSide;
    this.backSide = card?.backSide;
    this.difficult = card?.difficult;
    this.bookmarked = card?.bookmarked;
  }
}
