import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa6';

export default function TopBanners() {
  return (
    <section className="top-banners">
      <article className="top-banner top-banner--left">
        <div className="top-banner__image" />
        <div className="top-banner__content">
          <h2 className="top-banner__title">
            &lsquo;No stone left unturned in the chase for F1 championship glory&rsquo;
          </h2>
          <p className="top-banner__excerpt">
            Inside the factory as engineers and drivers work through the night to find those crucial tenths of a second.
          </p>
          <div className="top-banner__social">
            <a href="#twitter" aria-label="Twitter">
              <FaTwitter aria-hidden />
            </a>
            <a href="#youtube" aria-label="YouTube">
              <FaYoutube aria-hidden />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <FaInstagram aria-hidden />
            </a>
          </div>
        </div>
      </article>
      <div className="top-banner top-banner--right">
        <div className="top-banner__small-image" />
        <div className="top-banner__score">
          <span>VER 01</span>
          <span>HAM 02</span>
        </div>
        <p className="top-banner__snippet">Paddock rumours and transfer talk</p>
      </div>
    </section>
  );
}
