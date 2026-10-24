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
  { lote: 1, m2: 181.00, status: 'preventa', label: 'PREVENTA', highlight: 'Esquina cabecera · Frente amplio', desc: 'Lote cabecera con máxima iluminación y amplitud de fachada.' },
  { lote: 2, m2: 140.00, status: 'venta', label: 'VENTA', highlight: 'Venta Inmediata · 140 m²', desc: 'Ubicación ágil y acceso inmediato al pórtico de seguridad.' },
  { lote: 3, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 4, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 5, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 6, m2: 140.00, status: 'vendido', label: 'VENDIDO', highlight: 'Residencia Consolidada', desc: 'Lote vendido a propietario residencial.' },
  { lote: 7, m2: 140.00, status: 'venta', label: 'VENTA', highlight: 'Venta Inmediata · 140 m²', desc: 'Excelente orientación solar central con entorno residencial apacible.' },
  { lote: 8, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Preventa · 154 m²', desc: 'Superficie ideal para Modelo A o Modelo B con jardín privado.' },
  { lote: 9, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Preventa · 154 m²', desc: 'Lote regular de 154 m², cochera para 2 autos y doble acceso.' },
  { lote: 10, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Preventa · 154 m²', desc: 'Frente regular de 154 m² en zona residencial muy tranquila.' },
  { lote: 11, m2: 154.00, status: 'preventa', label: 'PREVENTA', highlight: 'Preventa · 154 m²', desc: 'Lote extremo poniente, máxima privacidad y sin tránsito cruzado.' },
  { lote: 12, m2: 211.52, status: 'preventa', label: 'PREVENTA', highlight: 'Gran Terreno · 211.52 m²', desc: 'Manzana norte exclusiva, terreno amplio ideal para Modelo C con Roof Garden.' },
  { lote: 13, m2: 228.92, status: 'preventa', label: 'PREVENTA', highlight: '¡Lote Insignia! 228.92 m²', desc: 'El terreno más grande del desarrollo, máximo jardín privado y privacidad.' },
  { lote: 14, m2: 211.80, status: 'preventa', label: 'PREVENTA', highlight: 'Junto a Amenidades · 211.80 m²', desc: 'Colindancia directa al jardín común de 230 m², juegos infantiles y palapa.' }
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
            <a href="https://wa.me/525589938477?text=${waMsg}" 
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
   4. DATA AND LOGIC FOR THE 3 OFFICIAL HOUSE MODELS (A, B, C)
   -------------------------------------------------------------------------- */
const modelsData = {
  modeloA: {
    id: 'modeloA',
    name: 'Modelo A · 190 m²',
    subtitle: '2 Niveles · 3 Recámaras con Suite en Planta Baja y Terraza Lounge',
    badge: '190 m² Const. · 154 m² Terreno',
    desc: 'Diseño arquitectónico en 2 plantas con máxima funcionalidad y accesibilidad. Destaca por contar con una recámara en Planta Baja con baño completo y vestidor (ideal para accesibilidad total o huéspedes), estancia integrada con vista a jardín de 22.50 m², cocina de inducción (cero gas) y una gran terraza / deck exterior en Planta Alta con sala lounge y jardineras.',
    specs: {
      construction: '190 m²',
      terrain: '154 m²',
      garden: '22.50 m²',
      parking: '2 Autos',
      bedrooms: '3 Recámaras (1 en PB)',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '2 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_a.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_a.webp', alt: 'Plano Arquitectónico Oficial Modelo A', isPlan: true },
      { src: 'assets/images/real_fachada_conjunto.jpg', alt: 'Fachada Conjunto Residencial' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia Sala & Comedor' },
      { src: 'assets/images/real_recamara_principal.jpg', alt: 'Recámara con Vestidor y Baño' },
      { src: 'assets/images/real_terraza.jpg', alt: 'Terraza Deck Exterior' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja' },
      { key: 'alta', label: 'Planta Alta' }
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

  modeloB: {
    id: 'modeloB',
    name: 'Modelo B · 205 m²',
    subtitle: '2 Niveles · Master Suite con Tina y Gran Jardín de 39 m²',
    badge: '205 m² Const. · 154 m² Terreno',
    desc: 'Equilibrio perfecto entre amplitud social y confort íntimo. Ofrece una amplísima estancia abierta con ventanales que conectan a una terraza cubierta y un generoso jardín privado de 39 m² con sanitario y bodega exterior. En planta alta, la Master Suite incorpora un lujoso baño tipo spa con tina de hidromasaje, doble lavabo y vestidor walk-in.',
    specs: {
      construction: '205 m²',
      terrain: '154 m²',
      garden: '39 m²',
      parking: '2 Autos',
      bedrooms: '3 Recámaras',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '2 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_b.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_b.webp', alt: 'Plano Arquitectónico Oficial Modelo B', isPlan: true },
      { src: 'assets/images/real_recamara_principal.jpg', alt: 'Master Suite con Tina y Vestidor' },
      { src: 'assets/images/real_bano.jpg', alt: 'Baño de Lujo con Tina y Doble Lavabo' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia Abierta a Jardín 39m²' },
      { src: 'assets/images/real_cocina.jpg', alt: 'Cocina Integral de Inducción' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja' },
      { key: 'alta', label: 'Planta Alta' }
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
    name: 'Modelo C · 231 m²',
    subtitle: '3 Niveles · Doble Terraza, Roof Garden y Gran Jardín de 61 m²',
    badge: '231 m² Const. · 220 m² Terreno',
    desc: 'La residencia insignia de mayor metraje en Motul sobre lote de 220 m². Desarrollada en 3 niveles con cochera para 3 autos, doble altura en estancia, majestuoso jardín de 61 m² aprox. y un tercer nivel con Roof Garden panorámico frontal y terraza posterior con vistas al bosque.',
    specs: {
      construction: '231 m²',
      terrain: '220 m²',
      garden: '61 m² aprox.',
      parking: '3 Autos',
      bedrooms: '3 Recámaras Totales',
      bathrooms: '3 Baños + 1 Sanitario',
      levels: '3 Plantas'
    },
    planImage: 'assets/images/modelos/modelo_c.webp',
    thumbnails: [
      { src: 'assets/images/modelos/modelo_c.webp', alt: 'Plano Arquitectónico Oficial Modelo C', isPlan: true },
      { src: 'assets/images/real_terraza.jpg', alt: 'Roof Garden y Doble Terraza' },
      { src: 'assets/images/real_sala_comedor.jpg', alt: 'Estancia con Doble Altura' },
      { src: 'assets/images/real_estudio.jpg', alt: 'Family Room / 3er Nivel' },
      { src: 'assets/images/real_fachada_principal.jpg', alt: 'Fachada Arquitectónica 3 Niveles' }
    ],
    floorTabs: [
      { key: 'baja', label: 'Planta Baja' },
      { key: 'nivel1', label: '1er Nivel' },
      { key: 'roof', label: '2do Nivel / Roof' }
    ],
    floors: {
      baja: [
        'Cochera amplia para 3 automóviles (o 2 camionetas + área de maniobra)',
        'Vestíbulo de acceso con medio baño de cortesía (sanitario)',
        'Cocina de autor equipada con estufa de inducción electromagnética',
        'Estancia sala-comedor con espectacular doble altura y cancelería panorámica',
        'Terraza exterior techada y enorme jardín privado de 61 m² aprox.'
      ],
      nivel1: [
        '2 Recámaras de gran escala, cada una con su propio baño completo y vestidor',
        'Estancia / mezzanine con vista a la doble altura de la sala',
        'Cubo de escalera amplio y descansado con luz cenital'
      ],
      roof: [
        'Tercer nivel con 3ra recámara / master suite privada o family room con baño completo',
        'Roof Garden panorámico al frente con espacio para asador y sala exterior',
        'Terraza posterior independiente para descanso o servicios'
      ]
    }
  }
};

let currentModelKey = 'modeloA';
let currentFloorKey = 'baja';

function initModelSwitcher() {
  const modelTabButtons = document.querySelectorAll('.tab-btn-model');
  const ctaModelBtn = document.getElementById('ctaModelRequest');
  const mainImgWrapper = document.getElementById('modelMainRenderWrapper');
  const bpModal = document.getElementById('blueprintModal');

  // Handle Model Tab clicks
  modelTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetModel = button.getAttribute('data-model');
      if (targetModel && modelsData[targetModel]) {
        currentModelKey = targetModel;
        const model = modelsData[currentModelKey];
        currentFloorKey = model.floorTabs[0].key; // Reset to first floor tab of that model

        modelTabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        renderActiveModel();
      }
    });
  });

  // Clicking main render wrapper (or zoom button) opens wide modal
  if (mainImgWrapper && bpModal) {
    mainImgWrapper.addEventListener('click', () => {
      openPlanModalForCurrentModel();
    });
  }

  // Pre-fill model interest when clicking CTA
  if (ctaModelBtn) {
    ctaModelBtn.addEventListener('click', () => {
      const modelSelect = document.getElementById('leadModelInterest');
      if (modelSelect) {
        const optionMap = {
          modeloA: 'Modelo A (190 m² · 2 Niveles · Suite en PB)',
          modeloB: 'Modelo B (205 m² · 2 Niveles · Master Suite con Tina)',
          modeloC: 'Modelo C (231 m² · 3 Niveles · Roof Garden)'
        };
        modelSelect.value = optionMap[currentModelKey] || 'Modelo A (190 m² · 2 Niveles · Suite en PB)';
      }
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Initial render
  renderActiveModel();
}

function openPlanModalForCurrentModel() {
  const bpModal = document.getElementById('blueprintModal');
  const modalImg = document.getElementById('blueprintModalImg');
  const modalTitle = document.getElementById('blueprintModalTitle');
  const modalSub = document.getElementById('blueprintModalSubtitle');
  const model = modelsData[currentModelKey];

  if (bpModal && model) {
    if (modalImg) {
      modalImg.src = model.planImage;
      modalImg.alt = `Plano arquitectónico oficial de ${model.name}`;
    }
    if (modalTitle) {
      modalTitle.textContent = `Plano Arquitectónico Oficial — ${model.name}`;
    }
    if (modalSub) {
      modalSub.innerHTML = `Construcción: <strong>${model.specs.construction}</strong> | Terreno: <strong>${model.specs.terrain}</strong> | Jardín: <strong>${model.specs.garden}</strong> | Solo 14 casas.`;
    }
    if (typeof bpModal.showModal === 'function') {
      bpModal.showModal();
    }
  }
}

function renderActiveModel() {
  const model = modelsData[currentModelKey];
  if (!model) return;

  // Title, subtitle, badge, desc
  const titleEl = document.getElementById('modelNameDisplay');
  const subtitleEl = document.getElementById('modelSubtitleDisplay');
  const badgeEl = document.getElementById('modelBadgeDisplay');
  const descEl = document.getElementById('modelDescDisplay');

  if (titleEl) titleEl.textContent = model.name;
  if (subtitleEl) subtitleEl.textContent = model.subtitle;
  if (badgeEl) badgeEl.textContent = model.badge;
  if (descEl) descEl.textContent = model.desc;

  // Key Specs
  const specConstEl = document.getElementById('specConst');
  const specGardenEl = document.getElementById('specGarden');
  const specParkingEl = document.getElementById('specParking');
  const specBedsEl = document.getElementById('specBeds');
  const specBathsEl = document.getElementById('specBaths');
  const specLevelsEl = document.getElementById('specLevels');

  if (specConstEl) specConstEl.textContent = model.specs.construction;
  if (specGardenEl) specGardenEl.textContent = `${model.specs.terrain} / Jardín ${model.specs.garden}`;
  if (specParkingEl) specParkingEl.textContent = model.specs.parking;
  if (specBedsEl) specBedsEl.textContent = model.specs.bedrooms;
  if (specBathsEl) specBathsEl.textContent = model.specs.bathrooms;
  if (specLevelsEl) specLevelsEl.textContent = model.specs.levels;

  // Main Image defaults to the official floor plan
  const mainImgEl = document.getElementById('modelMainImg');
  const renderWrapper = document.getElementById('modelMainRenderWrapper');
  if (mainImgEl) {
    mainImgEl.src = model.planImage;
    mainImgEl.alt = `${model.name} — Plano Oficial MOTUL Espacios Residenciales`;
  }
  if (renderWrapper) {
    renderWrapper.classList.add('showing-plan');
  }

  // Update dynamic WhatsApp quote button
  const ctaModelWa = document.getElementById('ctaModelRequestWa');
  const ctaModelText = document.getElementById('ctaModelRequestText');
  if (ctaModelWa) {
    const waMsg = encodeURIComponent(`Hola, solicito la cotización y corrida financiera del ${model.name} (${model.specs.construction}) en MOTUL Espacios Residenciales.`);
    ctaModelWa.href = `https://wa.me/525589938477?text=${waMsg}`;
  }
  if (ctaModelText) {
    ctaModelText.textContent = `Cotizar ${model.name.split('·')[0].trim()} por WhatsApp`;
  }

  renderFloorTabs(model);
  renderThumbnails(model);
  renderFloorFeatures();
}

function renderFloorTabs(model) {
  const tabsContainer = document.getElementById('floorTabsContainer');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';
  model.floorTabs.forEach((tab, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `floor-tab-btn ${tab.key === currentFloorKey ? 'active' : ''}`;
    btn.setAttribute('data-floor', tab.key);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.key === currentFloorKey ? 'true' : 'false');
    btn.textContent = tab.label;

    btn.addEventListener('click', () => {
      currentFloorKey = tab.key;
      tabsContainer.querySelectorAll('.floor-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderFloorFeatures();
    });

    tabsContainer.appendChild(btn);
  });
}

function renderThumbnails(model) {
  const container = document.getElementById('modelThumbnailsContainer');
  if (!container) return;

  container.innerHTML = '';
  model.thumbnails.forEach((thumb, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `thumb-btn ${idx === 0 ? 'active' : ''}`;
    btn.setAttribute('aria-label', thumb.alt);
    btn.innerHTML = `<img src="${thumb.src}" alt="${thumb.alt}" loading="lazy" width="120" height="80">`;

    btn.addEventListener('click', () => {
      const mainImg = document.getElementById('modelMainImg');
      const renderWrapper = document.getElementById('modelMainRenderWrapper');
      if (mainImg) {
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt;
      }
      if (renderWrapper) {
        if (thumb.isPlan) {
          renderWrapper.classList.add('showing-plan');
        } else {
          renderWrapper.classList.remove('showing-plan');
        }
      }
      container.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    container.appendChild(btn);
  });
}

function renderFloorFeatures() {
  const model = modelsData[currentModelKey];
  const listEl = document.getElementById('floorFeaturesList');
  if (!model || !listEl) return;

  const features = model.floors[currentFloorKey] || [];
  listEl.innerHTML = '';

  features.forEach(feat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${feat}</span>
    `;
    listEl.appendChild(li);
  });
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
Condominio Residencial Horizontal Boutique de solo 14 Casas.
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

      const waLink = `https://wa.me/525589938477?text=${waText}`;

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
