import { Helmet } from 'react-helmet-async';
import { articleJsonLd } from '../lib/seo';

export default function ArticleJsonLd({ article, slug }) {
  const json = JSON.stringify(articleJsonLd(article, slug)).replace(/</g, '\\u003c');
  return (
    <Helmet>
      <script type="application/ld+json">{json}</script>
    </Helmet>
  );
}
