export interface NavItem {
  label: string;
  href: string;
}

/** Primary sections, in masthead order. Contact is rendered separately. */
export const nav: NavItem[] = [
  { label: 'Writing', href: '/writing/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Publications', href: '/publications/' },
  { label: 'About', href: '/about/' },
];

export const contact: NavItem = { label: 'Contact', href: '/contact/' };

/** Essays live under /posts/ but belong to the Writing section. */
export function isCurrent(item: NavItem, pathname: string): boolean {
  if (item.href === '/writing/' && pathname.startsWith('/posts/')) return true;
  return pathname.startsWith(item.href);
}
