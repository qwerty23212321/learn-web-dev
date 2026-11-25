export function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <a href="#" className="brand">
              <span className="brand-badge" aria-hidden="true">B</span>
              <span className="brand-name">BORODA CLUB</span>
            </a>
            <p className="footer-tagline">
              Барбершоп для мужчин, где каждый визит превращается в ритуал ухода и стиля.
            </p>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Контакты</h2>
            <ul className="footer-contacts">
              <li className="footer-contact-item">
                <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M8 4.75V8.25L10.25 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>10:00 — 22:00</span>
              </li>
              <li className="footer-contact-item">
                <svg className="footer-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 14.25C8 14.25 13 10.25 13 6.5C13 3.73858 10.7614 1.5 8 1.5C5.23858 1.5 3 3.73858 3 6.5C3 10.25 8 14.25 8 14.25Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="6.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>Москва, ул. Арбат, 10</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Социальные сети</h2>
            <ul className="footer-socials">
              <li><a href="#" className="footer-link">Instagram</a></li>
              <li><a href="#" className="footer-link">VK</a></li>
              <li><a href="#" className="footer-link">Telegram</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 BORODA CLUB. Все права защищены.</p>
          <a href="#" className="footer-policy">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}
