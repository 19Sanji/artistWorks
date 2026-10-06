import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { ZoomIcon } from './icons.jsx';
import { ALL_WORKS, CATEGORIES } from '../data/categories.js';
import { pad, prefersReducedMotion, worksLabel } from '../utils.js';

const CHIPS = [
  { id: 'all', title: 'Все', count: ALL_WORKS.length },
  ...CATEGORIES.map(c => ({ id: c.id, title: c.title, count: c.works.length })),
];

function Card({ work, index, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // картинка могла загрузиться из кэша раньше, чем React повесил onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img.complete && img.naturalWidth) setLoaded(true);
  }, []);

  return (
    <Reveal
      as="figure"
      className={`card${work.scale < 1 ? ' small' : ''}`}
      delay={(index % 4) * 0.06}
      style={{ '--r': (work.w / work.h).toFixed(4), '--s': work.scale }}
    >
      <button type="button" aria-label={`Открыть: ${work.catTitle}, работа ${work.n}`} onClick={() => onOpen(work)}>
        <img
          ref={imgRef}
          src={work.thumb}
          width={work.w}
          height={work.h}
          loading="lazy"
          decoding="async"
          alt={`${work.catTitle} — работа ${work.n}`}
          className={loaded ? 'loaded' : undefined}
          onLoad={() => setLoaded(true)}
        />
      </button>
      <figcaption className="cap"><span>{work.catTitle} · {pad(work.n)}</span><ZoomIcon /></figcaption>
    </Reveal>
  );
}

function Group({ cat, onOpen }) {
  return (
    <div className="group">
      <Reveal className="group-head">
        <h3>{cat.title}</h3>
        <span className="count">{worksLabel(cat.works.length)}</span>
        <p>{cat.note}</p>
      </Reveal>
      <div className="jgrid">
        {cat.works.map((work, i) => <Card key={work.key} work={work} index={i} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

export default function Gallery({ onOpen }) {
  const [filter, setFilter] = useState('all');
  const galleryRef = useRef(null);

  const visible = filter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === filter);
  const list = visible.flatMap(c => c.works);   // по ним листает лайтбокс

  function select(id, btn) {
    if (id === filter) return;
    setFilter(id);
    const smooth = prefersReducedMotion() ? 'auto' : 'smooth';
    btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: smooth });
    const top = galleryRef.current.getBoundingClientRect().top + scrollY - 140;
    if (scrollY > top) scrollTo({ top, behavior: smooth });
  }

  return (
    <section className="block" id="works" style={{ paddingTop: 0, paddingBottom: 40 }}>
      <div className="filters">
        <div className="wrap filters-inner" role="toolbar" aria-label="Фильтр по категориям">
          {CHIPS.map(c => (
            <button
              key={c.id}
              className="chip"
              type="button"
              aria-pressed={c.id === filter}
              onClick={e => select(c.id, e.currentTarget)}
            >
              {c.title}<sup>{c.count}</sup>
            </button>
          ))}
        </div>
      </div>
      <div className="wrap" ref={galleryRef}>
        {visible.map(cat => (
          // ключ с фильтром — при смене фильтра группа монтируется заново и анимация появления повторяется
          <Group key={`${filter}-${cat.id}`} cat={cat} onOpen={work => onOpen(list, list.indexOf(work))} />
        ))}
      </div>
    </section>
  );
}
