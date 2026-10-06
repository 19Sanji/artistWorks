import { useEffect, useRef, useState } from 'react';
import { CloseIcon, NextIcon, PrevIcon } from './icons.jsx';
import { pad } from '../utils.js';

const loaded = img => img.complete ? Promise.resolve() : new Promise(res => {
  img.addEventListener('load', res, { once: true });
  img.addEventListener('error', res, { once: true });
});

// ждём загрузку и декодирование; если decode() задерживается — не дольше 200 мс
const decoded = img => loaded(img).then(() => Promise.race([
  img.decode ? img.decode().catch(() => {}) : null,
  new Promise(res => setTimeout(res, 200)),
]));

export default function Lightbox({ list, index, onIndex, onClose }) {
  const open = index !== null;
  const work = open ? list[index] : null;
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);
  const holderRef = useRef(null);
  const closeRef = useRef(null);
  const token = useRef(0);
  const touch = useRef(null);

  const go = d => onIndex((index + d + list.length) % list.length);

  // Смена картинки. Вставляем в DOM только уже декодированное изображение —
  // так между работами не бывает пустого кадра и мерцания.
  useEffect(() => {
    const my = ++token.current;
    if (!work) { setLoading(false); return; }

    let fullShown = false;
    const put = img => {
      img.alt = `${work.catTitle} — работа ${work.n}`;
      holderRef.current.replaceChildren(img);
    };

    const full = new Image();
    full.src = work.full;
    const showFull = () => decoded(full).then(() => {
      if (my !== token.current) return;
      setLoading(false);
      if (!full.naturalWidth) return;   // не загрузилась — оставляем превью
      fullShown = true;
      put(full);
    });

    if (full.complete && full.naturalWidth) {
      showFull();   // крупная версия уже в кэше
    } else {
      // пока грузится крупная версия — показываем превью из сетки (оно уже в кэше)
      setLoading(true);
      const thumb = new Image();
      thumb.src = work.thumb;
      decoded(thumb).then(() => { if (my === token.current && !fullShown) put(thumb); });
      showFull();
    }

    // подгружаем соседей заранее
    [1, -1].forEach(d => { new Image().src = list[(index + d + list.length) % list.length].full; });
  }, [work]);

  // Блокируем прокрутку страницы и возвращаем фокус на карточку после закрытия
  useEffect(() => {
    if (!open) return;
    const lastFocus = document.activeElement;
    document.body.classList.add('lb-lock');
    closeRef.current.focus();
    return () => {
      document.body.classList.remove('lb-lock');
      lastFocus?.focus?.();
    };
  }, [open]);

  // Клавиатура: Esc, стрелки, Tab не выходит за пределы лайтбокса
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab') {
        const f = [...rootRef.current.querySelectorAll('button')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // Свайпы на телефоне
  const onTouchStart = e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = e => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <div
      ref={rootRef}
      className={`lb${open ? ' open' : ''}${loading ? ' loading' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр работы"
      aria-hidden={!open}
    >
      <div className="lb-top">
        <span className="lb-counter">{open && `${pad(index + 1)} / ${pad(list.length)}`}</span>
        <button ref={closeRef} className="lb-btn" type="button" aria-label="Закрыть (Esc)" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div
        className="lb-stage"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="lb-spinner" />
        <span className="lb-img" ref={holderRef} />
        <button className="lb-btn lb-prev" type="button" aria-label="Предыдущая работа (←)" onClick={() => go(-1)}>
          <PrevIcon />
        </button>
        <button className="lb-btn lb-next" type="button" aria-label="Следующая работа (→)" onClick={() => go(1)}>
          <NextIcon />
        </button>
      </div>
      <div className="lb-bottom">
        <span>{work && `${work.catTitle} · ${pad(work.n)}`}</span>
      </div>
    </div>
  );
}
