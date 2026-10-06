import Reveal from './Reveal.jsx';

const EXPERIENCE = [
  ['Художественное образование', 'Академическая база: рисунок, живопись, композиция'],
  ['2D-художник в студии анимации', 'Фоны, локации, персонажи и концепты для проектов студии'],
  ['Цифровой иллюстратор и графический дизайнер', 'Книжная иллюстрация, обложки, графика и вектор для коммерческих проектов'],
  ['Преподаватель', 'Частная школа рисования — занятия для детей и взрослых'],
];

const TOOLS = [['Ps', 'Photoshop'], ['Pr', 'Procreate']];
const VECTOR = [['Ai', 'Illustrator'], ['Cd', 'CorelDRAW'], ['Fg', 'Figma']];

const Tags = ({ items }) => (
  <div className="tags">
    {items.map(([short, name]) => <span className="tag" key={name}><i>{short}</i>{name}</span>)}
  </div>
);

export default function About() {
  return (
    <section className="block about" id="about" style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Обо мне</Reveal>
        <Reveal as="h2" delay={0.06} style={{ margin: '16px 0 clamp(40px, 6vw, 72px)' }}>Альмира, 25&nbsp;лет</Reveal>
      </div>
      <div className="wrap about-grid">
        <div>
          <Reveal as="p" className="eyebrow" style={{ marginBottom: 16 }}>Опыт</Reveal>
          <ul className="facts">
            {EXPERIENCE.map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 0.08}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{title}</strong><span>{text}</span></div>
              </Reveal>
            ))}
          </ul>
        </div>
        <div>
          <Reveal className="skills" delay={0.2}>
            <p className="eyebrow">Инструменты</p>
            <Tags items={TOOLS} />
            <p className="eyebrow" style={{ marginTop: 24 }}>Векторные программы</p>
            <Tags items={VECTOR} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
