/* ==========================================================================
   MOTUL · COTIZADOR COMERCIAL
   Fuente de precios: Lista de Precios Octubre 2026 (PDF oficial).
   Para actualizar precios / disponibilidad edita únicamente LOTS y CONFIG.
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     1. CONFIGURACIÓN
     ------------------------------------------------------------------ */
  const CONFIG = {
    whatsappDefault: '5522500741',
    site: 'espaciosmotul.mx',
    priceList: 'Lista de precios Octubre 2026',
    downOptions: [10, 15, 20, 30, 40, 50],
    defaultDown: 20,
    termOptions: [5, 10, 15, 20],
    defaultTerm: 20,
    defaultRate: 11.0,        // Tasa promedio bancaria hipotecaria en México (editable en pantalla)
    defaultHold: 50000,       // Apartado
    defaultClosingPct: 6,     // Gastos de escrituración estimados (Edomex ≈ 5–7%)
    incomeRatio: 0.33,        // Capacidad de pago: mensualidad ≤ 33% del ingreso
    validityDays: 7,
    planSize: [625, 520],     // Dimensiones de master_plan_clean.jpg (coordenadas de lotes)
    storageAdvisor: 'motul_cz_advisor',
    storageHistory: 'motul_cz_history',
    historyMax: 40
  };

  const MODELS = {
    A: {
      name: 'Modelo A', construction: 215.76, levels: '3 niveles', beds: '3 recámaras', baths: '3 baños + 1 sanitario',
      extraLabel: 'Destacado', extraValue: 'Roof garden', tagline: '3 niveles · Roof garden privado',
      photo: '/assets/images/real_fachada_conjunto.jpg', plan: '/assets/images/modelos/modelo_a.jpg'
    },
    B: {
      name: 'Modelo B', construction: 205.0, levels: '2 niveles', beds: '3 recámaras', baths: '3 baños + 1 sanitario',
      extraLabel: 'Jardín', extraValue: '39 m²', tagline: '2 niveles · Jardín de 39 m²',
      photo: '/assets/images/real_bano.jpg', plan: '/assets/images/modelos/modelo_b.jpg'
    },
    C: {
      name: 'Modelo C', construction: 190.0, levels: '2 niveles', beds: '3 recámaras (1 en PB)', baths: '3 baños + 1 sanitario',
      extraLabel: 'Jardín', extraValue: '22.50 m²', tagline: '2 niveles · Recámara en PB',
      photo: '/assets/images/real_sala_comedor.jpg', plan: '/assets/images/modelos/modelo_c.jpg'
    },
    D: {
      name: 'Modelo D', construction: 231.21, levels: '3 niveles', beds: '3 recámaras', baths: '3 baños + 1 sanitario',
      extraLabel: 'Jardín / Pérgolas', extraValue: '61.22 / 38.17 m²', tagline: '3 niveles · Jardín de 61 m²',
      photo: '/assets/images/real_fachada_principal.jpg', plan: '/assets/images/modelos/modelo_d.jpg'
    }
  };

  // rect = [x1, y1, x2, y2] en px sobre master_plan_clean.jpg (625×520)
  const LOTS = [
    { n: 1,  m2: 181,    etapa: 2, status: 'preventa', entrega: '6 meses',   models: { D: 6300000 }, rect: [511, 351, 559, 428] },
    { n: 2,  m2: 140,    etapa: 1, status: 'entrega',  entrega: 'Inmediata', models: { A: 5000000 }, rect: [461, 340, 509, 427] },
    { n: 3,  m2: 140,    etapa: 1, status: 'vendido',  entrega: '',          models: {},             rect: [413, 340, 460, 427] },
    { n: 4,  m2: 140,    etapa: 1, status: 'vendido',  entrega: '',          models: {},             rect: [364, 340, 412, 427] },
    { n: 5,  m2: 140,    etapa: 1, status: 'vendido',  entrega: '',          models: {},             rect: [315, 340, 363, 427] },
    { n: 6,  m2: 140,    etapa: 1, status: 'vendido',  entrega: '',          models: {},             rect: [266, 340, 314, 427] },
    { n: 7,  m2: 140,    etapa: 1, status: 'entrega',  entrega: '3 meses',   models: { A: 5000000 }, rect: [217, 340, 265, 427] },
    { n: 8,  m2: 154,    etapa: 2, status: 'preventa', entrega: '6 meses',   models: { A: 5200000, B: 4950000, C: 4750000 }, rect: [169, 340, 216, 427] },
    { n: 9,  m2: 154,    etapa: 2, status: 'preventa', entrega: '6 meses',   models: { A: 5200000, B: 4950000, C: 4750000 }, rect: [123, 340, 168, 427] },
    { n: 10, m2: 154,    etapa: 2, status: 'preventa', entrega: '6 meses',   models: { A: 5200000, B: 4950000, C: 4750000 }, rect: [77, 340, 122, 427] },
    { n: 11, m2: 154,    etapa: 2, status: 'preventa', entrega: '6 meses',   models: { A: 5200000, B: 4950000, C: 4750000 }, rect: [23, 340, 76, 427] },
    { n: 12, m2: 211.52, etapa: 2, status: 'preventa', entrega: '6 meses',   models: { D: 6500000 }, rect: [41, 118, 87, 203] },
    { n: 13, m2: 220.92, etapa: 2, status: 'preventa', entrega: '6 meses',   models: { D: 6580000 }, rect: [88, 118, 135, 203] },
    { n: 14, m2: 211.8,  etapa: 2, status: 'preventa', entrega: '6 meses',   models: { D: 6500000 }, rect: [136, 118, 186, 203] }
  ];

  const STATUS_LABEL = { preventa: 'Preventa', entrega: 'Entrega próxima', vendido: 'Vendido' };

  /* ------------------------------------------------------------------
     2. ESTADO
     ------------------------------------------------------------------ */
  const defaultState = () => ({
    lot: null,
    model: null,
    method: 'credito',
    down: CONFIG.defaultDown,
    term: CONFIG.defaultTerm,
    rate: CONFIG.defaultRate,
    defer: 1,
    hold: CONFIG.defaultHold,
    discount: 0,
    closing: CONFIG.defaultClosingPct,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientIncome: 0
  });

  let state = defaultState();
  let currentFolio = null;

  /* ------------------------------------------------------------------
     3. UTILIDADES
     ------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);
  const fmtMoney = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const money = (v) => fmtMoney.format(Math.round(v || 0));
  const m2 = (v) => Number(v).toLocaleString('es-MX', { maximumFractionDigits: 2 });
  const pad = (n) => String(n).padStart(2, '0');
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const toNum = (s) => Number(digits(s)) || 0;
  const groupThousands = (s) => { const d = digits(s); return d ? Number(d).toLocaleString('es-MX') : ''; };
  const fmtPhone = (s) => { const d = digits(s).slice(0, 10); return [d.slice(0, 2), d.slice(2, 6), d.slice(6, 10)].filter(Boolean).join(' '); };
  const fmtDate = (d) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  const getLot = (n) => LOTS.find((l) => l.n === n) || null;

  function pmt(principal, ratePct, years) {
    if (!principal || principal <= 0) return 0;
    const r = ratePct / 100 / 12;
    const n = years * 12;
    if (!r) return principal / n;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }

  function compute(s, o = {}) {
    const lot = getLot(s.lot);
    const list = lot && s.model ? lot.models[s.model] || 0 : 0;
    const down = o.down ?? s.down;
    const term = o.term ?? s.term;
    const discount = Math.min(s.discount || 0, list);
    const price = list - discount;
    const downAmt = Math.round((price * down) / 100);
    const hold = Math.min(s.hold || 0, downAmt);
    const deferBal = downAmt - hold;
    const deferPay = deferBal / (s.defer || 1);
    const finance = price - downAmt;
    const isCredit = s.method === 'credito';
    const monthly = isCredit ? pmt(finance, s.rate, term) : 0;
    const closing = (price * (s.closing || 0)) / 100;
    const initial = downAmt + closing;
    const income = monthly / CONFIG.incomeRatio;
    return { lot, list, discount, price, down, term, downAmt, hold, deferBal, deferPay, finance, isCredit, monthly, closing, initial, income, ready: !!list };
  }

  let toastTimer;
  function toast(msg, isError = false) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.toggle('error', isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
  }

  function setState(patch) {
    Object.assign(state, patch);
    currentFolio = null;
    render();
  }

  /* ------------------------------------------------------------------
     4. RENDER: PLANO + LOTES
     ------------------------------------------------------------------ */
  function buildPlan() {
    const canvas = $('planCanvas');
    const [PW, PH] = CONFIG.planSize;
    LOTS.forEach((lot) => {
      const [x1, y1, x2, y2] = lot.rect;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cz-hotspot' + (lot.status === 'vendido' ? ' is-sold' : '');
      b.dataset.lot = lot.n;
      b.style.left = (x1 / PW) * 100 + '%';
      b.style.top = (y1 / PH) * 100 + '%';
      b.style.width = ((x2 - x1) / PW) * 100 + '%';
      b.style.height = ((y2 - y1) / PH) * 100 + '%';
      const tip = lot.status === 'vendido'
        ? `Lote ${pad(lot.n)} · Vendido`
        : `Lote ${pad(lot.n)} · ${m2(lot.m2)} m² · Desde ${money(Math.min(...Object.values(lot.models)))}`;
      b.setAttribute('aria-label', tip);
      if (lot.status === 'vendido') b.setAttribute('aria-disabled', 'true');
      b.innerHTML = `<span class="cz-hotspot-tip">${tip}</span>`;
      b.addEventListener('click', () => selectLot(lot.n));
      canvas.appendChild(b);
    });

    const chips = $('lotChips');
    LOTS.filter((l) => l.status !== 'vendido').forEach((lot) => {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'cz-lot-chip' + (lot.status === 'entrega' ? ' is-entrega' : '');
      c.dataset.lot = lot.n;
      c.setAttribute('role', 'option');
      c.innerHTML = `<i class="cz-chip-flag"></i><strong>Lote ${pad(lot.n)}</strong><span>${m2(lot.m2)} m² · ${Object.keys(lot.models).join(' / ')}</span><span>Entrega ${lot.entrega.toLowerCase()}</span>`;
      c.addEventListener('click', () => selectLot(lot.n));
      chips.appendChild(c);
    });
  }

  function selectLot(n) {
    const lot = getLot(n);
    if (!lot) return;
    if (lot.status === 'vendido') { toast(`El lote ${pad(n)} ya está vendido.`, true); return; }
    const keys = Object.keys(lot.models);
    const model = keys.includes(state.model) ? state.model : (keys.length === 1 ? keys[0] : null);
    setState({ lot: n, model });
    if (keys.length > 1 && !model && window.innerWidth < 1080) {
      $('stepModelo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderModels() {
    const wrap = $('modelCards');
    const lot = getLot(state.lot);
    wrap.innerHTML = '';
    if (!lot) {
      $('modelHint').textContent = 'Selecciona primero un lote para ver los modelos disponibles.';
      wrap.innerHTML = '<div class="cz-models-empty">Elige un lote en el plano para ver los modelos que se pueden construir en él.</div>';
      return;
    }
    const keys = Object.keys(lot.models);
    $('modelHint').textContent = keys.length > 1
      ? `El lote ${pad(lot.n)} (${m2(lot.m2)} m²) permite elegir entre ${keys.length} modelos.`
      : `El lote ${pad(lot.n)} (${m2(lot.m2)} m²) se entrega con ${MODELS[keys[0]].name}.`;

    keys.forEach((k) => {
      const m = MODELS[k];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'cz-model' + (state.model === k ? ' is-active' : '');
      card.innerHTML = `
        <div class="cz-model-img">
          <img src="${m.photo}" alt="${m.name}" loading="lazy">
          <span class="cz-model-check">${state.model === k ? '✓' : ''}</span>
        </div>
        <div class="cz-model-body">
          <span class="cz-model-name">${m.name}</span>
          <span class="cz-model-meta">${m2(m.construction)} m² const. · ${m.tagline}</span>
          <span class="cz-model-price">${money(lot.models[k])}</span>
          <a class="cz-model-plan-link" href="${m.plan}" target="_blank" rel="noopener">Ver plano</a>
        </div>`;
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        setState({ model: k });
      });
      wrap.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------
     5. RENDER: CONTROLES DE PAGO
     ------------------------------------------------------------------ */
  function buildChips() {
    const down = $('downChips');
    CONFIG.downOptions.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cz-chip';
      b.dataset.value = p;
      b.innerHTML = `${p}%<small>—</small>`;
      b.addEventListener('click', () => setState({ down: p }));
      down.appendChild(b);
    });

    const term = $('termChips');
    CONFIG.termOptions.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cz-chip';
      b.dataset.value = t;
      b.innerHTML = `${t} años`;
      b.addEventListener('click', () => setState({ term: t }));
      term.appendChild(b);
    });

    $('payMethod').querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => setState({ method: b.dataset.value }));
    });
  }

  function renderControls(c) {
    $('downChips').querySelectorAll('.cz-chip').forEach((b) => {
      const p = Number(b.dataset.value);
      b.classList.toggle('active', p === state.down);
      const amt = c.ready ? money((c.price * p) / 100) : '—';
      b.querySelector('small').textContent = amt;
    });
    $('termChips').querySelectorAll('.cz-chip').forEach((b) => b.classList.toggle('active', Number(b.dataset.value) === state.term));
    $('payMethod').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.value === state.method));
    $('termField').hidden = !c.isCredit;
    $('rateField').style.visibility = c.isCredit ? 'visible' : 'hidden';
  }

  /* ------------------------------------------------------------------
     6. RENDER: RESUMEN, TABLA Y PRECALIFICACIÓN
     ------------------------------------------------------------------ */
  function renderSummary(c) {
    const lot = c.lot;
    const model = state.model ? MODELS[state.model] : null;

    $('sumTitle').textContent = lot ? `Lote ${pad(lot.n)}${model ? ' · ' + model.name : ''}` : 'Selecciona un lote';
    $('sumMeta').textContent = lot
      ? `${m2(lot.m2)} m² terreno${model ? ' · ' + m2(model.construction) + ' m² const.' : ''} · Entrega ${lot.entrega.toLowerCase()}`
      : 'Plano general del sembrado · 14 residencias';

    let heroLabel, heroValue, heroSub;
    if (!c.ready) {
      heroLabel = c.isCredit ? 'Mensualidad estimada' : 'Saldo a la entrega';
      heroValue = '$0';
      heroSub = lot ? 'Selecciona un modelo' : 'Selecciona lote y modelo';
    } else if (c.isCredit) {
      heroLabel = 'Mensualidad estimada';
      heroValue = money(c.monthly);
      heroSub = `${state.term} años · tasa ${state.rate.toFixed(2)}% · crédito ${money(c.finance)}`;
    } else {
      heroLabel = 'Saldo a la entrega';
      heroValue = money(c.finance);
      heroSub = `Recursos propios · entrega ${lot.entrega.toLowerCase()}`;
    }
    $('sumHeroLabel').textContent = heroLabel;
    $('sumHeroValue').textContent = heroValue;
    $('sumHeroSub').textContent = heroSub;
    $('mbLabel').textContent = heroLabel;
    $('mbValue').textContent = heroValue;

    $('sumList').textContent = money(c.list);
    $('rowDiscount').hidden = !c.discount;
    $('sumDiscount').textContent = '-' + money(c.discount);
    $('sumPrice').textContent = money(c.price);
    $('sumDownLabel').textContent = `Enganche (${state.down}%)`;
    $('sumDown').textContent = money(c.downAmt);
    $('sumHold').textContent = money(c.hold);
    $('sumDeferLabel').textContent = state.defer > 1
      ? `Saldo enganche · ${state.defer} pagos de ${money(c.deferPay)}`
      : 'Saldo de enganche (1 exhibición)';
    $('sumDefer').textContent = money(c.deferBal);
    $('sumFinanceLabel').textContent = c.isCredit ? 'Monto a financiar' : 'Saldo a liquidar en la entrega';
    $('sumFinance').textContent = money(c.finance);
    $('sumClosing').textContent = money(c.closing);
    $('sumInitial').textContent = money(c.initial);

    // Comparativa rápida de plazos
    const terms = $('termsCompare');
    terms.hidden = !c.isCredit;
    terms.innerHTML = '';
    if (c.isCredit) {
      CONFIG.termOptions.forEach((t) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cz-term' + (t === state.term ? ' active' : '');
        b.innerHTML = `<span>${t} años</span><strong>${c.ready ? money(pmt(c.finance, state.rate, t)) : '—'}</strong>`;
        b.addEventListener('click', () => setState({ term: t }));
        terms.appendChild(b);
      });
    }
  }

  function minFittingDown(c) {
    const maxPay = state.clientIncome * CONFIG.incomeRatio;
    return CONFIG.downOptions.find((p) => compute(state, { down: p }).monthly <= maxPay) || null;
  }

  function renderQualify(c) {
    const box = $('qualifyBox');
    if (!c.ready || !c.isCredit || !state.clientIncome) { box.hidden = true; return; }
    const ratio = c.monthly / state.clientIncome;
    const pct = Math.round(ratio * 100);
    box.hidden = false;
    if (ratio <= CONFIG.incomeRatio) {
      box.className = 'cz-qualify ok';
      box.innerHTML = `<span>✔</span><span><strong>Precalificación favorable.</strong> La mensualidad representa el ${pct}% del ingreso (recomendado ≤ ${Math.round(CONFIG.incomeRatio * 100)}%).</span>`;
    } else {
      const fit = minFittingDown(c);
      const longest = Math.max(...CONFIG.termOptions);
      const tip = fit
        ? `Con enganche del <strong>${fit}%</strong> a ${state.term} años la mensualidad sí entra en su capacidad.`
        : (state.term < longest ? `Prueba con plazo de ${longest} años, co-acreditado o Cofinavit.` : 'Considera co-acreditado, Cofinavit o mayor enganche.');
      box.className = 'cz-qualify warn';
      box.innerHTML = `<span>⚠</span><span><strong>La mensualidad equivale al ${pct}% del ingreso.</strong> ${tip}</span>`;
    }
  }

  function renderTable(c) {
    const tbody = $('compareTable').querySelector('tbody');
    $('thFinance').textContent = c.isCredit ? 'A financiar' : 'Saldo a la entrega';
    $('thMonthly').textContent = c.isCredit ? `Mensualidad (${state.term} años)` : 'Gastos escrit.';
    $('thIncome').textContent = c.isCredit ? 'Ingreso sugerido' : 'Desembolso inicial';
    tbody.innerHTML = '';
    const maxPay = state.clientIncome ? state.clientIncome * CONFIG.incomeRatio : null;

    CONFIG.downOptions.forEach((p) => {
      const r = compute(state, { down: p });
      const tr = document.createElement('tr');
      if (p === state.down) tr.className = 'is-active';
      let col4, col5;
      if (c.isCredit) {
        col4 = r.ready ? money(r.monthly) : '—';
        const fitCls = maxPay && r.ready ? (r.monthly <= maxPay ? 'fit-ok' : 'fit-no') : '';
        col5 = r.ready ? `<span class="${fitCls}">${money(r.income)}</span>` : '—';
      } else {
        col4 = r.ready ? money(r.closing) : '—';
        col5 = r.ready ? money(r.initial) : '—';
      }
      tr.innerHTML = `
        <td><span class="pct-tag">${p}%</span></td>
        <td>${r.ready ? money(r.downAmt) : '—'}</td>
        <td>${r.ready ? money(r.finance) : '—'}</td>
        <td><strong>${col4}</strong></td>
        <td>${col5}</td>`;
      tr.addEventListener('click', () => setState({ down: p }));
      tbody.appendChild(tr);
    });
  }

  function renderPlanState() {
    document.querySelectorAll('.cz-hotspot, .cz-lot-chip').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.lot) === state.lot);
    });
  }

  let lastModelsKey = null;
  function render() {
    const c = compute(state);
    renderPlanState();
    const modelsKey = `${state.lot}-${state.model}`;
    if (modelsKey !== lastModelsKey) { renderModels(); lastModelsKey = modelsKey; }
    renderControls(c);
    renderSummary(c);
    renderQualify(c);
    renderTable(c);
  }

  /* ------------------------------------------------------------------
     7. FORMULARIO (inputs) + ASESOR
     ------------------------------------------------------------------ */
  function syncInputsFromState() {
    $('rateInput').value = state.rate.toFixed(2);
    $('deferSelect').value = String(state.defer);
    $('holdInput').value = groupThousands(state.hold);
    $('discountInput').value = groupThousands(state.discount) || '0';
    $('closingInput').value = state.closing;
    $('clientName').value = state.clientName;
    $('clientPhone').value = fmtPhone(state.clientPhone);
    $('clientEmail').value = state.clientEmail;
    $('clientIncome').value = state.clientIncome ? groupThousands(state.clientIncome) : '';
  }

  function bindMoneyInput(id, key) {
    const el = $(id);
    el.addEventListener('input', () => {
      el.value = groupThousands(el.value);
      setState({ [key]: toNum(el.value) });
    });
  }

  function bindInputs() {
    $('rateInput').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v > 0 && v < 30) setState({ rate: v });
    });
    $('rateInput').addEventListener('blur', (e) => { e.target.value = state.rate.toFixed(2); });
    $('closingInput').addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      setState({ closing: isNaN(v) ? 0 : Math.max(0, Math.min(15, v)) });
    });
    $('deferSelect').addEventListener('change', (e) => setState({ defer: Number(e.target.value) }));
    bindMoneyInput('holdInput', 'hold');
    bindMoneyInput('discountInput', 'discount');
    bindMoneyInput('clientIncome', 'clientIncome');

    $('clientName').addEventListener('input', (e) => { e.target.classList.remove('is-invalid'); setState({ clientName: e.target.value }); });
    $('clientEmail').addEventListener('input', (e) => setState({ clientEmail: e.target.value.trim() }));
    $('clientPhone').addEventListener('input', (e) => {
      e.target.value = fmtPhone(e.target.value);
      e.target.classList.remove('is-invalid');
      setState({ clientPhone: digits(e.target.value) });
    });

    // Asesor persistente
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageAdvisor) || '{}');
    $('advisorName').value = saved.name || '';
    $('advisorPhone').value = fmtPhone(saved.phone || '');
    const saveAdvisor = () => {
      localStorage.setItem(CONFIG.storageAdvisor, JSON.stringify({ name: $('advisorName').value.trim(), phone: digits($('advisorPhone').value) }));
    };
    $('advisorName').addEventListener('input', saveAdvisor);
    $('advisorPhone').addEventListener('input', (e) => { e.target.value = fmtPhone(e.target.value); saveAdvisor(); });
  }

  const advisor = () => ({
    name: $('advisorName').value.trim() || 'Equipo Comercial MOTUL',
    phone: digits($('advisorPhone').value) || CONFIG.whatsappDefault
  });

  /* ------------------------------------------------------------------
     8. VALIDACIÓN, FOLIO Y MENSAJE
     ------------------------------------------------------------------ */
  function validate() {
    if (!state.lot) { toast('Selecciona un lote en el plano.', true); $('stepLote').scrollIntoView({ behavior: 'smooth' }); return false; }
    if (!state.model) { toast('Selecciona el modelo de casa.', true); $('stepModelo').scrollIntoView({ behavior: 'smooth' }); return false; }
    if (!state.clientName.trim()) {
      $('clientName').classList.add('is-invalid');
      $('stepCliente').scrollIntoView({ behavior: 'smooth' });
      $('clientName').focus({ preventScroll: true });
      toast('Captura el nombre del cliente.', true);
      return false;
    }
    if (digits(state.clientPhone).length !== 10) {
      $('clientPhone').classList.add('is-invalid');
      $('stepCliente').scrollIntoView({ behavior: 'smooth' });
      $('clientPhone').focus({ preventScroll: true });
      toast('El WhatsApp del cliente debe tener 10 dígitos.', true);
      return false;
    }
    return true;
  }

  function getFolio() {
    if (currentFolio) return currentFolio;
    const d = new Date();
    const stamp = `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const rnd = Math.random().toString(36).slice(2, 5).toUpperCase();
    currentFolio = `MOT-${stamp}-L${pad(state.lot)}${state.model}-${rnd}`;
    return currentFolio;
  }

  function quoteMeta() {
    const now = new Date();
    const valid = new Date(now.getTime() + CONFIG.validityDays * 86400000);
    return { folio: getFolio(), date: fmtDate(now), valid: fmtDate(valid), advisor: advisor() };
  }

  function buildMessage(c, meta) {
    const lot = c.lot;
    const m = MODELS[state.model];
    const first = state.clientName.trim().split(/\s+/)[0] || '';
    const lines = [
      `Hola ${first}, te comparto tu cotización de *MOTUL Espacios Residenciales* 🏡`,
      '',
      `*Lote ${pad(lot.n)} · ${m.name}*`,
      `${m2(lot.m2)} m² de terreno · ${m2(m.construction)} m² de construcción`,
      `Entrega: ${lot.entrega}`,
      '',
      `💰 Precio: *${money(c.price)}*`,
      `🔑 Enganche ${state.down}%: ${money(c.downAmt)}` + (state.defer > 1 ? ` (${state.defer} pagos de ${money(c.deferPay)} tras el apartado)` : '')
    ];
    if (c.isCredit) {
      lines.push(`🏦 Crédito: ${money(c.finance)} a ${state.term} años`);
      lines.push(`📅 Mensualidad estimada: *${money(c.monthly)}* (aprox.)`);
    } else {
      lines.push(`📌 Saldo a la entrega: ${money(c.finance)}`);
    }
    lines.push(`📝 Gastos de escrituración aprox.: ${money(c.closing)}`);
    lines.push('');
    lines.push(`Folio: ${meta.folio} · Vigencia: ${meta.valid}`);
    if (c.isCredit) lines.push(`_Estimación con tasa anual de ${state.rate.toFixed(2)}%, sujeta a aprobación bancaria; no incluye seguros ni comisiones._`);
    lines.push('');
    lines.push('Quedo a tus órdenes para agendar una visita.');
    lines.push(`${meta.advisor.name}`);
    return lines.join('\n');
  }

  /* ------------------------------------------------------------------
     9. PRECARGA DE IMÁGENES PARA EL PDF
     ------------------------------------------------------------------ */
  const assets = {};
  let assetsLoaded = false;

  function loadImg(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function rasterize(img, { aspect = null, maxW = 1200, png = false } = {}) {
    let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
    if (aspect) {
      if (sw / sh > aspect) { const nw = sh * aspect; sx = (sw - nw) / 2; sw = nw; }
      else { const nh = sw / aspect; sy = (sh - nh) / 2; sh = nh; }
    }
    const scale = Math.min(1, maxW / sw);
    const cv = document.createElement('canvas');
    cv.width = Math.round(sw * scale);
    cv.height = Math.round(sh * scale);
    const ctx = cv.getContext('2d');
    if (!png) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height); }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
    return { data: png ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.86), w: cv.width, h: cv.height, type: png ? 'PNG' : 'JPEG' };
  }

  const assetsReady = (async () => {
    const jobs = [
      loadImg('/assets/images/logo_motul_bco.png').then((i) => { assets.logo = rasterize(i, { png: true, maxW: 800 }); }),
      loadImg('/assets/images/master_plan_clean.jpg').then((i) => { assets.masterPlan = rasterize(i, { maxW: 1250 }); })
    ];
    Object.entries(MODELS).forEach(([k, m]) => {
      jobs.push(loadImg(m.photo).then((i) => { assets['photo' + k] = rasterize(i, { aspect: 1.6, maxW: 1000 }); }));
      jobs.push(loadImg(m.plan).then((i) => { assets['plan' + k] = rasterize(i, { maxW: 1100 }); }));
    });
    await Promise.allSettled(jobs);
    assetsLoaded = true;
  })();

  /* ------------------------------------------------------------------
     10. GENERACIÓN DEL PDF (jsPDF, tamaño carta)
     ------------------------------------------------------------------ */
  function buildPdf(c, meta) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'letter' });
    const W = 215.9, H = 279.4, M = 15, CW = W - M * 2;
    const COL = {
      forest: [30, 58, 47], forestDark: [15, 31, 24], forestMid: [44, 74, 62], bronze: [155, 126, 88],
      bronzeSoft: [245, 239, 232], mint: [244, 248, 245], text: [20, 23, 22], muted: [100, 112, 108],
      line: [222, 228, 225], white: [255, 255, 255], soft: [200, 215, 208]
    };
    const fill = (c2) => doc.setFillColor(...c2);
    const ink = (c2) => doc.setTextColor(...c2);
    const stroke = (c2) => doc.setDrawColor(...c2);
    const font = (style, size) => { doc.setFont('helvetica', style); doc.setFontSize(size); };
    const serif = (size) => { doc.setFont('times', 'bold'); doc.setFontSize(size); };
    const lot = c.lot;
    const model = MODELS[state.model];
    const adv = meta.advisor;
    const label = (txt, x, y) => { font('bold', 7); ink(COL.bronze); doc.text(txt.toUpperCase(), x, y, { charSpace: 0.4 }); };
    const addImg = (a, x, y, w, h) => { if (a) doc.addImage(a.data, a.type, x, y, w, h, undefined, 'FAST'); };
    const footer = (page) => {
      fill(COL.forestDark); doc.rect(0, H - 11, W, 11, 'F');
      font('normal', 7.5); ink(COL.white);
      doc.text(`WhatsApp +52 ${fmtPhone(adv.phone)}   ·   ${CONFIG.site}   ·   Ocoyoacac, Estado de México`, M, H - 4.3);
      ink(COL.soft);
      doc.text(`Folio ${meta.folio}   ·   Página ${page} de 2`, W - M, H - 4.3, { align: 'right' });
    };

    /* ======================= PÁGINA 1 ======================= */
    fill(COL.forest); doc.rect(0, 0, W, 40, 'F');
    if (assets.logo) addImg(assets.logo, M, 13, 52, 52 * (assets.logo.h / assets.logo.w));
    font('normal', 7.5); ink([214, 196, 172]);
    doc.text('ESPACIOS RESIDENCIALES  ·  OCOYOACAC, EDO. MÉX.', M, 30, { charSpace: 0.3 });
    serif(24); ink(COL.white);
    doc.text('Cotización', W - M, 18, { align: 'right' });
    font('normal', 8.5); ink(COL.soft);
    doc.text(`Folio: ${meta.folio}`, W - M, 25, { align: 'right' });
    doc.text(`Emitida: ${meta.date}`, W - M, 30, { align: 'right' });
    doc.text(`Vigente hasta: ${meta.valid}`, W - M, 35, { align: 'right' });
    fill(COL.bronze); doc.rect(0, 40, W, 1.4, 'F');

    // Cliente / asesor
    fill(COL.mint); doc.roundedRect(M, 48, CW, 22, 3, 3, 'F');
    const half = M + CW / 2;
    label('Preparada para', M + 6, 54.5);
    font('bold', 12.5); ink(COL.text); doc.text(state.clientName.trim(), M + 6, 61);
    font('normal', 8.5); ink(COL.muted);
    doc.text([`+52 ${fmtPhone(state.clientPhone)}`, state.clientEmail].filter(Boolean).join('   ·   '), M + 6, 66.5);
    stroke(COL.line); doc.setLineWidth(0.3); doc.line(half, 52, half, 66);
    label('Asesor comercial', half + 6, 54.5);
    font('bold', 12.5); ink(COL.text); doc.text(adv.name, half + 6, 61);
    font('normal', 8.5); ink(COL.muted); doc.text(`WhatsApp +52 ${fmtPhone(adv.phone)}`, half + 6, 66.5);

    // Propiedad
    const pY = 77;
    addImg(assets['photo' + state.model], M, pY, 78, 48.75);
    const x0 = M + 84, rw = W - M - x0;
    label('Propiedad cotizada', x0, pY + 4);
    serif(21); ink(COL.forestDark); doc.text(`Lote ${pad(lot.n)} · ${model.name}`, x0, pY + 12.5);
    font('normal', 8.5); ink(COL.muted);
    doc.text(`Etapa ${lot.etapa}  ·  Entrega ${lot.entrega.toLowerCase()}  ·  ${STATUS_LABEL[lot.status]}`, x0, pY + 18.5);
    const specs = [
      ['Terreno', `${m2(lot.m2)} m²`], ['Construcción', `${m2(model.construction)} m²`], ['Niveles', model.levels],
      ['Recámaras', model.beds], ['Baños', model.baths], [model.extraLabel, model.extraValue]
    ];
    const cw3 = rw / 3, ch = 12;
    specs.forEach(([k, v], i) => {
      const cx = x0 + (i % 3) * cw3, cy = pY + 23 + Math.floor(i / 3) * ch;
      fill(COL.mint); doc.roundedRect(cx, cy, cw3 - 2, ch - 1.6, 1.8, 1.8, 'F');
      font('normal', 6.3); ink(COL.muted); doc.text(k.toUpperCase(), cx + 2.8, cy + 4.2);
      let fs = 9;
      font('bold', fs);
      while (doc.getTextWidth(v) > cw3 - 6.5 && fs > 6) { fs -= 0.3; doc.setFontSize(fs); }
      ink(COL.text); doc.text(v, cx + 2.8, cy + 8.8);
    });

    // Desglose
    const dY = 134;
    label('Desglose de inversión', M, dY + 3);
    stroke(COL.line); doc.line(M, dY + 5, M + 92, dY + 5);
    const rows = [['Precio de lista', money(c.list)]];
    if (c.discount) rows.push(['Descuento autorizado', '-' + money(c.discount)]);
    rows.push(['Precio final', money(c.price), 'strong']);
    rows.push([`Enganche (${state.down}%)`, money(c.downAmt)]);
    rows.push(['Apartado', money(c.hold), 'sub']);
    rows.push([state.defer > 1 ? `Saldo enganche (${state.defer} pagos de ${money(c.deferPay)})` : 'Saldo de enganche (1 exhibición)', money(c.deferBal), 'sub']);
    rows.push([c.isCredit ? 'Monto a financiar' : 'Saldo a liquidar en la entrega', money(c.finance), 'strong']);
    rows.push([`Gastos de escrituración (est. ${state.closing}%)`, money(c.closing)]);
    rows.push(['Desembolso inicial total', money(c.initial), 'hl']);
    let ry = dY + 12;
    rows.forEach(([k, v, kind]) => {
      if (kind === 'hl') {
        fill(COL.bronzeSoft); doc.roundedRect(M, ry - 4.8, 92, 7.6, 1.8, 1.8, 'F');
        font('bold', 9); ink(COL.forestDark); doc.text(k, M + 3, ry);
        ink(COL.bronze); doc.text(v, M + 89, ry, { align: 'right' });
      } else {
        const isSub = kind === 'sub';
        font(kind === 'strong' ? 'bold' : 'normal', isSub ? 7.8 : 9);
        ink(kind === 'strong' ? COL.text : COL.muted);
        doc.text(k, M + (isSub ? 4 : 0), ry);
        ink(COL.text); doc.text(v, M + 92, ry, { align: 'right' });
        stroke(COL.line); doc.setLineWidth(0.2); doc.line(M, ry + 2.3, M + 92, ry + 2.3);
      }
      ry += 7;
    });

    // Caja de mensualidad / saldo
    const bx = M + 98, bw = W - M - bx, bh = 74;
    fill(COL.forest); doc.roundedRect(bx, dY, bw, bh, 3, 3, 'F');
    font('bold', 7.2); ink([214, 196, 172]);
    doc.text(c.isCredit ? 'MENSUALIDAD ESTIMADA' : 'SALDO A LA ENTREGA', bx + 7, dY + 10, { charSpace: 0.4 });
    serif(28); ink(COL.white);
    doc.text(money(c.isCredit ? c.monthly : c.finance), bx + 7, dY + 23);
    font('normal', 8); ink(COL.soft);
    if (c.isCredit) {
      doc.text(`Crédito de ${money(c.finance)} a ${state.term} años`, bx + 7, dY + 30);
      doc.text(`Tasa anual estimada: ${state.rate.toFixed(2)}%`, bx + 7, dY + 35);
      doc.text(`Ingreso mensual sugerido: ${money(c.income)}`, bx + 7, dY + 40);
      const tw = (bw - 14 - 3 * 2) / 4;
      CONFIG.termOptions.forEach((t, i) => {
        const tx = bx + 7 + i * (tw + 2), ty = dY + 46;
        const active = t === state.term;
        fill(active ? COL.white : COL.forestMid); doc.roundedRect(tx, ty, tw, 14, 1.8, 1.8, 'F');
        font('normal', 6.4); ink(active ? COL.forest : COL.soft); doc.text(`${t} AÑOS`, tx + tw / 2, ty + 5, { align: 'center' });
        font('bold', 7.6); ink(active ? COL.forestDark : COL.white); doc.text(money(pmt(c.finance, state.rate, t)), tx + tw / 2, ty + 10.5, { align: 'center' });
      });
      font('normal', 6.4); ink(COL.soft);
      doc.text('No incluye seguros, comisiones ni CAT.', bx + 7, dY + 68);
    } else {
      doc.text(`Pago con recursos propios`, bx + 7, dY + 30);
      doc.text(`Entrega estimada: ${lot.entrega.toLowerCase()}`, bx + 7, dY + 35);
      doc.text(`Enganche ${state.down}%: ${money(c.downAmt)}`, bx + 7, dY + 40);
    }

    // Tabla comparativa
    const tY = 216;
    label('Comparativa de enganches', M, tY);
    if (c.isCredit) { font('normal', 7.5); ink(COL.muted); doc.text(`Plazo ${state.term} años · tasa ${state.rate.toFixed(2)}%`, W - M, tY, { align: 'right' }); }
    const heads = c.isCredit
      ? ['Enganche', 'Monto enganche', 'A financiar', 'Mensualidad', 'Ingreso sugerido']
      : ['Enganche', 'Monto enganche', 'Saldo a la entrega', 'Gastos escrit.', 'Desembolso inicial'];
    const colW = [28, 39.5, 39.5, 39.5, CW - 146.5];
    const colX = colW.reduce((acc, w, i) => { acc.push((acc[i - 1] ?? M) + (i ? colW[i - 1] : 0)); return acc; }, []);
    fill(COL.mint); doc.rect(M, tY + 3, CW, 7, 'F');
    font('bold', 6.8); ink(COL.muted);
    heads.forEach((h, i) => {
      if (i === 0) doc.text(h.toUpperCase(), colX[i] + 3, tY + 7.7);
      else doc.text(h.toUpperCase(), colX[i] + colW[i] - 3, tY + 7.7, { align: 'right' });
    });
    CONFIG.downOptions.forEach((p, idx) => {
      const r = compute(state, { down: p });
      const yy = tY + 10 + idx * 6.2;
      const active = p === state.down;
      if (active) { fill(COL.forest); doc.rect(M, yy, CW, 6.2, 'F'); }
      else { stroke(COL.line); doc.setLineWidth(0.2); doc.line(M, yy + 6.2, M + CW, yy + 6.2); }
      const vals = c.isCredit
        ? [`${p}%`, money(r.downAmt), money(r.finance), money(r.monthly), money(r.income)]
        : [`${p}%`, money(r.downAmt), money(r.finance), money(r.closing), money(r.initial)];
      vals.forEach((v, i) => {
        font(i === 0 || i === 3 ? 'bold' : 'normal', 8.2);
        ink(active ? COL.white : COL.text);
        if (i === 0) doc.text(v, colX[i] + 3, yy + 4.3);
        else doc.text(v, colX[i] + colW[i] - 3, yy + 4.3, { align: 'right' });
      });
    });
    footer(1);

    /* ======================= PÁGINA 2 ======================= */
    doc.addPage('letter', 'portrait');
    fill(COL.forest); doc.rect(0, 0, W, 24, 'F');
    if (assets.logo) addImg(assets.logo, M, 8, 42, 42 * (assets.logo.h / assets.logo.w));
    serif(16); ink(COL.white); doc.text('Plano y ubicación', W - M, 13.5, { align: 'right' });
    font('normal', 8); ink(COL.soft); doc.text(`Lote ${pad(lot.n)} · ${model.name} · ${m2(model.construction)} m² de construcción`, W - M, 19, { align: 'right' });
    fill(COL.bronze); doc.rect(0, 24, W, 1.2, 'F');

    // Sembrado con lote resaltado
    const mpW = 92, mpH = mpW * (CONFIG.planSize[1] / CONFIG.planSize[0]), mpY = 37;
    label('Ubicación en el sembrado', M, 33);
    addImg(assets.masterPlan, M, mpY, mpW, mpH);
    const sx = mpW / CONFIG.planSize[0], sy = mpH / CONFIG.planSize[1];
    const [x1, y1, x2, y2] = lot.rect;
    const lx = M + x1 * sx, ly = mpY + y1 * sy, lw = (x2 - x1) * sx, lh = (y2 - y1) * sy;
    try {
      if (doc.GState) { doc.setGState(new doc.GState({ opacity: 0.35 })); fill(COL.forestDark); doc.rect(lx, ly, lw, lh, 'F'); doc.setGState(new doc.GState({ opacity: 1 })); }
    } catch (e) { /* opacidad no soportada */ }
    stroke(COL.white); doc.setLineWidth(0.9); doc.rect(lx, ly, lw, lh, 'S');
    const tagW = 16, tagX = Math.min(Math.max(lx + lw / 2 - tagW / 2, M), M + mpW - tagW), tagY = Math.max(ly - 7, mpY + 1);
    fill(COL.forestDark); doc.roundedRect(tagX, tagY, tagW, 5.4, 1.2, 1.2, 'F');
    font('bold', 6.8); ink(COL.white); doc.text(`LOTE ${pad(lot.n)}`, tagX + tagW / 2, tagY + 3.8, { align: 'center' });
    font('normal', 7.8); ink(COL.muted);
    doc.text(`Lote ${pad(lot.n)} · ${m2(lot.m2)} m² de terreno · Etapa ${lot.etapa}`, M, mpY + mpH + 5);

    // Incluye
    const iY = mpY + mpH + 15;
    label('Lo que incluye tu residencia', M, iY);
    const perks = [
      'Certificación internacional EDGE Advanced',
      'Paneles solares y vivienda 100% libre de gas',
      'Cocina con parrilla de inducción magnética',
      'Condominio residencial privado de solo 14 residencias',
      'Jardín común de 230 m² con palapa y asadores',
      'Acceso controlado y seguridad 24/7',
      'A 300 m de la autopista México–Toluca'.replace('–', '-')
    ];
    perks.forEach((t, i) => {
      const yy = iY + 7 + i * 6.4;
      fill(COL.bronze); doc.circle(M + 1.4, yy - 1.1, 0.9, 'F');
      font('normal', 8.4); ink(COL.text); doc.text(t, M + 5, yy);
    });

    // Plano arquitectónico
    const px = M + 98, pw = W - M - px, ph = 140;
    label('Plano arquitectónico oficial', px, 33);
    stroke(COL.line); doc.setLineWidth(0.3); doc.roundedRect(px, 37, pw, ph, 2, 2, 'S');
    const plan = assets['plan' + state.model];
    if (plan) {
      const maxW = pw - 6, maxH = ph - 6;
      const ratio = plan.w / plan.h;
      let w = maxW, h = w / ratio;
      if (h > maxH) { h = maxH; w = h * ratio; }
      addImg(plan, px + (pw - w) / 2, 37 + (ph - h) / 2, w, h);
    }

    // Próximos pasos
    const sY = 186;
    label('Próximos pasos', M, sY);
    const steps = [
      ['Apartado', `${money(c.hold)} para reservar el lote ${pad(lot.n)}.`],
      ['Contrato y enganche', state.defer > 1 ? `Firma de contrato y enganche en ${state.defer} pagos.` : `Firma de contrato y pago del enganche (${state.down}%).`],
      c.isCredit ? ['Crédito hipotecario', 'Integración de expediente y aprobación bancaria.'] : ['Pago del saldo', 'Liquidación del saldo según calendario pactado.'],
      ['Escrituración y entrega', `Firma ante notario y entrega (${lot.entrega.toLowerCase()}).`]
    ];
    const sw = (CW - 3 * 4) / 4;
    steps.forEach(([t, d], i) => {
      const sx2 = M + i * (sw + 4), sy2 = sY + 4;
      fill(COL.mint); doc.roundedRect(sx2, sy2, sw, 31, 2.4, 2.4, 'F');
      fill(COL.forest); doc.circle(sx2 + 7, sy2 + 7.5, 3.6, 'F');
      font('bold', 8.5); ink(COL.white); doc.text(String(i + 1), sx2 + 7, sy2 + 8.8, { align: 'center' });
      font('bold', 8.6); ink(COL.forestDark); doc.text(t, sx2 + 4, sy2 + 17);
      font('normal', 7.2); ink(COL.muted); doc.text(doc.splitTextToSize(d, sw - 8), sx2 + 4, sy2 + 21.5);
    });

    // Aviso legal
    const lY = 228;
    fill(COL.bronzeSoft); doc.roundedRect(M, lY, CW, 30, 2.4, 2.4, 'F');
    label('Notas importantes', M + 5, lY + 6);
    const legal = `Esta cotización es informativa y no constituye una oferta vinculante. Precios conforme a la ${CONFIG.priceList}, sujetos a cambio y disponibilidad sin previo aviso. ` +
      (c.isCredit ? `La mensualidad es una estimación con tasa anual de ${state.rate.toFixed(2)}% y amortización a ${state.term} años; no incluye seguros de vida y daños, comisiones, CAT ni gastos de originación, y está sujeta a la aprobación de la institución financiera. ` : '') +
      `Los gastos de escrituración son aproximados (${state.closing}% del valor) y dependen de la notaría y el avalúo. Vigencia de la cotización: hasta el ${meta.valid}.`;
    font('normal', 7.2); ink(COL.muted);
    doc.text(doc.splitTextToSize(legal, CW - 10), M + 5, lY + 11.5, { lineHeightFactor: 1.35 });
    footer(2);

    const safeName = state.clientName.trim().split(/\s+/)[0].normalize('NFD').replace(/[^\w]/g, '') || 'Cliente';
    const filename = `Cotizacion_MOTUL_Lote${pad(lot.n)}_Modelo${state.model}_${safeName}.pdf`;
    return { doc, filename };
  }

  /* ------------------------------------------------------------------
     11. ACCIONES: PDF, WHATSAPP, COPIAR, HISTORIAL
     ------------------------------------------------------------------ */
  async function ensureReady() {
    if (!window.jspdf) { toast('Cargando generador de PDF, intenta de nuevo en un momento.', true); return false; }
    if (!assetsLoaded) { toast('Preparando imágenes…'); await assetsReady; }
    return true;
  }

  function saveHistory(c, meta) {
    const list = JSON.parse(localStorage.getItem(CONFIG.storageHistory) || '[]').filter((h) => h.folio !== meta.folio);
    list.unshift({
      folio: meta.folio,
      ts: Date.now(),
      client: state.clientName.trim(),
      phone: state.clientPhone,
      lot: state.lot,
      model: state.model,
      down: state.down,
      method: state.method,
      price: c.price,
      monthly: c.monthly,
      state: { ...state }
    });
    localStorage.setItem(CONFIG.storageHistory, JSON.stringify(list.slice(0, CONFIG.historyMax)));
    renderHistoryCount();
  }

  async function onPdf() {
    if (!validate()) return;
    if (!(await ensureReady())) return;
    const c = compute(state);
    const meta = quoteMeta();
    const { doc, filename } = buildPdf(c, meta);
    doc.save(filename);
    saveHistory(c, meta);
    toast(`PDF generado · Folio ${meta.folio}`);
  }

  async function onWhatsApp() {
    if (!validate()) return;
    if (!(await ensureReady())) return;
    const c = compute(state);
    const meta = quoteMeta();
    const msg = buildMessage(c, meta);
    const { doc, filename } = buildPdf(c, meta);
    saveHistory(c, meta);

    // Móvil: compartir el PDF directamente (hoja nativa → WhatsApp)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && navigator.canShare) {
      const file = new File([doc.output('blob')], filename, { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: msg, title: `Cotización MOTUL · ${meta.folio}` });
          toast('Cotización compartida.');
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') return;
        }
      }
    }

    // Escritorio: descarga PDF + abre chat con el cliente y el resumen
    doc.save(filename);
    window.open(`https://wa.me/52${digits(state.clientPhone)}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    toast('PDF descargado. Adjúntalo en el chat de WhatsApp que se abrió.');
  }

  async function onCopy() {
    if (!state.lot || !state.model) { toast('Selecciona lote y modelo primero.', true); return; }
    const c = compute(state);
    const meta = quoteMeta();
    const msg = buildMessage(c, meta).replace(/^Hola ,/, 'Hola,');
    try {
      await navigator.clipboard.writeText(msg);
      toast('Resumen copiado al portapapeles.');
    } catch (e) {
      toast('No se pudo copiar automáticamente.', true);
    }
  }

  function renderHistoryCount() {
    const list = JSON.parse(localStorage.getItem(CONFIG.storageHistory) || '[]');
    $('historyCount').textContent = list.length;
  }

  function renderHistory() {
    const ul = $('historyList');
    const list = JSON.parse(localStorage.getItem(CONFIG.storageHistory) || '[]');
    ul.innerHTML = '';
    if (!list.length) {
      ul.innerHTML = '<li class="cz-history-empty">Aún no hay cotizaciones. Se guardan aquí automáticamente al generar PDF o enviar por WhatsApp.</li>';
      return;
    }
    list.forEach((h) => {
      const li = document.createElement('li');
      li.className = 'cz-history-item';
      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = h.client || 'Sin nombre';
      const det = document.createElement('span');
      det.textContent = `Lote ${pad(h.lot)} · Modelo ${h.model} · Eng. ${h.down}% · ${h.method === 'credito' ? money(h.monthly) + '/mes' : 'Contado'}`;
      const when = document.createElement('span');
      when.textContent = `${h.folio} · ${new Date(h.ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`;
      info.append(name, det, when);

      const actions = document.createElement('div');
      actions.className = 'cz-hi-actions';
      const load = document.createElement('button');
      load.type = 'button'; load.className = 'load'; load.textContent = 'Abrir';
      load.addEventListener('click', () => {
        state = { ...defaultState(), ...h.state };
        syncInputsFromState();
        render();
        currentFolio = h.folio;
        $('historyDrawer').close();
        toast(`Cotización ${h.folio} cargada.`);
      });
      const del = document.createElement('button');
      del.type = 'button'; del.textContent = 'Borrar';
      del.addEventListener('click', () => {
        const next = JSON.parse(localStorage.getItem(CONFIG.storageHistory) || '[]').filter((x) => x.folio !== h.folio);
        localStorage.setItem(CONFIG.storageHistory, JSON.stringify(next));
        renderHistory(); renderHistoryCount();
      });
      actions.append(load, del);
      li.append(info, actions);
      ul.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------
     12. INICIALIZACIÓN
     ------------------------------------------------------------------ */
  function applyDeepLink() {
    const p = new URLSearchParams(location.search);
    const lot = Number(p.get('lote'));
    const model = (p.get('modelo') || '').toUpperCase();
    const down = Number(p.get('enganche'));
    if (lot && getLot(lot) && getLot(lot).status !== 'vendido') {
      state.lot = lot;
      const keys = Object.keys(getLot(lot).models);
      state.model = keys.includes(model) ? model : (keys.length === 1 ? keys[0] : null);
    }
    if (CONFIG.downOptions.includes(down)) state.down = down;
  }

  function init() {
    buildPlan();
    buildChips();
    bindInputs();
    applyDeepLink();
    syncInputsFromState();
    render();
    renderHistoryCount();

    $('btnPdf').addEventListener('click', onPdf);
    $('btnWhatsApp').addEventListener('click', onWhatsApp);
    $('btnCopy').addEventListener('click', onCopy);
    $('mbGo').addEventListener('click', () => $('summaryPanel').scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('btnHistory').addEventListener('click', () => { renderHistory(); $('historyDrawer').showModal(); });
    $('btnCloseHistory').addEventListener('click', () => $('historyDrawer').close());
    $('historyDrawer').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
    $('btnReset').addEventListener('click', () => {
      state = defaultState();
      currentFolio = null;
      syncInputsFromState();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Nueva cotización lista.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
