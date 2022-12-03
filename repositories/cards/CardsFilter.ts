export default class CardsFilter {
  ids?: number[] | undefined[];
  userIds?: number[] | undefined[];
  folderIds?: number[] | undefined[];

  constructor(cardsFilter?: CardsFilter) {
    this.ids = cardsFilter?.ids;
    this.userIds = cardsFilter?.userIds;
    this.folderIds = cardsFilter?.folderIds;
  }
}
