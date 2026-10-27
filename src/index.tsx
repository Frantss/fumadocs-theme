import type { ComponentProps, ReactNode } from 'react';
import { DocsLayout as BaseDocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody as BaseDocsBody,
  DocsDescription as BaseDocsDescription,
  DocsPage as BaseDocsPage,
  DocsTitle as BaseDocsTitle,
  type DocsPageProps,
} from 'fumadocs-ui/layouts/docs/page';

export type { DocsLayoutProps, DocsPageProps };

function classes(themeClass: string, className?: string) {
  return [themeClass, className].filter(Boolean).join(' ');
}

export function DocsLayout({ containerProps, ...props }: DocsLayoutProps) {
  return (
    <BaseDocsLayout
      {...props}
      containerProps={{
        ...containerProps,
        className: classes('frantss-docs-frame', containerProps?.className),
      }}
    />
  );
}

export function DocsPage({ className, tableOfContent, footer, ...props }: DocsPageProps) {
  return (
    <BaseDocsPage
      {...props}
      className={classes('frantss-docs-page', className)}
      tableOfContent={{ enabled: false, ...tableOfContent }}
      footer={{ ...footer, className: classes('frantss-docs-pagination', footer?.className) }}
    />
  );
}

export function DocsTitle({ className, ...props }: ComponentProps<typeof BaseDocsTitle>) {
  return <BaseDocsTitle {...props} className={classes('frantss-docs-title', className)} />;
}

export function DocsDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDocsDescription>) {
  return (
    <BaseDocsDescription {...props} className={classes('frantss-docs-description', className)} />
  );
}

export function DocsBody({ className, ...props }: ComponentProps<typeof BaseDocsBody>) {
  return <BaseDocsBody {...props} className={classes('frantss-docs-prose', className)} />;
}

export interface DocsBrandProps {
  children: ReactNode;
  mark?: ReactNode;
}

export function DocsBrand({ children, mark }: DocsBrandProps) {
  return (
    <>
      {mark != null && (
        <span className="frantss-docs-mark" aria-hidden="true">
          {mark}
        </span>
      )}
      <span>{children}</span>
    </>
  );
}
