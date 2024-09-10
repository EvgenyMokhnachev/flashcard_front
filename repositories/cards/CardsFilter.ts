import CardDifficultType from "~/services/CardDifficultType";

export default class CardsFilter {
  ids?: number[] | undefined[];
  userIds?: number[] | undefined[];
  folderIds?: number[] | undefined[];
  difficultTypes?: CardDifficultType[] | undefined;
  bookmarked?: boolean | undefined;

  constructor(cardsFilter?: CardsFilter) {
    this.ids = cardsFilter?.ids ? (cardsFilter?.ids || []).map((id: (string | number)) => parseInt(id + '')).filter(id => !isNaN(id)) : undefined;
    this.userIds = cardsFilter?.userIds;
    this.folderIds = cardsFilter?.folderIds;
    this.difficultTypes = cardsFilter?.difficultTypes;
    this.bookmarked = cardsFilter?.bookmarked;
  }
}
