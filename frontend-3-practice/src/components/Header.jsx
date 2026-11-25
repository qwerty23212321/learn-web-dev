export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#" className="brand" aria-label="BORODA CLUB — на главную">
          <span className="brand-badge" aria-hidden="true">B</span>
          <span className="brand-name">BORODA CLUB</span>
        </a>

        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#services" className="nav-link">Услуги</a>
          <a href="#masters" className="nav-link">Мастера</a>
          <a href="#reviews" className="nav-link">Отзывы</a>
          <a href="#contacts" className="nav-link">Контакты</a>
        </nav>

        <a href="tel:+74951234567" className="header-phone">+7 (495) 123-45-67</a>
      </div>
    </header>
  );
}
