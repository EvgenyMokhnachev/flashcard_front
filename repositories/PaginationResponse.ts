export default class PaginationResponse<I> {
  items: I[] = [];
  total?: number;

  constructor(response: PaginationResponse<I>) {
    this.items = response?.items;
    this.total = response?.total;
  }

  public first(): I|undefined {
    let result = undefined;
    if (this.items && this.items.length) {
      result = this.items[0];
    }
    return result;
  }
}
