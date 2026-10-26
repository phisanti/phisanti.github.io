import { defineHastPlugin } from 'satteri';
import type { Element, ElementContent } from 'hast';

const el = (tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element => ({
  type: 'element',
  tagName,
  properties,
  children,
});

/**
 * A paragraph holding only `![alt](./x.png "Figure N. caption")` becomes
 * `<figure><img><figcaption><em>caption</em></figcaption></figure>`, with a
 * leading "Figure N." wrapped in <strong> so it can take the accent colour.
 * The img keeps its relative src, so Astro still optimises it afterwards.
 */
const caption = (title: string): ElementContent[] => {
  const match = /^(Figure \d+\.)\s*(.*)$/s.exec(title);
  if (!match) return [{ type: 'text', value: title }];
  return [el('strong', {}, [{ type: 'text', value: match[1] }]), { type: 'text', value: ` ${match[2]}` }];
};

export const figures = defineHastPlugin({
  name: 'figures',
  element: {
    filter: ['p'],
    visit(node) {
      const content = node.children.filter((child) => !(child.type === 'text' && !child.value.trim()));
      const img = content[0];
      if (content.length !== 1 || img?.type !== 'element' || img.tagName !== 'img') return;
      const { title, ...properties } = img.properties;
      if (typeof title !== 'string' || !title.trim()) return;
      return el('figure', {}, [
        el('img', properties),
        el('figcaption', {}, [el('em', {}, caption(title))]),
      ]);
    },
  },
});
