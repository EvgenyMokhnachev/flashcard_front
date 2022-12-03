export default class UsersFilter {
  ids?: number[] | undefined[];

  constructor(cardsFilter: UsersFilter) {
    this.ids = cardsFilter?.ids;
  }
}
