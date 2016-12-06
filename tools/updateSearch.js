import { Search, Summary } from '../src/data/models';

export default async function updateSearch() {
  await Search.sync();
  await Search.refreshView();
  await Summary.sync()
}
