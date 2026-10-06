import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Gallery from './components/Gallery.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  // list — работы, по которым листает лайтбокс (с учётом фильтра), index — открытая работа или null
  const [viewer, setViewer] = useState({ list: [], index: null });

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Gallery onOpen={(list, index) => setViewer({ list, index })} />
        <Contact />
      </main>
      <Footer />
      <Lightbox
        list={viewer.list}
        index={viewer.index}
        onIndex={index => setViewer(v => ({ ...v, index }))}
        onClose={() => setViewer(v => ({ ...v, index: null }))}
      />
    </>
  );
}
