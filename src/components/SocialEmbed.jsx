import { useSyncExternalStore } from 'react';

const _noop = () => () => {};
function useIsClient() {
  return useSyncExternalStore(_noop, () => true, () => false);
}

/**
 * X (Twitter) + Instagram via official-style iframes — no react-twitter-embed / react-social-media-embed
 * (those packages only declare React ≤18 peers and break npm install on React 19 / Vercel).
 */
export default function SocialEmbed({ url }) {
  const isClient = useIsClient();
  if (!url || !isClient) return null;

  if (url.includes('twitter.com') || url.includes('x.com')) {
    const match = url.match(/status\/(\d+)/);
    const tweetId = match ? match[1] : null;
    if (!tweetId) return null;
    return (
      <div className="my-6 w-full max-w-[550px] overflow-hidden rounded-lg border border-border bg-card/40">
        <iframe
          title="X post"
          src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=true`}
          width={550}
          style={{ border: 0, maxWidth: '100%', minHeight: 420, height: 'auto' }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    );
  }

  if (url.includes('instagram.com')) {
    const reel = url.match(/instagram\.com\/reel\/([^/?#]+)/);
    const post = url.match(/instagram\.com\/p\/([^/?#]+)/);
    const id = reel?.[1] || post?.[1];
    if (!id) return null;
    const path = reel ? `reel/${id}` : `p/${id}`;
    return (
      <div className="my-6 w-full max-w-[540px] overflow-hidden rounded-lg border border-border bg-card/40">
        <iframe
          title="Instagram post"
          src={`https://www.instagram.com/${path}/embed/?cr=1&v=14`}
          width={540}
          height={580}
          style={{ border: 0, maxWidth: '100%' }}
          loading="lazy"
          allowTransparency
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    );
  }

  return null;
}
