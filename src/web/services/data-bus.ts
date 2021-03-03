
class DataBus {

  public get session(): string { return localStorage.getItem('sid'); }
  public set session(sid: string) { localStorage.setItem('sid', sid); }

  user?: { id: string, username: string } = null;
  type?: string = undefined;

  public clear() {
    localStorage.clear();
    this.user = null;
    this.type = undefined;
  }
};

export default new DataBus();
