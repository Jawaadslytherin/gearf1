import { useSyncExternalStore, lazy, Suspense } from 'react';

// Lazy-loaded so embed bundles don't block initial render
const TwitterTweetEmbed = lazy(() =>
  import('react-twitter-embed').then((m) => ({ default: m.TwitterTweetEmbed }))
);
const InstagramEmbed = lazy(() =>
  import('react-social-media-embed').then((m) => ({ default: m.InstagramEmbed }))
);

const EmbedSkeleton = () => (
  <div className="w-full max-w-[550px] h-32 animate-pulse bg-border rounded-lg" />
);

// useSyncExternalStore is the React-recommended way to detect client vs prerender
// without triggering the react-hooks/set-state-in-effect lint rule
const _noop = () => () => {};
function useIsClient() {
  return useSyncExternalStore(_noop, () => true, () => false);
}

export default function SocialEmbed({ url }) {
  // Only render on the client — keeps prerendered HTML embed-free for SEO
  const isClient = useIsClient();

  if (!url || !isClient) return null;

  if (url.includes('twitter.com') || url.includes('x.com')) {
    const match = url.match(/status\/(\d+)/);
    const tweetId = match ? match[1] : null;
    if (!tweetId) return null;
    return (
      <Suspense fallback={<EmbedSkeleton />}>
        <TwitterTweetEmbed tweetId={tweetId} />
      </Suspense>
    );
  }

  if (url.includes('instagram.com')) {
    return (
      <Suspense fallback={<EmbedSkeleton />}>
        <InstagramEmbed url={url} width={550} />
      </Suspense>
    );
  }

  return null;
}
