export default class User {
  id?: number;
  email?: string;

  constructor(card?: User) {
    this.id = card?.id;
    this.email = card?.email;
  }
}
