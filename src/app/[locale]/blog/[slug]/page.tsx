import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { getBlogPost, getBlogPosts } from '@/lib/content/blog';
import { getBlogPostSchema } from '@/lib/seo/structured-data';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { SITE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateStaticParams() {
  const locales = ['es', 'en', 'ca'] as const;
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getBlogPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getBlogPost(locale as Locale, slug);
  if (!post) return {};

  return generatePageMetadata({
    title: post.title,
    description: post.description,
    locale: locale as Locale,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const post = getBlogPost(locale as Locale, slug);

  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={getBlogPostSchema({
          title: post.title,
          description: post.description,
          date: post.date,
          author: post.author,
          url: `${SITE_URL}/${locale}/blog/${slug}`,
          image: post.image,
        })}
      />

      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.blog, href: `/${locale}/blog` },
            { label: post.title, href: `/${locale}/blog/${slug}` },
          ]}
        />
      </Container>

      <article className="pb-20">
        <Container className="max-w-3xl">
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="violet">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted">{post.description}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted">
              <span>{post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{formatDate(post.date, locale as Locale)}</time>
              <span>·</span>
              <span>{post.readTime} {dict.blog.readTime}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground prose-code:text-cyan">
            <MDXRemote source={post.content} />
          </div>
        </Container>
      </article>
    </>
  );
}
