import Reveal from './Reveal.jsx';
import { MailIcon, TelegramIcon } from './icons.jsx';

export default function Contact() {
  return (
    <section className="block contact" id="contact">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">Контакты</Reveal>
        <Reveal as="h2" delay={0.06}>Давайте работать вместе</Reveal>
        <Reveal as="p" className="lead" delay={0.12}>
          Открыта для заказов на иллюстрации, фоны, персонажей и графический дизайн, а также для учеников.
          Пишите — отвечу в течение дня.
        </Reveal>
        <Reveal className="socials" delay={0.18}>
          <a className="social" href="mailto:Almira190601@mail.ru"><MailIcon />Almira190601@mail.ru</a>
          <a className="social" href="https://t.me/tamelkaya" target="_blank" rel="noopener"><TelegramIcon />@tamelkaya</a>
        </Reveal>
      </div>
    </section>
  );
}
