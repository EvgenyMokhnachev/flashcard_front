export default class UsersFilter {
  ids?: number[];

  constructor(cardsFilter: UsersFilter) {
    this.ids = cardsFilter?.ids;
  }
}
