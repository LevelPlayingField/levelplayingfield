import { Search } from '../src/data/models';

export default async function updateSearch() {
  await Search.sync();
  await Search.refreshView();
}
