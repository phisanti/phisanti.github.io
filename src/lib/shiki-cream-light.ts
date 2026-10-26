/**
 * Light code theme for the cream panel: Solarized-light hues with keywords in
 * the site's deep red (#c03b2c, 4.68:1 on --code-bg #f4efde).
 */
export const creamLight = {
  name: 'cream-light',
  type: 'light',
  colors: { 'editor.background': '#f4efde', 'editor.foreground': '#586e75' },
  tokenColors: [
    { settings: { foreground: '#586e75' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#93a1a1', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'keyword.operator', 'entity.name.tag'], settings: { foreground: '#c03b2c' } },
    { scope: ['string', 'entity.other.attribute-name'], settings: { foreground: '#2aa198' } },
    { scope: ['constant', 'constant.numeric', 'constant.language'], settings: { foreground: '#d33682' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#268bd2' } },
    { scope: ['support.type', 'entity.name.type', 'support.class'], settings: { foreground: '#b58900' } },
    { scope: ['variable', 'variable.parameter', 'meta.definition', 'support.variable'], settings: { foreground: '#586e75' } },
  ],
};
