export default class CardsFilter {
  ids?: number[];
  userIds?: number[];
  folderIds?: number[];

  constructor(cardsFilter: CardsFilter) {
    this.ids = cardsFilter?.ids;
    this.userIds = cardsFilter?.userIds;
    this.folderIds = cardsFilter?.folderIds;
  }
}
