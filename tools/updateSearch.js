import { Party, Search, Summary } from '../src/data/models';

export default async function updateSearch() {
  console.log('Summary syncing');
  await Summary.sync();
  console.log('Party updating aggregate data');
  await Party.updateAggregateData();
  console.log('Search syncing');
  await Search.sync();
  console.log('Search refreshing view');
  await Search.refreshView();
}
