/* @flow */

export default function englishJoin(words: Array<string>) {
  switch (words.length) {
    case 1:
      return words[0];
    case 2:
      return words.join(' and ');
    default:
      return `${words.slice(0, words.length - 1).join(', ')}, and ${words[words.length - 1]}`;
  }
}
