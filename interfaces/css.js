/* @flow */

declare module CSSModule {
  declare var exports: {
    _getCss: () => string,
    [key: string]: string
  };
}
