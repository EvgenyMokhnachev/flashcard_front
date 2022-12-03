export default class Card {
  id?: number;
  public folderId?: number;
  userId?: number;
  frontSide?: string;
  backSide?: string;

  constructor(card?: Card) {
    this.id = card?.id;
    this.folderId = card?.folderId;
    this.userId = card?.userId;
    this.frontSide = card?.frontSide;
    this.backSide = card?.backSide;
  }
}
