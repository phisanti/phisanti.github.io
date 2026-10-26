import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import type { Post } from './posts';

const WIDTH = 1200;
const HEIGHT = 630;
const FIGURE_WIDTH = 360;

const fontFile = (name: string) => readFile(path.resolve('node_modules/@fontsource', name));

/** The key of `/og/<key>.png`: the full post folder name, so same-titled posts from different years never share a card. */
export const ogKey = (post: Post) => post.id;

/**
 * The first local figure in the post body, else the front-matter cover, else nothing.
 * HTML comments, fenced code and linked images (logo badges) are skipped, and a
 * path that does not exist on disk is ignored rather than failing the build.
 */
function firstFigure(post: Post): string | undefined {
  const body = (post.body ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
  const local = body.match(/(?<!\[)!\[[^\]]*\]\(\.\/([^)\s]+)/)?.[1];
  // Image metadata keeps its source path on a non-enumerable `fsPath`; `src` is a build URL.
  const cover = (post.data.cover as { fsPath?: string } | undefined)?.fsPath;
  return [local && path.resolve(path.dirname(post.filePath!), local), cover].find(
    (file): file is string => !!file && existsSync(file),
  );
}

/** The figure cropped to a full-height 360px column, as a PNG data URI. */
async function figureColumn(file: string): Promise<string> {
  const png = await sharp(file).resize(FIGURE_WIDTH, HEIGHT, { fit: 'cover', position: 'attention' }).png().toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

async function portraitUri(): Promise<string> {
  const png = await sharp('public/profile.png')
    .resize(56, 56, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

/** Render the 1200×630 share card for a post as PNG bytes. */
export async function renderCard(post: Post): Promise<Uint8Array> {
  const figureFile = firstFigure(post);
  const [garamond, mono, portrait, figure] = await Promise.all([
    fontFile('eb-garamond/files/eb-garamond-latin-500-normal.woff'),
    fontFile('jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'),
    portraitUri(),
    figureFile ? figureColumn(figureFile) : undefined,
  ]);

  const text = {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: 64 },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontFamily: 'JetBrains Mono', fontSize: 22, color: '#93a1a1' },
                  children: `Essay · ${post.data.tags[0]}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontFamily: 'EB Garamond', fontSize: 64, lineHeight: 1.1, color: '#073642', marginTop: 24 },
                  children: post.data.title,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center' },
            children: [
              { type: 'img', props: { src: portrait, width: 56, height: 56, style: { borderRadius: 28 } } },
              {
                type: 'div',
                props: {
                  style: { fontFamily: 'JetBrains Mono', fontSize: 20, color: '#586e75', marginLeft: 16 },
                  children: 'Santiago Cano-Muniz · phisanti.github.io',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const children: unknown[] = [text];
  if (figure) children.push({ type: 'img', props: { src: figure, width: FIGURE_WIDTH, height: HEIGHT } });

  const svg = await satori(
    { type: 'div', props: { style: { display: 'flex', width: WIDTH, height: HEIGHT, background: '#fdf6e3' }, children } } as never,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'EB Garamond', data: garamond, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
  return new Resvg(svg).render().asPng();
}
