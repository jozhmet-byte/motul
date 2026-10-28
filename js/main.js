/**
 * MOTUL ESPACIOS RESIDENCIALES — Interactive Client Experience Engine
 * Ocoyoacac, Estado de México | Certificación EDGE Advanced & Casas 100% Libres de Gas
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initMasterPlanInventory();
  initModelSwitcher();
  initCommuteRouteSwitcher();
  initModals();
  initLeadForm();
  initScrollReveals();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const headerWrapper = document.querySelector('.header-wrapper');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (headerWrapper) {
      if (scrollY > 60) {
        headerWrapper.classList.add('scrolled');
      } else {
        headerWrapper.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a, .mobile-drawer .btn');

  function openDrawer() {
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn && drawer && backdrop) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    backdrop.addEventListener('click', closeDrawer);

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHTING)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3.5. PLANO GENERAL DEL DESARROLLO & GESTIÓN DE INVENTARIO
   -------------------------------------------------------------------------- */
const masterPlanLots = [
  { lote: 1, m2: 181.00, status: 'preventa', label: 'PREVENTA', highlight: 'Modelo D · 181 m²', desc: 'Lote cabecera con modelo insignia D (231.21 m² const., Entrega 6 meses).' },
  { lote: 2, m2: 140.00, status: 'venta', label: 'ENTREGA INMEDIATA', highlight: 'Modelo A · Inmediata', desc: 'Residencia Modelo A (215.76 m²) lista para entrega inmediata en terreno de 140 m².' },
  { lote: 3, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 4, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 5, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 6, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 7, m2: 140.00, status: 'venta', label: 'ENTREGA 3 MESES', highlight: 'Modelo A · 3 Meses', desc: 'Residencia Modelo A (215.76 m²) con entrega a 3 meses en terreno de 140 m².' },
  { lote: 8, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Modelos A, B o C · 154 m²', desc: 'Superficie de 154 m² con libre elección entre Modelo A, B o C (Entrega 6 meses).' },
  { lote: 9, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Modelos A, B o C · 154 m²', desc: 'Lote regular de 154 m² con libre elección entre Modelo A, B o C (Entrega 6 meses).' },
  { lote: 10, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Modelos A, B o C · 154 m²', desc: 'Frente regular de 154 m² con libre elección entre Modelo A, B o C (Entrega 6 meses).' },
  { lote: 11, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Modelos A, B o C · 154 m²', desc: 'Lote poniente de 154 m² con libre elección entre Modelo A, B o C (Entrega 6 meses).' },
  { lote: 12, m2: 211.52, status: 'preventa', label: 'PREVENTA', highlight: 'Modelo D · 211.52 m²', desc: 'Manzana norte exclusiva con Modelo D (231.21 m² const., Entrega 6 meses).' },
  { lote: 13, m2: 220.92, status: 'preventa', label: 'PREVENTA', highlight: 'Modelo D · 220.92 m²', desc: 'El terreno más grande del desarrollo (220.92 m²) con Modelo D (231.21 m² const., Entrega 6 meses).' },
  { lote: 14, m2: 211.80, status: 'preventa', label: 'PREVENTA', highlight: 'Modelo D · 211.80 m²', desc: 'Colindancia al jardín común con Modelo D (231.21 m² const., Entrega 6 meses).' }
];

function initMasterPlanInventory() {
  const tableBody = document.getElementById('inventoryTableBody');
  const filterBtns = document.querySelectorAll('.inv-filter-btn');
  const lotSelect = document.getElementById('leadLotInterest');
  const leadNotes = document.getElementById('leadNotes');

  if (!tableBody) return;

  function renderTable(filter = 'all') {
    tableBody.innerHTML = '';
    const filteredLots = masterPlanLots.filter(item => {
      if (filter === 'all') return true;
      return item.status === filter;
    });

    filteredLots.forEach(lot => {
      const tr = document.createElement('tr');
      tr.className = `row-${lot.status}`;

      const lotNumStr = String(lot.lote).padStart(2, '0');
      const areaStr = lot.m2 ? `${lot.m2.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '—';

      let actionHtml = '';
      if (lot.status === 'vendido') {
        actionHtml = `<span class="btn-lot-action action-vendido" title="Lote vendido">Vendido</span>`;
      } else {
        const waMsg = encodeURIComponent(`Hola, solicito información y precio de preventa para el Lote ${lot.lote} (${areaStr} m²) en MOTUL Espacios Residenciales.`);
        actionHtml = `
          <div style="display:flex;gap:0.4rem;justify-content:flex-end;">
            <a href="https://wa.me/525522500741?text=${waMsg}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-lot-action action-${lot.status}" 
               title="Apartar o consultar este lote en WhatsApp">
              <span>Cotizar</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        `;
      }

      tr.innerHTML = `
        <td>
          <div class="lot-cell-group">
            <span class="lot-number-tag">Lote ${lotNumStr}</span>
            <span class="lot-feature-hint">${lot.highlight}</span>
          </div>
        </td>
        <td>
          <span class="lot-area-val">${areaStr}</span>
          <span class="lot-area-unit">m²</span>
        </td>
        <td>
          <span class="status-pill status-${lot.status}">
            <span class="status-pill-dot"></span>
            <span>${lot.label}</span>
          </span>
        </td>
        <td style="text-align:right;">
          ${actionHtml}
        </td>
      `;

      // Clicking row selects lot in contact form
      if (lot.status !== 'vendido') {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', (e) => {
          if (e.target.closest('a')) return;

          if (lotSelect) {
            for (let i = 0; i < lotSelect.options.length; i++) {
              if (lotSelect.options[i].text.includes(`Lote ${lotNumStr}`)) {
                lotSelect.selectedIndex = i;
                break;
              }
            }
          }
          if (leadNotes && !leadNotes.value) {
            leadNotes.value = `Interés en cotización de Lote ${lot.lote} (${areaStr} m² · ${lot.label})`;
          }
          const contactSection = document.getElementById('contacto');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }

      tableBody.appendChild(tr);
    });
  }

  // Initial render
  renderTable('all');

  // Filter tabs click handling
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.getAttribute('data-filter');
      renderTable(filter);
    });
  });
}

/* --------------------------------------------------------------------------
   4. DATA AND LOGIC FOR THE 4 OFFICIAL HOUSE MODELS (A, B, C, D)
   -------------------------------------------------------------------------- */
const modelsData = {
  modeloA: {
    id: 'modeloA',
    name: 'Modelo A · 215.76 m²',
    subtitle: '3 Niveles · Lotes 2 y 7 (140 m²) y Lotes 8–11 (154 m²)',
    badge: '215.76 m² Const. · Desde 140 m² Terreno',
    desc: 'Arquitectura contemporánea distribuida en 3 niveles con máxima optimización de espacios y luminosidad natural. Diseñada tanto para lotes de 140 m² (Lotes 2 y 7 con entrega inmediata / 3 meses) como de 154 m² (Lotes 8 al 11). Integra estancia abierta con vista a jardín privado, cocina de inducción magnética (100% libre de gas), amplias recámaras familiares con baños completos y un tercer nivel con terraza / roof para convivencia familiar.',
    specs: {
      construction: '215.76 m²',
      terrain: '140 m² y 154 m²',
      garden: 'Jardín Privado',
      parking: '2 Autos',
      bedrooms: '3 Recámaras',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '3 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_a.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_a.webp', alt: 'Plano Arquitectónico Oficial Modelo A (215.76 m²)', isPlan: true },
      { src: 'assets/images/real_fachada_conjunto.jpg', alt: 'Fachada Conjunto Residencial' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia Sala & Comedor' },
      { src: 'assets/images/real_recamara_principal.jpg', alt: 'Recámara con Vestidor y Baño' },
      { src: 'assets/images/real_terraza.jpg', alt: 'Terraza Deck Exterior' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja' },
      { key: 'alta', label: 'Planta Alta' },
      { key: 'tercer', label: 'Segundo Nivel / Roof' }
    ],
    floors: {
      baja: [
        'Cochera frontal para 2 automóviles',
        'Vestíbulo de recepción con medio baño (sanitario de cortesía) independiente',
        'Cocina de diseño equipada con parrilla de inducción magnética (100% libre de gas)',
        'Estancia integrada de sala y comedor con ventanales hacia el jardín privado',
        'Terraza exterior con acceso directo al jardín'
      ],
      alta: [
        'Recámaras familiares de excelente escala con clósets completos de madera',
        'Baños completos privados con acabados porcelánicos y ventilación natural',
        'Vestíbulo distribuidor central con iluminación natural'
      ],
      tercer: [
        'Tercer nivel con terraza lounge / roof garden exterior',
        'Espacio polivalente para family room, estudio de trabajo o área social',
        'Vistas panorámicas hacia el entorno natural del fraccionamiento'
      ]
    }
  },

  modeloB: {
    id: 'modeloB',
    name: 'Modelo B · 205.00 m²',
    subtitle: '2 Niveles · PB 105 m² + PA 100 m² · Gran Jardín de 39 m²',
    badge: '205.00 m² Const. · 154 m² Terreno',
    desc: 'Equilibrio perfecto entre amplitud social y confort íntimo en lote de 154 m². Cuenta con 105 m² en Planta Baja y 100 m² en Planta Alta. Ofrece una generosa estancia abierta conectada con canceles corredizos a una terraza cubierta y a un gran jardín privado de 39 m² con sanitario y bodega exterior. En planta alta, la Master Suite incorpora un lujoso baño tipo spa con tina de hidromasaje, doble lavabo y vestidor walk-in.',
    specs: {
      construction: '205.00 m²',
      terrain: '154 m²',
      garden: '39.00 m²',
      parking: '2 Autos',
      bedrooms: '3 Recámaras',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '2 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_b.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_b.webp', alt: 'Plano Arquitectónico Oficial Modelo B (205.00 m²)', isPlan: true },
      { src: 'assets/images/real_recamara_principal.jpg', alt: 'Master Suite con Tina y Vestidor' },
      { src: 'assets/images/real_bano.jpg', alt: 'Baño de Lujo con Tina y Doble Lavabo' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia Abierta a Jardín 39m²' },
      { src: 'assets/images/real_cocina.jpg', alt: 'Cocina Integral de Inducción' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja (105 m²)' },
      { key: 'alta', label: 'Planta Alta (100 m²)' }
    ],
    floors: {
      baja: [
        'Cochera frontal para 2 automóviles',
        'Recibidor con medio baño (sanitario) para visitas',
        'Cocina integral equipada con barra desayunadora y estufa de inducción eléctrica',
        'Amplia estancia sala-comedor conectada con canceles corredizos a terraza',
        'Terraza social techada y gran jardín privado de 39 m²',
        'Bodega y sanitario exterior de servicio en el área de jardín'
      ],
      alta: [
        'Master Suite de gran formato con tina de baño, doble lavabo y amplio vestidor walk-in',
        '2 Recámaras secundarias muy amplias con clósets de madera completos',
        '2 Baños completos adicionales integrados a las recámaras',
        'Vestíbulo central distribuidor con clóset de blancos'
      ]
    }
  },

  modeloC: {
    id: 'modeloC',
    name: 'Modelo C · 190.00 m²',
    subtitle: '2 Niveles · PB 107 m² + PA 83 m² · Suite en PB y Jardín 22.50 m²',
    badge: '190.00 m² Const. · 154 m² Terreno',
    desc: 'Diseño arquitectónico en 2 plantas (107 m² en PB y 83 m² en PA) con máxima funcionalidad y accesibilidad. Destaca por contar con una recámara en Planta Baja con baño completo privado y clóset (ideal para personas mayores, visitas o home office), estancia integrada con vista directa a jardín de 22.50 m², cocina de inducción magnética (cero gas) y una gran terraza / deck exterior en Planta Alta.',
    specs: {
      construction: '190.00 m²',
      terrain: '154 m²',
      garden: '22.50 m²',
      parking: '2 Autos',
      bedrooms: '3 Recámaras (1 en PB)',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '2 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_c.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_c.webp', alt: 'Plano Arquitectónico Oficial Modelo C (190.00 m²)', isPlan: true },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia Sala & Comedor' },
      { src: 'assets/images/real_recamara_principal.jpg', alt: 'Recámara con Vestidor y Baño en PB' },
      { src: 'assets/images/real_terraza.jpg', alt: 'Terraza Deck Exterior' },
      { src: 'assets/images/real_cocina.jpg', alt: 'Cocina de Inducción Magnética' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja (107 m²)' },
      { key: 'alta', label: 'Planta Alta (83 m²)' }
    ],
    floors: {
      baja: [
        'Cochera frontal para 2 automóviles',
        'Cocina contemporánea equipada con estufa de inducción magnética (100% libre de gas)',
        'Estancia integrada de sala y comedor con vista directa al jardín privado',
        'Recámara en Planta Baja con baño completo privado y clóset vestidor (accesibilidad)',
        'Medio baño (sanitario de cortesía) independiente para visitas',
        'Terraza exterior con acceso directo al jardín privado de 22.50 m²'
      ],
      alta: [
        '2 Recámaras secundarias amplias con clósets de diseño y excelente iluminación natural',
        '2 Baños completos privados (cada recámara cuenta con su propio baño)',
        'Gran terraza / deck privado superior con sala exterior y jardineras',
        'Vestíbulo distribuidor y cubo de escaleras iluminado'
      ]
    }
  },

  modeloD: {
    id: 'modeloD',
    name: 'Modelo D · 231.21 m²',
    subtitle: '3 Niveles · Pérgolas 38.17 m² · Roof Garden y Jardín de 61.22 m²',
    badge: '231.21 m² Const. · Lotes 181 a 220 m²',
    desc: 'La residencia insignia de mayor metraje en Motul para los lotes más amplios del conjunto (Lotes 1, 12, 13 y 14). Desarrollada en 3 niveles con 231.21 m² de construcción más 38.17 m² de pérgolas y un jardín privado de 61.22 m². Ofrece doble altura en estancia social, cochera para hasta 3 autos y un tercer nivel con Roof Garden panorámico frontal y terraza posterior con vista a las montañas.',
    specs: {
      construction: '231.21 m²',
      terrain: '181 m² a 220.92 m²',
      garden: '61.22 m² (Pérgolas 38.17 m²)',
      parking: '2 a 3 Autos',
      bedrooms: '3 Recámaras Totales',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '3 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_d.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_d.webp', alt: 'Plano Arquitectónico Oficial Modelo D (231.21 m²)', isPlan: true },
      { src: 'assets/images/real_terraza.jpg', alt: 'Roof Garden y Doble Terraza con Pérgolas' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia con Doble Altura' },
      { src: 'assets/images/real_estudio.jpg', alt: 'Family Room / Tercer Nivel' },
      { src: 'assets/images/real_fachada_principal.jpg', alt: 'Fachada Arquitectónica 3 Niveles' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja' },
      { key: 'nivel1', label: '1er Nivel' },
      { key: 'roof', label: 'Segundo Nivel / Roof' }
    ],
    floors: {
      baja: [
        'Cochera amplia para 2 a 3 automóviles con área de maniobra',
        'Vestíbulo de acceso con medio baño de cortesía (sanitario)',
        'Cocina de autor equipada con estufa de inducción electromagnética',
        'Estancia sala-comedor con espectacular doble altura y cancelería de piso a techo',
        'Terraza exterior techada con pérgolas y enorme jardín privado de 61.22 m²'
      ],
      nivel1: [
        '2 Recámaras de gran escala, cada una con su propio baño completo y vestidor',
        'Estancia / mezzanine con vista a la doble altura de la sala',
        'Cubo de escalera amplio y descansado con luz cenital'
      ],
      roof: [
        'Tercer nivel con master suite privada o family room con baño completo',
        'Roof Garden panorámico con pérgolas de 38.17 m² y área para asador',
        'Terraza posterior independiente para descanso o servicios'
      ]
    }
  }
};

/* --------------------------------------------------------------------------
   5. LÓGICA DEL CARRUSEL / SLIDER DE MODELOS RESIDENCIALES
   -------------------------------------------------------------------------- */
function initModelSwitcher() {
  const track = document.getElementById('modelsCarouselTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const pillBtns = document.querySelectorAll('.carousel-pill-btn');
  const dots = document.querySelectorAll('.carousel-dot');
  const counterNum = document.getElementById('carouselCurrentNum');
  const cards = document.querySelectorAll('.model-carousel-card');
  const bpModal = document.getElementById('blueprintModal');

  if (!track || cards.length === 0) return;

  let activeIndex = 0;

  function updateActiveUI(index) {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));

    // Actualizar píldoras superiores
    pillBtns.forEach((btn, i) => {
      if (i === activeIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Actualizar dots inferiores
    dots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Actualizar contador
    if (counterNum) {
      counterNum.textContent = String(activeIndex + 1);
    }
  }

  function scrollToSlide(index) {
    if (index < 0 || index >= cards.length) return;
    const targetCard = cards[index];
    const trackPadding = 4;
    const scrollTarget = targetCard.offsetLeft - track.offsetLeft - trackPadding;

    track.scrollTo({
      left: scrollTarget,
      behavior: 'smooth'
    });

    updateActiveUI(index);
  }

  // Click en flechas
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = activeIndex > 0 ? activeIndex - 1 : cards.length - 1;
      scrollToSlide(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = activeIndex < cards.length - 1 ? activeIndex + 1 : 0;
      scrollToSlide(newIndex);
    });
  }

  // Click en píldoras de modelos
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-slide-index'), 10);
      if (!isNaN(idx)) {
        scrollToSlide(idx);
      }
    });
  });

  // Click en dots inferiores
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      if (!isNaN(idx)) {
        scrollToSlide(idx);
      }
    });
  });

  // Sincronización continua de scroll con debounce/rAF
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft - track.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(trackCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      updateActiveUI(closestIndex);
    }, 60);
  }, { passive: true });

  // Toggle interactivo entre Fotografía y Plano Técnico en la tarjeta
  document.querySelectorAll('.view-toggle-btn').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = toggleBtn.getAttribute('data-target');
      const mode = toggleBtn.getAttribute('data-mode');
      const img = document.getElementById(targetId);
      if (!img) return;

      const parentToggle = toggleBtn.closest('.media-view-toggle');
      if (parentToggle) {
        parentToggle.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      }
      toggleBtn.classList.add('active');

      if (mode === 'plan') {
        const planSrc = img.getAttribute('data-plan');
        if (planSrc) {
          img.src = planSrc;
          img.classList.add('showing-plan');
        }
      } else {
        const photoSrc = img.getAttribute('data-photo');
        if (photoSrc) {
          img.src = photoSrc;
          img.classList.remove('showing-plan');
        }
      }
    });
  });

  // Apertura de Plano HD al hacer clic en imagen o botón
  document.querySelectorAll('[data-open-plan]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modelKey = trigger.getAttribute('data-open-plan');
      openPlanModalForModel(modelKey);
    });
  });

  function openPlanModalForModel(modelKey) {
    const model = modelsData[modelKey];
    const modalImg = document.getElementById('blueprintModalImg');
    const modalTitle = document.getElementById('blueprintModalTitle');
    const modalSub = document.getElementById('blueprintModalSubtitle');

    if (bpModal && model) {
      if (modalImg) {
        modalImg.src = model.planImage;
        modalImg.alt = `Plano arquitectónico oficial de ${model.name}`;
      }
      if (modalTitle) {
        modalTitle.textContent = `Plano Arquitectónico Oficial — ${model.name}`;
      }
      if (modalSub) {
        modalSub.innerHTML = `Construcción: <strong>${model.specs.construction}</strong> | Terreno: <strong>${model.specs.terrain}</strong> | Niveles: <strong>${model.specs.levels}</strong> | Solo 14 residencias.`;
      }
      if (typeof bpModal.showModal === 'function') {
        bpModal.showModal();
      }
    }
  }

  // Pre-fill model select on contact form
  document.querySelectorAll('.btn-card-wa').forEach(waBtn => {
    waBtn.addEventListener('click', () => {
      const card = waBtn.closest('.model-carousel-card');
      if (card) {
        const modelKey = card.getAttribute('data-model');
        const modelSelect = document.getElementById('leadModelInterest');
        if (modelSelect && modelKey) {
          const optionMap = {
            modeloA: 'Modelo A (215.76 m² · 3 Niveles · Lotes 2, 7 y 8 al 11)',
            modeloB: 'Modelo B (205.00 m² · 2 Niveles · PB 105 m² + PA 100 m² · Jardín 39 m²)',
            modeloC: 'Modelo C (190.00 m² · 2 Niveles · Suite en PB · Jardín 22.50 m²)',
            modeloD: 'Modelo D (231.21 m² · 3 Niveles · Pérgolas 38 m² · Jardín 61 m²)'
          };
          if (optionMap[modelKey]) {
            modelSelect.value = optionMap[modelKey];
          }
        }
      }
    });
  });

  // Estado inicial
  updateActiveUI(0);
}

/* --------------------------------------------------------------------------
   6. COMMUTE ROUTE SWITCHER (SANTA FE vs TOLUCA vs GOOGLE MAPS)
   -------------------------------------------------------------------------- */
function initCommuteRouteSwitcher() {
  const routeButtons = document.querySelectorAll('.commute-tab-btn');
  const routePanels = document.querySelectorAll('.commute-map-view-panel');

  routeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetRoute = btn.getAttribute('data-route');
      routeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      routePanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `commutePanel_${targetRoute}`) {
          panel.classList.add('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. NATIVE DIALOGS & BROCHURE DOWNLOAD
   -------------------------------------------------------------------------- */
function initModals() {
  const brochureModal = document.getElementById('brochureModal');
  const openBrochureBtns = document.querySelectorAll('.open-brochure-modal');
  const closeBrochureBtn = document.getElementById('closeBrochureModal');
  const brochureForm = document.getElementById('brochureDownloadForm');

  const bpModal = document.getElementById('blueprintModal');
  const closeBpModalBtn = document.getElementById('closeBlueprintModal');

  // Open Brochure Modal
  openBrochureBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (brochureModal && typeof brochureModal.showModal === 'function') {
        brochureModal.showModal();
      }
    });
  });

  // Close Brochure Modal
  if (closeBrochureBtn && brochureModal) {
    closeBrochureBtn.addEventListener('click', () => {
      brochureModal.close();
    });

    brochureModal.addEventListener('click', (e) => {
      const rect = brochureModal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        brochureModal.close();
      }
    });
  }

  // Close Blueprint Modal
  if (closeBpModalBtn && bpModal) {
    closeBpModalBtn.addEventListener('click', () => {
      bpModal.close();
    });

    bpModal.addEventListener('click', (e) => {
      const rect = bpModal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        bpModal.close();
      }
    });
  }

  // Master Plan Lightbox Modal
  const mpModal = document.getElementById('masterPlanModal');
  const openMpBtns = document.querySelectorAll('.open-masterplan-modal');
  const closeMpModalBtn = document.getElementById('closeMasterPlanModal');

  openMpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mpModal && typeof mpModal.showModal === 'function') {
        mpModal.showModal();
      }
    });
  });

  if (closeMpModalBtn && mpModal) {
    closeMpModalBtn.addEventListener('click', () => {
      mpModal.close();
    });

    mpModal.addEventListener('click', (e) => {
      const rect = mpModal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        mpModal.close();
      }
    });
  }

  if (brochureForm) {
    brochureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = brochureForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Generando Ficha & Planos...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '¡Descarga Lista!';
        triggerBrochureDownload();

        setTimeout(() => {
          if (brochureModal) brochureModal.close();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          brochureForm.reset();
        }, 1800);
      }, 1000);
    });
  }
}

function triggerBrochureDownload() {
  const brochureText = `
================================================================================
MOTUL ESPACIOS RESIDENCIALES — OCOYOACAC, ESTADO DE MÉXICO
DOSSIER EJECUTIVO DE PREVENTA & FICHA TÉCNICA
================================================================================
Condominio Residencial Horizontal Privado de solo 14 Casas.
Avenida 5 de mayo #21, Colonia Juárez, Ocoyoacac, Estado de México (C.P. 52740).
A solo 300 metros de la Autopista México–Toluca (Zona de Los Encinos).

DIMENSIONES OFICIALES:
• Construcción: 267 m² Habitables en 3 Niveles.
• Superficie de Terreno: Desde 140 m² hasta 220 m².
• Estacionamiento: 2 Automóviles (+ cajones de visitas en condominio).

CERTIFICACIÓN INTERNACIONAL EDGE ADVANCED (IFC / BANCO MUNDIAL):
• Ahorro certificado superior al 40% en energía eléctrica y más del 20% en agua.
• Sistema de paneles solares fotovoltaicos con medidor bidireccional CFE.
• 100% LIBRE DE CONSUMO DE GAS:
  - Calentador solar de agua + calentador eléctrico de respaldo.
  - Estufa contemporánea de inducción magnética (cero combustión, cero riesgo de fugas).
• Elegibilidad garantizada para Hipotecas Verdes bancarias con tasas de interés preferenciales.

DISTRIBUCIÓN ARQUITECTÓNICA POR NIVELES:
1. PLANTA BAJA:
   - Recibidor y 1/2 baño de visitas.
   - Bodega interior.
   - Sala y comedor de concepto abierto con vista al jardín.
   - Cocina integral con estufa de inducción.
   - Terraza social y jardín privado posterior.
   - Estacionamiento para 2 autos.

2. SEGUNDO NIVEL:
   - Recámara principal con baño completo privado y clóset vestidor.
   - 2 Recámaras secundarias con clóset de madera fina.
   - 1 Baño completo compartido para recámaras secundarias.
   - Sala de TV familiar y/o estudio.

3. TERCER NIVEL:
   - Estudio independiente y/o 4ª Recámara.
   - 1 Baño completo adicional.
   - Terraza Roof Garden panorámica.
   - Terraza trasera complementaria.
   - Cuarto de lavado cerrado con ventilación.
   - Cuarto de servicio independiente con baño completo propio.

AMENIDADES DEL CONJUNTO:
• Jardín común central de 230 m² equipado con:
  - Área de juegos infantiles.
  - Palapa para eventos y reuniones familiares.
  - Asadores equipados y sanitarios.
• Caseta de acceso y vigilancia 24 horas con circuito cerrado de CCTV.
• Bardas perimetrales electrificadas.
• Estacionamiento para visitas y cuarto de basura.

CONECTIVIDAD COMPROBADA:
- 20 minutos de Centro Comercial Santa Fe, CDMX (25.6 km).
- 27 minutos del Centro de Toluca (22.2 km).
- 10 minutos de la estación del Tren Interurbano México-Toluca (El Insurgente).
- 8 minutos de Plazas Outlet Lerma.
- 10 minutos de La Marquesa.

CONTACTO & INFORMES SHOWROOM:
Teléfono / WhatsApp Oficial: +52 55 8993 8477
Correo: contacto@remax-satelite.com
Horarios de visita: Lunes a Domingo de 10:00 am a 6:00 pm.
Sitio Web Oficial: https://espaciosmotul.mx/
================================================================================
Apegado a la NOM-247-SE-2021 de PROFECO.
`;

  const blob = new Blob([brochureText], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'Dossier-Oficial-MOTUL-Espacios-Residenciales.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/* --------------------------------------------------------------------------
   8. FORMULARIO DE CONVERSIÓN & INTEGRACIÓN CON WHATSAPP OFICIAL
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.getElementById('mainLeadForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  const phoneInput = document.getElementById('leadPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.substring(0, 10);
      e.target.value = val;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('leadName').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const model = document.getElementById('leadModelInterest').value;
    const payment = document.getElementById('leadPaymentMethod').value;
    const notes = document.getElementById('leadNotes')?.value.trim() || '';

    // Validation
    if (!name || name.length < 3) {
      showFeedback('Por favor introduce tu nombre completo.', 'error');
      return;
    }

    if (!phone || phone.length !== 10) {
      showFeedback('Introduce un número de teléfono celular válido a 10 dígitos.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFeedback('Introduce una dirección de correo electrónico válida.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Registrando Solicitud...';
    submitBtn.disabled = true;

    // Simulate sending lead
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // WhatsApp prefilled message to OFFICIAL phone 55 8993 8477
      const waText = encodeURIComponent(
        `Hola, deseo agendar una visita en MOTUL Espacios Residenciales (Ocoyoacac).\n\n` +
        `• Nombre: ${name}\n` +
        `• Teléfono: ${phone}\n` +
        `• Correo: ${email}\n` +
        `• Modelo / Configuración: ${model}\n` +
        `• Método de compra: ${payment}\n` +
        (notes ? `• Horario preferido: ${notes}\n` : '') +
        `\n¿Tienen disponibilidad este fin de semana para conocer la casa muestra?`
      );

      const waLink = `https://wa.me/525522500741?text=${waText}`;

      showFeedback(
        `¡Gracias por tu interés, ${name}! Hemos registrado tu solicitud exitosamente. Un asesor patrimonial te contactará de inmediato.<br><br>` +
        `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="display:inline-flex;margin-top:0.5rem;">` +
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.787.828 2.802.828 3.176 0 5.764-2.588 5.765-5.766 0-3.18-2.587-5.767-5.771-5.771-5.771-5.771zm7.643 5.766c0 4.218-3.434 7.652-7.65 7.652-.962 0-1.892-.18-2.747-.506l-3.864 1.013 1.032-3.774a7.618 7.618 0 01-.659-3.085c0-4.218 3.434-7.652 7.65-7.652 4.218 0 7.652 3.434 7.652 7.652z"/></svg>` +
        `Continuar por WhatsApp Directo (+52 55 8993 8477)</a>`,
        'success'
      );

      form.reset();
    }, 850);
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.innerHTML = msg;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION (MUTUALLY EXCLUSIVE DETAILS)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const detailsElements = document.querySelectorAll('.faq-item');

  detailsElements.forEach(targetDetail => {
    targetDetail.addEventListener('toggle', () => {
      if (targetDetail.open) {
        detailsElements.forEach(detail => {
          if (detail !== targetDetail && detail.open) {
            detail.removeAttribute('open');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}
