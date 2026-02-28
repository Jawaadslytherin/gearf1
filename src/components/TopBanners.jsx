export default function TopBanners() {
  return (
    <section className="top-banners">
      <article className="top-banner top-banner--left">
        <div className="top-banner__image" />
        <div className="top-banner__content">
          <h2 className="top-banner__title">
            &lsquo;No stone is left unturned in the Wallabies&rsquo; pursuit of World Cup glory&rsquo;
          </h2>
          <p className="top-banner__excerpt">
            Wallabies have coach Eddie Jones and his leaders working hard to push for Rugby World Cup glory.
          </p>
          <div className="top-banner__social">
            <a href="#twitter" aria-label="Twitter">𝕏</a>
            <a href="#youtube" aria-label="YouTube">▶</a>
            <a href="#instagram" aria-label="Instagram">📷</a>
          </div>
        </div>
      </article>
      <div className="top-banner top-banner--right">
        <div className="top-banner__small-image" />
        <div className="top-banner__score">
          <span>Federer 01</span>
          <span>Nadal 03</span>
        </div>
        <p className="top-banner__snippet">Football transfer rumours</p>
      </div>
    </section>
  );
}
