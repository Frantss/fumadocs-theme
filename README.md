# @frantss/fumadocs-theme

Geist Mono typography, light and dark palettes, keycap controls, a faded dot texture, and a centered documentation frame for Fumadocs. Includes TypeScript declarations and thin wrappers around Fumadocs components.

Requires Fumadocs UI `^16.17.8`, React `^19.2.0`, and Tailwind CSS `^4.0.0`. Verified with Fumadocs UI 16.17.8. The package does not configure routing, content, search, metadata, or the Fumadocs provider.

## Install

```sh
npm install @frantss/fumadocs-theme
```

Replace the app's existing Fumadocs color and preset CSS imports with this global stylesheet:

```css
@import 'tailwindcss';
@import '@frantss/fumadocs-theme/styles.css';
```

The theme imports the Fumadocs preset, semantic colors, and self-hosted Geist Mono font. Keep the app's Tailwind PostCSS setup and Fumadocs provider.

### Vite SSR and TanStack Start

Add the theme to `ssr.noExternal` in the app's existing Vite configuration. Keep its plugins, Fumadocs provider, and any other `noExternal` entries:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: ['@frantss/fumadocs-theme'],
  },
});
```

This bundles the theme with the app's Fumadocs code so they share provider contexts. Without it, TanStack Start with Nitro can report `You need to wrap your application inside FrameworkProvider` during prerendering, even when the build exits successfully. Check that the generated pages contain their expected content.

## Layout

Import the themed components instead of their Fumadocs equivalents. Pass the app's own page tree and links:

```tsx
import { DocsBrand, DocsLayout } from '@frantss/fumadocs-theme';

<DocsLayout tree={source.pageTree} nav={{ title: <DocsBrand mark="AB">App docs</DocsBrand> }}>
  {children}
</DocsLayout>;
```

`DocsBrand` accepts a `mark` and children. Omit `mark` for a text-only title. The mark is decorative; put the accessible app name in the children. Supply a separate favicon through the app.

## Pages

```tsx
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from '@frantss/fumadocs-theme';

<DocsPage toc={page.data.toc} full={page.data.full}>
  <DocsTitle>{page.data.title}</DocsTitle>
  <DocsDescription>{page.data.description}</DocsDescription>
  <DocsBody>
    <Content />
  </DocsBody>
</DocsPage>;
```

The wrappers accept the corresponding Fumadocs props and merge custom `className` values. `DocsLayoutProps`, `DocsPageProps`, and `DocsBrandProps` are exported types. Content and MDX components remain under the app's control.

`DocsPage` hides the right-hand table of contents by default and keeps the table-of-contents popover. Pass `tableOfContent={{ enabled: true }}` to restore the right-hand column. Footer and container options pass through.

## Customize

The frame defaults to `56rem`. Override its width after the theme import:

```css
:root {
  --frantss-docs-frame-width: 64rem;
}
```

Override Fumadocs `--color-fd-*` tokens and the `--frantss-docs-link`, `--frantss-docs-line-strong`, `--frantss-docs-faint`, and `--frantss-docs-edge` tokens in `:root` and `.dark` to change the palette. Theme classes use the `frantss-docs-` prefix.

The keycap style targets the search triggers, the theme switch, and the sidebar triggers through the data and ARIA attributes Fumadocs puts on them. After a Fumadocs upgrade, check that these controls still have their raised bottom edge.

## Development

```sh
npm ci
npm run build
npm run typecheck
npm test
npm pack
```

`npm pack` builds the package and includes its JavaScript, declarations, CSS, and this guide. It excludes source files and development dependencies. Install the generated tarball in another app with `npm install /path/to/frantss-fumadocs-theme-0.1.1.tgz`.

`npm test` requires Node.js 22.12 or later and access to the npm registry. It packs the theme, installs the tarball in a temporary TanStack Start/Nitro fixture with locked dependencies, and builds the app. It checks server-rendering errors and the prerendered heading and body content. The temporary fixture is removed after the test.
