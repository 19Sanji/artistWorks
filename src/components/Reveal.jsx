import { useEffect, useRef } from 'react';

// Один наблюдатель на всю страницу: элемент получает класс .in, когда попадает в экран
let observer;
function getObserver() {
  observer ??= new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  return observer;
}

// Обёртка с анимацией появления при скролле. delay — задержка в секундах.
export default function Reveal({ as: Tag = 'div', delay, className = '', style, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { '--d': `${delay}s`, ...style } : style}
      {...rest}
    />
  );
}
