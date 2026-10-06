import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './icons.jsx';

// Иконка темы переключается в CSS по атрибуту data-theme, поэтому состояние в React не нужно
function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap">
        <a href="#top" className="logo">Альмира&nbsp;Аминева</a>
        <nav className="nav-links" aria-label="Основная навигация">
          <a href="#about">Обо мне</a>
          <a href="#works" className="keep">Работы</a>
          <a href="#contact">Контакты</a>
          <button className="theme-btn" type="button" aria-label="Переключить тему" onClick={toggleTheme}>
            <SunIcon className="sun" />
            <MoonIcon className="moon" />
          </button>
        </nav>
      </div>
    </header>
  );
}
