import { Search } from '../src/data/models';

export default async function runCleanDB() {
  await Search.sync();
  await Search.refreshView();
}
