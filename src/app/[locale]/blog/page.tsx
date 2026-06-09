import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getBlogPosts } from '@/lib/content/blog';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === 'en' ? 'Blog' : 'Blog',
    description: locale === 'en'
      ? 'Articles, guides and resources about SEO, web development and digital marketing.'
      : 'Artículos, guías y recursos sobre SEO, desarrollo web y marketing digital.',
    locale: locale as Locale,
    path: '/blog',
  });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const posts = getBlogPosts(locale as Locale);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.blog, href: `/${locale}/blog` },
          ]}
        />
      </Container>

      <Section>
        <SectionHeader title={dict.blog.title} subtitle={dict.blog.subtitle} />

        {posts.length === 0 ? (
          <p className="text-center text-muted">
            {locale === 'en' ? 'No articles yet.' : 'Aún no hay artículos.'}
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
                <Card className="h-full flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold mb-2 group-hover:text-violet transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted flex-1 mb-4">{post.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{formatDate(post.date, locale as Locale)}</span>
                    <span>{post.readTime} {dict.blog.readTime}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
