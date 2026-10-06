import { Fragment } from 'react';
import Reveal from './Reveal.jsx';
import { ArrowDownIcon } from './icons.jsx';
import { asset } from '../utils.js';

const ROLES = ['2D-художник', 'цифровой иллюстратор', 'графический дизайнер', 'преподаватель'];

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <Reveal as="h1" delay={0.08}>Альмира<br /><em>Аминева</em></Reveal>
          <Reveal as="p" className="hero-sub" delay={0.16}>
            {ROLES.map((role, i) => (
              <Fragment key={role}>
                <b>{role}{i < ROLES.length - 1 && <>&nbsp;<span>·</span></>}</b>{' '}
              </Fragment>
            ))}
          </Reveal>
          <Reveal className="btn-row" delay={0.24}>
            <a href="#works" className="btn btn-solid">Смотреть работы <ArrowDownIcon /></a>
            <a href="#contact" className="btn btn-ghost">Связаться</a>
          </Reveal>
        </div>
        <Reveal as="figure" className="hero-art" delay={0.2}>
          <img src={asset('assets/main.jpg')} alt="Альмира Аминева" width="1200" height="1600" fetchPriority="high" />
        </Reveal>
      </div>
      <div className="scroll-hint" aria-hidden="true" />
    </section>
  );
}
