import { parse } from 'yaml';
import raw from './social.yml?raw';
import type { IconName } from '../components/Icon.astro';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: IconName;
  /** Encoded address on the email link; scripts/unmask.ts turns it back into a mailto. */
  mask?: string;
}

/** Reversed then base64, so the address never appears as plain text in the built HTML. */
const encode = (address: string) => btoa([...address].reverse().join(''));

const links: SocialLink[] = parse(raw);
const address = links.find((s) => s.id === 'email')!.url.replace(/^mailto:/, '');

export const emailMask = encode(address);

export const social: SocialLink[] = links.map((s) =>
  s.id === 'email' ? { ...s, url: '/contact/', mask: emailMask } : s,
);
