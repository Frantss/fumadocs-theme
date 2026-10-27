import { DocsBody, DocsDescription, DocsLayout, DocsPage, DocsTitle } from '@frantss/fumadocs-theme';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <DocsLayout tree={{ name: 'Fixture', children: [{ type: 'page', name: 'Documentation', url: '/' }] }}>
      <DocsPage toc={[]}>
        <DocsTitle>SSR integration fixture</DocsTitle>
        <DocsDescription>A documentation page rendered from the packed theme.</DocsDescription>
        <DocsBody>
          <p>Packed theme content renders on the server.</p>
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  ),
});
