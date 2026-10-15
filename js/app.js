/**
 * PORTAL TÉCNICO: CAÍDA DE TENSIÓN EN INSTALACIONES ELÉCTRICAS
 * Motor de Cálculo, Simulador, Presentación y Laboratorio Interactivo
 * Basado en Reglamentación AEA 90364 e IEC 60364
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initTabs();
  initTheme();
  initCalculator();
  initSlides();
  initQuiz();
  initBookletNav();
});

/* ==========================================================================
   1. GESTOR DE PESTAÑAS (TABS)
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   2. TEMA OSCURO / CLARO
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('etp_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('etp_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ==========================================================================
   3. SIMULADOR Y CALCULADORA TÉCNICA
   ========================================================================== */
const SECCIONES_COMERCIALES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

// Corrientes admisibles IRAM NM 247-3 (cobre PVC en cañería, 2 y 3 conductores)
const TABLA_IZ = {
  1.5: { mono: 15, tri: 13.5 },
  2.5: { mono: 21, tri: 18.5 },
  4: { mono: 28, tri: 25 },
  6: { mono: 36, tri: 32 },
  10: { mono: 50, tri: 44 },
  16: { mono: 66, tri: 58 },
  25: { mono: 88, tri: 77 },
  35: { mono: 109, tri: 96 },
  50: { mono: 131, tri: 117 },
  70: { mono: 166, tri: 149 },
  95: { mono: 202, tri: 180 },
  120: { mono: 232, tri: 207 },
  150: { mono: 263, tri: 235 },
  185: { mono: 298, tri: 267 },
  240: { mono: 348, tri: 312 }
};

function initCalculator() {
  const systemButtons = document.querySelectorAll('[data-system]');
  const loadModeButtons = document.querySelectorAll('[data-loadmode]');

  const lengthSlider = document.getElementById('calc-length');
  const lengthDisplay = document.getElementById('length-val-display');

  const currentInput = document.getElementById('calc-current');
  const powerInput = document.getElementById('calc-power');
  const powerUnit = document.getElementById('calc-power-unit');
  const cosphiInput = document.getElementById('calc-cosphi');

  const materialSelect = document.getElementById('calc-material');
  const circuitUseSelect = document.getElementById('calc-circuit-use');
  const sectionSelect = document.getElementById('calc-section');

  // Toggle de Sistema (Monofásico / Trifásico)
  systemButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      systemButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateVoltageDefaults();
      calculateVoltageDrop();
    });
  });

  // Toggle Modo de Carga (Corriente vs Potencia)
  loadModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadModeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-loadmode');

      const groupCurrent = document.getElementById('group-current');
      const groupPower = document.getElementById('group-power');

      if (mode === 'current') {
        groupCurrent.style.display = 'block';
        groupPower.style.display = 'none';
      } else {
        groupCurrent.style.display = 'none';
        groupPower.style.display = 'block';
      }
      calculateVoltageDrop();
    });
  });

  // Slider de Longitud sincronizado
  if (lengthSlider && lengthDisplay) {
    lengthSlider.addEventListener('input', () => {
      lengthDisplay.textContent = `${lengthSlider.value} m`;
      calculateVoltageDrop();
    });
  }

  // Eventos de inputs
  [currentInput, powerInput, powerUnit, cosphiInput, materialSelect, circuitUseSelect, sectionSelect].forEach(el => {
    if (el) el.addEventListener('input', calculateVoltageDrop);
  });

  // Cálculo inicial
  calculateVoltageDrop();
}

function updateVoltageDefaults() {
  const isTrifasico = document.querySelector('[data-system="trifasico"]')?.classList.contains('active');
  const voltInput = document.getElementById('calc-voltage');
  if (voltInput) {
    voltInput.value = isTrifasico ? '380' : '220';
  }
}

function calculateVoltageDrop() {
  const isTrifasico = document.querySelector('[data-system="trifasico"]')?.classList.contains('active');
  const isPowerMode = document.querySelector('[data-loadmode="power"]')?.classList.contains('active');

  const Un = parseFloat(document.getElementById('calc-voltage')?.value || (isTrifasico ? 380 : 220));
  const L = parseFloat(document.getElementById('calc-length')?.value || 30);
  const S = parseFloat(document.getElementById('calc-section')?.value || 2.5);
  const rho = parseFloat(document.getElementById('calc-material')?.value || 0.021);
  const circuitLimit = parseFloat(document.getElementById('calc-circuit-use')?.value || 3.0);

  // Determinación de la corriente (I)
  let I = 0;
  let cosphi = parseFloat(document.getElementById('calc-cosphi')?.value || 0.9);
  if (cosphi > 1) cosphi = 1;
  if (cosphi < 0.1) cosphi = 0.1;

  if (isPowerMode) {
    let P = parseFloat(document.getElementById('calc-power')?.value || 1500);
    const unit = document.getElementById('calc-power-unit')?.value || 'w';
    if (unit === 'kw') P *= 1000;
    if (unit === 'hp') P *= 746; // 1 HP = 746 W aprox.

    if (isTrifasico) {
      I = P / (Math.sqrt(3) * Un * cosphi);
    } else {
      I = P / (Un * cosphi);
    }
  } else {
    I = parseFloat(document.getElementById('calc-current')?.value || 10);
  }

  if (I <= 0) I = 0.001;

  // Resistencia del conductor: R = rho * L / S
  const R_line = (rho * L) / S;

  // Caída de tensión en Volts
  // Monofásico: 2 * rho * L * I / S
  // Trifásico: sqrt(3) * rho * L * I * cosphi / S
  let deltaU = 0;
  if (isTrifasico) {
    deltaU = (Math.sqrt(3) * rho * L * I * cosphi) / S;
  } else {
    deltaU = (2 * rho * L * I) / S;
  }

  const deltaUPorcentual = (deltaU / Un) * 100;
  const UtensionFinal = Math.max(0, Un - deltaU);

  // Sección mínima teórica requerida para cumplir el límite reglamentario
  const deltaU_adm_volts = (Un * circuitLimit) / 100;
  let S_teorica = 0;
  if (isTrifasico) {
    S_teorica = (Math.sqrt(3) * rho * L * I * cosphi) / deltaU_adm_volts;
  } else {
    S_teorica = (2 * rho * L * I) / deltaU_adm_volts;
  }

  // Buscar sección comercial mínima que cumpla
  let seccionRecomendada = SECCIONES_COMERCIALES.find(sec => sec >= S_teorica) || 'Mayor a 240';

  // Verificación térmica Iz
  const izDatos = TABLA_IZ[S];
  const Iz = isTrifasico ? (izDatos?.tri || 999) : (izDatos?.mono || 999);
  const cumpleTermico = I <= Iz;

  // Actualizar UI
  updateCalculatorUI({
    Un, L, S, I, deltaU, deltaUPorcentual, UtensionFinal,
    circuitLimit, S_teorica, seccionRecomendada,
    cumpleCaida: deltaUPorcentual <= circuitLimit,
    cumpleTermico, Iz
  });
}

function updateCalculatorUI(data) {
  // Valores numéricos
  const elDeltaU = document.getElementById('res-delta-u');
  const elDeltaUPct = document.getElementById('res-delta-pct');
  const elUFinal = document.getElementById('res-u-final');
  const elCurrentCalc = document.getElementById('res-current-calc');
  const elSRecom = document.getElementById('res-s-recom');
  const elIzVal = document.getElementById('res-iz-val');

  if (elDeltaU) elDeltaU.textContent = `${data.deltaU.toFixed(2)}`;
  if (elDeltaUPct) elDeltaUPct.textContent = `${data.deltaUPorcentual.toFixed(2)}%`;
  if (elUFinal) elUFinal.textContent = `${data.UtensionFinal.toFixed(1)} V`;
  if (elCurrentCalc) elCurrentCalc.textContent = `${data.I.toFixed(2)} A`;
  if (elSRecom) elSRecom.textContent = `${data.seccionRecomendada} mm²`;
  if (elIzVal) elIzVal.textContent = `${data.Iz} A`;

  // Barra de progreso y estado
  const statusBanner = document.getElementById('result-status-banner');
  const statusIcon = document.getElementById('status-icon-char');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');
  const wireProgress = document.getElementById('wire-progress');

  const pct = data.deltaUPorcentual;
  const limit = data.circuitLimit;

  // Porcentaje visual relativo al límite (ej. si límite es 3%, 3% = 75% de la barra)
  let barWidth = (pct / (limit * 1.5)) * 100;
  if (barWidth > 100) barWidth = 100;
  if (barWidth < 4) barWidth = 4;

  if (wireProgress) {
    wireProgress.style.width = `${barWidth}%`;
  }

  if (pct <= limit && data.cumpleTermico) {
    // Cumple todo perfectamente
    statusBanner.className = 'result-status-banner pass';
    if (statusIcon) statusIcon.textContent = '✓';
    if (statusTitle) statusTitle.textContent = 'INSTALACIÓN REGLAMENTARIA (CUMPLE)';
    if (statusDesc) {
      statusDesc.textContent = `La caída de ${pct.toFixed(2)}% está dentro del límite reglamentario del ${limit}%. La sección soporta la corriente admisible (${data.Iz} A > ${data.I.toFixed(1)} A).`;
    }
    if (wireProgress) wireProgress.style.backgroundColor = 'var(--accent-emerald)';
  } else if (pct <= limit && !data.cumpleTermico) {
    // Cumple caída pero no térmico
    statusBanner.className = 'result-status-banner warning';
    if (statusIcon) statusIcon.textContent = '⚠';
    if (statusTitle) statusTitle.textContent = 'RIESGO TÉRMICO (SOBRECARGA)';
    if (statusDesc) {
      statusDesc.textContent = `Cumple caída (${pct.toFixed(2)}% ≤ ${limit}%), pero la corriente de carga (${data.I.toFixed(1)} A) supera la capacidad térmica del cable (${data.Iz} A). Aumente la sección.`;
    }
    if (wireProgress) wireProgress.style.backgroundColor = 'var(--accent-amber)';
  } else {
    // No cumple caída de tensión
    statusBanner.className = 'result-status-banner danger';
    if (statusIcon) statusIcon.textContent = '✕';
    if (statusTitle) statusTitle.textContent = 'NO REGLAMENTARIO (CAÍDA EXCESIVA)';
    if (statusDesc) {
      statusDesc.textContent = `La caída de tensión es de ${pct.toFixed(2)}%, superando el límite del ${limit}% fijado por AEA 90364. Se recomienda adoptar como mínimo ${data.seccionRecomendada} mm².`;
    }
    if (wireProgress) wireProgress.style.backgroundColor = 'var(--accent-rose)';
  }
}

/* ==========================================================================
   4. PRESENTACIÓN DE DIAPOSITIVAS INTERACTIVA (DECK)
   ========================================================================== */
const SLIDES_DATA = [
  {
    badge: "Diapositiva 01 / 10 • Introducción al Problema",
    title: "¿Por qué se apagan las máquinas o parpadean las luces?",
    body: `
      <p>Imaginemos un taller industrial donde se conecta una bomba o compresor al final de un galpón a 90 metros del tablero principal:</p>
      <ul style="margin: 1rem 0 1rem 1.5rem;">
        <li>El motor arranca con dificultad, zumba o quema su bobinado.</li>
        <li>Las luminarias bajan notablemente su brillo al encender maquinaria.</li>
        <li>Los contactores vibran o se desenganchan solos.</li>
      </ul>
      <p><strong>Causa física:</strong> La tensión en bornes de la carga cayó por debajo del valor nominal debido a la oposición del propio conductor. Hoy aprenderemos a predecir y dimensionar exactamente esta variable.</p>
    `,
    notes: "Presentar la clase conectando con la experiencia cotidiana del alumno en el taller de la escuela. Destacar que un cable no es un conductor perfecto sin resistencia."
  },
  {
    badge: "Diapositiva 02 / 10 • Fundamentos Físicos",
    title: "¿Qué es exactamente la Caída de Tensión (ΔU)?",
    body: `
      <p>La <strong>Caída de Tensión (ΔU)</strong> es la diferencia algebraica entre la tensión de origen (suministrada por la fuente o tablero) y la tensión real que llega a los bornes del receptor.</p>
      <div style="background: rgba(0,0,0,0.4); padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0; border: 1px solid rgba(56,189,248,0.2);">
        <p style="font-family: var(--font-mono); font-size: 1.3rem; color: #38bdf8; text-align: center;">
          ΔU = U_origen - U_carga = I · Z_línea
        </p>
      </div>
      <p><strong>Analogía Hidráulica:</strong> Así como una cañería larga y estrecha pierde presión de agua debido a la fricción contra sus paredes, un conductor eléctrico largo y de poca sección disipa potencial eléctrico en forma de calor por efecto Joule (I² · R).</p>
    `,
    notes: "Utilizar el pizarrón o pantalla para dibujar la analogía hidráulica (tanque elevado, cañería con pérdidas de carga, canilla distante)."
  },
  {
    badge: "Diapositiva 03 / 10 • Resistencia del Conductor",
    title: "La Ley de Pouillet y los Parámetros del Cable",
    body: `
      <p>La resistencia óhmica de cualquier conductor eléctrico homogéneo depende de tres magnitudes físicas fundamentales:</p>
      <div style="background: rgba(0,0,0,0.4); padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0; border: 1px solid rgba(56,189,248,0.2); text-align: center;">
        <span style="font-family: var(--font-mono); font-size: 1.6rem; color: #38bdf8; font-weight: 800;">
          R = ρ · ( L / S )
        </span>
      </div>
      <ul style="margin: 1rem 0 1rem 1.5rem;">
        <li><strong>ρ (Rho):</strong> Resistividad del material [Ω·mm²/m].</li>
        <li><strong>L:</strong> Longitud física del conductor [metros].</li>
        <li><strong>S:</strong> Sección transversal del conductor [mm²].</li>
      </ul>
      <p><em>A mayor distancia (L) ➜ Mayor resistencia ➜ Mayor caída.</em><br>
      <em>A mayor sección (S) ➜ Menor resistencia ➜ Menor caída.</em></p>
    `,
    notes: "Hacer énfasis en las unidades. Remarcar que S está en el denominador: si duplicamos la sección, reducimos la resistencia y la caída a la mitad."
  },
  {
    badge: "Diapositiva 04 / 10 • Temperatura y Materiales",
    title: "El Cobre no se comporta igual en frío que en caliente",
    body: `
      <p>Los metales tienen un coeficiente de temperatura positivo (α > 0): <strong>a mayor temperatura, mayor resistividad</strong>.</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.25rem 0;">
        <div style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); padding: 1rem; border-radius: 8px;">
          <h4 style="color: #38bdf8; margin-bottom: 0.25rem;">Cobre a 20°C (Reposo)</h4>
          <p style="font-family: var(--font-mono); font-size: 1.2rem;">ρ₂₀ = 0.0178 Ω·mm²/m</p>
          <small style="color: var(--text-muted);">Solo para mediciones de laboratorio en frío.</small>
        </div>
        <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 1rem; border-radius: 8px;">
          <h4 style="color: #34d399; margin-bottom: 0.25rem;">Cobre a 70°C (Servicio Continuo)</h4>
          <p style="font-family: var(--font-mono); font-size: 1.2rem;">ρ₇₀ = 0.0210 Ω·mm²/m</p>
          <small style="color: var(--text-muted);"><strong>VALOR OBLIGATORIO DE PROYECTO (AEA)</strong></small>
        </div>
      </div>
      <p>⚠️ <strong>Error frecuente de taller:</strong> Si calculamos con ρ = 0.0178, subestimamos la caída real de la instalación en un <strong>18%</strong>, provocando fallas cuando el conductor trabaje a plena carga.</p>
    `,
    notes: "Preguntar a los alumnos: ¿Qué pasa cuando un cable pasa corriente durante horas? Se calienta. Por eso la norma exige calcular en las condiciones más desfavorables (70°C)."
  },
  {
    badge: "Diapositiva 05 / 10 • Circuito Monofásico",
    title: "Cálculo en Corriente Alterna Monofásica (220 V)",
    body: `
      <p>En monofásica, la corriente viaja por el conductor de <strong>Fase</strong> hasta la carga y regresa por el conductor de <strong>Neutro</strong>. ¡La longitud recorrida por el electrón es el doble (2·L)!</p>
      <div style="background: rgba(0,0,0,0.4); padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0; border: 1px solid rgba(56,189,248,0.2);">
        <p style="font-family: var(--font-mono); font-size: 1.4rem; color: #38bdf8; text-align: center;">
          ΔU = ( 2 · ρ · L · I ) / S &nbsp; [Volts]
        </p>
        <p style="font-family: var(--font-mono); font-size: 1.15rem; color: #cbd5e1; text-align: center; margin-top: 0.5rem;">
          ΔU% = ( ΔU / 220 ) · 100%
        </p>
      </div>
      <p><strong>Despeje de Sección Mínima Reglamentaria:</strong></p>
      <p style="font-family: var(--font-mono); font-size: 1.2rem; color: #34d399; text-align: center;">
        S_mín ≥ ( 2 · ρ · L · I ) / ΔU_adm
      </p>
    `,
    notes: "Anotar en la pizarra el por qué del factor '2'. Es el camino de ida y vuelta. Si la línea mide 40 metros, hay 80 metros de cobre en total involucrados."
  },
  {
    badge: "Diapositiva 06 / 10 • Circuito Trifásico",
    title: "Cálculo en Sistemas Trifásicos Equilibrados (380 V)",
    body: `
      <p>En un sistema trifásico tetrapolar equilibrado, las corrientes están desfasadas 120° en el tiempo. La corriente por el neutro es cero (I_N = 0).</p>
      <div style="background: rgba(0,0,0,0.4); padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0; border: 1px solid rgba(56,189,248,0.2);">
        <p style="font-family: var(--font-mono); font-size: 1.4rem; color: #38bdf8; text-align: center;">
          ΔU = ( √3 · ρ · L · I · cosφ ) / S &nbsp; [Volts]
        </p>
        <p style="font-family: var(--font-mono); font-size: 1.15rem; color: #cbd5e1; text-align: center; margin-top: 0.5rem;">
          ΔU% = ( ΔU / 380 ) · 100%
        </p>
      </div>
      <p><strong>En función de la Potencia Activa (P en Watts):</strong></p>
      <p style="font-family: var(--font-mono); font-size: 1.2rem; color: #34d399; text-align: center;">
        ΔU = ( ρ · L · P ) / ( 380 · S )
      </p>
    `,
    notes: "Recordar a los estudiantes el factor √3 ≈ 1.732 que surge de la composición fasorial entre tensiones de fase y tensiones de línea."
  },
  {
    badge: "Diapositiva 07 / 10 • Marco Reglamentario",
    title: "Límites Máximos Admisibles según Norma AEA 90364",
    body: `
      <p>La reglamentación argentina fija valores límites infranqueables para garantizar seguridad, rendimiento y vida útil de los artefactos:</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0;">
        <div style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
          <h4 style="color: #38bdf8;">Iluminación</h4>
          <p style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0;">≤ 3.0%</p>
          <small>Máx. 6.6 V en 220V</small>
        </div>
        <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
          <h4 style="color: #34d399;">Fuerza Motriz / Tomas</h4>
          <p style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0;">≤ 5.0%</p>
          <small>Máx. 11.0 V en 220V</small>
        </div>
        <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 1rem; border-radius: 8px; text-align: center;">
          <h4 style="color: #fbbf24;">Línea Principal</h4>
          <p style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0;">≤ 1.0%</p>
          <small>Medidor a Tablero Ppal.</small>
        </div>
      </div>
    `,
    notes: "Hacer énfasis en la diferencia entre iluminación (3% más estricto por la sensibilidad visual al parpadeo) y fuerza motriz (5%)."
  },
  {
    badge: "Diapositiva 08 / 10 • Criterio de Selección Dual",
    title: "La Regla de Oro del Instalador: Las 2 Condiciones",
    body: `
      <p>Un error gravísimo en la práctica técnica es elegir el cable mirando únicamente la tabla de corriente.</p>
      <div style="background: rgba(2,6,23,0.7); border: 1px solid rgba(56,189,248,0.3); padding: 1.25rem; border-radius: 12px; margin: 1.25rem 0;">
        <h4 style="color: #38bdf8; margin-bottom: 0.5rem;">Condición 1: Térmica (Corriente Admisible)</h4>
        <p style="font-family: var(--font-mono); color: #e2e8f0;">I_b ≤ I_n ≤ I_z</p>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">El cable no debe sobrecalentarse bajo corriente nominal.</p>
        
        <h4 style="color: #38bdf8; margin-top: 1rem; margin-bottom: 0.5rem;">Condición 2: Eléctrica (Caída de Tensión)</h4>
        <p style="font-family: var(--font-mono); color: #e2e8f0;">ΔU% ≤ ΔU%_adm (3% o 5%)</p>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">La tensión final debe permitir operar la carga sin fallas.</p>
      </div>
      <p style="font-weight: 700; color: #34d399;">➜ Se adopta SIEMPRE la mayor de las dos secciones resultantes.</p>
    `,
    notes: "Este concepto es la clave de bóveda de toda la unidad. Grabar a fuego: en tiradas largas (más de 25m), casi siempre manda la caída de tensión y no la corriente."
  },
  {
    badge: "Diapositiva 09 / 10 • Ejemplo Integrador",
    title: "Caso de Estudio: Bomba Sumergible a 120 metros",
    body: `
      <p>Electrobomba trifásica de <strong>5.5 kW (7.5 HP)</strong>, 380 V, In = <strong>11.5 A</strong>, cosφ = 0.82, distancia = <strong>120 m</strong>.</p>
      <ol style="margin: 1rem 0 1rem 1.5rem;">
        <li><strong>Por Corriente:</strong> Un cable de 1.5 mm² soportaría 13.5 A (> 11.5 A). <em>¿Alcanza?</em></li>
        <li><strong>Verificación de Caída con 1.5 mm²:</strong><br>
        ΔU% = (√3 · 0.021 · 120 · 11.5 · 0.82) / (380 · 1.5) · 100 = <strong>7.22% ➜ ¡NO CUMPLE! (Límite 5%)</strong></li>
        <li><strong>Cálculo de S necesaria:</strong><br>
        S_mín = (√3 · 0.021 · 120 · 11.5 · 0.82) / 19 V = <strong>2.16 mm²</strong></li>
        <li><strong>Sección comercial normalizada adoptada:</strong> <strong>4 mm²</strong> (ΔU% real = 2.71% ✓).</li>
      </ol>
    `,
    notes: "Demostrar a los estudiantes cómo un cable que 'no se quemaría' provocaría que la bomba no arranque o se queme por falta de tensión."
  },
  {
    badge: "Diapositiva 10 / 10 • Cierre y Conclusiones",
    title: "Buenas Prácticas Técnicas y Herramientas Digitales",
    body: `
      <p>Resumen de buenas prácticas para los futuros técnicos:</p>
      <ul style="margin: 1rem 0 1rem 1.5rem;">
        <li>Utilizar siempre <strong>ρ = 0.021 Ω·mm²/m</strong> para conductores de cobre con aislación PVC.</li>
        <li>No olvidar multiplicar por <strong>2</strong> en monofásica y por <strong>√3</strong> en trifásica.</li>
        <li>En motores, verificar el comportamiento durante el arranque (corriente de arranque = 5 a 7 veces la nominal).</li>
        <li>Utilizar la <strong>Calculadora y Simulador</strong> interactivo del portal para verificar proyectos de taller.</li>
      </ul>
      <p style="text-align: center; margin-top: 1.5rem;">
        <span style="background: rgba(56,189,248,0.2); padding: 0.5rem 1rem; border-radius: 999px; color: #38bdf8; font-weight: 700;">
          ¡A continuación pasamos a la ejercitación práctica! ⚡
        </span>
      </p>
    `,
    notes: "Invitar a los estudiantes a abrir la pestaña del Simulador para jugar con los valores y comprobar el comportamiento de las líneas."
  }
];

let currentSlideIdx = 0;

function initSlides() {
  const btnPrev = document.getElementById('slide-btn-prev');
  const btnNext = document.getElementById('slide-btn-next');
  const btnFullscreen = document.getElementById('slide-btn-fs');
  const btnToggleNotes = document.getElementById('slide-btn-notes');

  if (btnPrev) btnPrev.addEventListener('click', () => changeSlide(-1));
  if (btnNext) btnNext.addEventListener('click', () => changeSlide(1));

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', togglePresentationFullscreen);
  }

  if (btnToggleNotes) {
    btnToggleNotes.addEventListener('click', () => {
      const notesBox = document.getElementById('slide-notes-container');
      if (notesBox) {
        notesBox.style.display = notesBox.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Soporte para flechas del teclado
  document.addEventListener('keydown', (e) => {
    const slidesTab = document.getElementById('slides-tab');
    if (!slidesTab || !slidesTab.classList.contains('active')) return;

    if (e.key === 'ArrowRight' || e.key === 'Space') {
      e.preventDefault();
      changeSlide(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      changeSlide(-1);
    }
  });

  renderSlide(currentSlideIdx);
}

function changeSlide(direction) {
  const newIdx = currentSlideIdx + direction;
  if (newIdx >= 0 && newIdx < SLIDES_DATA.length) {
    currentSlideIdx = newIdx;
    renderSlide(currentSlideIdx);
  }
}

function renderSlide(index) {
  const data = SLIDES_DATA[index];
  if (!data) return;

  const badge = document.getElementById('slide-badge');
  const title = document.getElementById('slide-heading');
  const body = document.getElementById('slide-body');
  const notesText = document.getElementById('slide-notes-text');
  const counter = document.getElementById('slide-counter-display');

  const btnPrev = document.getElementById('slide-btn-prev');
  const btnNext = document.getElementById('slide-btn-next');

  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (body) body.innerHTML = data.body;
  if (notesText) notesText.textContent = data.notes;
  if (counter) counter.textContent = `${index + 1} / ${SLIDES_DATA.length}`;

  if (btnPrev) btnPrev.disabled = index === 0;
  if (btnNext) btnNext.disabled = index === SLIDES_DATA.length - 1;
}

function togglePresentationFullscreen() {
  const container = document.getElementById('slide-player');
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.warn(`Error al intentar pantalla completa: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

/* ==========================================================================
   5. LABORATORIO Y DESAFÍOS DE EJERCITACIÓN (AUTOEVALUACIÓN)
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    difficulty: "facil",
    diffLabel: "Fácil • Monofásica",
    problem: `Un circuito de iluminación monofásico (220 V) tiene una corriente de <strong>6.5 A</strong> y una longitud de <strong>35 metros</strong>. Se utiliza cable de cobre (ρ = 0.021 Ω·mm²/m) de <strong>1.5 mm²</strong>. Calcule la caída de tensión en Voltios (ΔU).`,
    expectedDeltaU: 6.37, // (2 * 0.021 * 35 * 6.5) / 1.5 = 6.37 V
    tolerance: 0.25,
    unit: "V",
    hint: "Fórmula: ΔU = (2 · ρ · L · I) / S",
    solution: "ΔU = (2 · 0.021 · 35 · 6.5) / 1.5 = 9.555 / 1.5 = 6.37 V. Como (6.37 / 220) · 100 = 2.89% ≤ 3%, cumple para iluminación."
  },
  {
    id: 2,
    difficulty: "medio",
    diffLabel: "Medio • Dimens. Comercial",
    problem: `Un compresor monofásico de <strong>16 A</strong> a 220 V se alimenta a una distancia de <strong>60 metros</strong> (ρ = 0.021). El límite de caída para fuerza motriz es <strong>5%</strong> (ΔU_adm = 11 V). ¿Cuál es la sección comercial normalizada mínima necesaria (1.5, 2.5, 4, 6, 10 mm²)?`,
    expectedSection: 4, // S_min = (2 * 0.021 * 60 * 16) / 11 = 3.66 mm² -> Adopta 4 mm²
    type: "section",
    hint: "Primero despeja S_mín = (2 · ρ · L · I) / 11 V, luego elige la sección normalizada inmediata superior.",
    solution: "S_mín = (2 · 0.021 · 60 · 16) / 11 = 40.32 / 11 = 3.66 mm². Como 3.66 > 2.5, la sección comercial reglamentaria es 4 mm²."
  },
  {
    id: 3,
    difficulty: "medio",
    diffLabel: "Medio • Trifásica Equilibrada",
    problem: `Una carga trifásica resistiva pura (cosφ = 1.0) conectada a 380 V consume <strong>22 A</strong>. La línea mide <strong>75 metros</strong> y el conductor es de cobre de <strong>6 mm²</strong> (ρ = 0.021). Calcule la caída porcentual (ΔU%).`,
    expectedDeltaPct: 2.64, // ΔU = (sqrt(3) * 0.021 * 75 * 22) / 6 = 10.007 V -> ΔU% = 10.007 / 380 * 100 = 2.63%
    tolerance: 0.15,
    unit: "%",
    hint: "Fórmula: ΔU = (√3 · ρ · L · I · cosφ) / S. Luego ΔU% = (ΔU / 380) · 100",
    solution: "ΔU = (1.732 · 0.021 · 75 · 22 · 1) / 6 = 10.00 V. ΔU% = (10.00 / 380) · 100 = 2.63% (Cumple holgadamente)."
  },
  {
    id: 4,
    difficulty: "avanzado",
    diffLabel: "Avanzado • Caso de Taller",
    problem: `Un motor trifásico de <strong>15 kW</strong> (cosφ = 0.85, rendimiento = 0.90) a 380 V se instala a <strong>110 metros</strong> del Tablero Principal (ρ = 0.021). Sabiendo que ΔU_adm = 5%, calcule la sección teórica mínima exacta (S_mín en mm²).`,
    expectedSTeorica: 6.44, // P_in = 15000 / 0.9 = 16666.7 W. I = 16666.7 / (sqrt(3)*380*0.85) = 29.79 A.
    // S_min = (sqrt(3) * 0.021 * 110 * 29.79 * 0.85) / 19 = 6.44 mm² -> Comercial: 10 mm²
    tolerance: 0.35,
    unit: "mm²",
    hint: "Primero calcula P_eléctrica = P_mec / rendimiento, luego la corriente I, y finalmente S_mín.",
    solution: "P_eléctrica = 15000 / 0.90 = 16666.7 W. I = 16666.7 / (√3 · 380 · 0.85) = 29.79 A. S_mín = (√3 · 0.021 · 110 · 29.79 · 0.85) / 19 V = 6.44 mm² (Se adoptaría 10 mm²)."
  }
];

let currentQuizIdx = 0;
let studentScore = 0;
let answeredQuestions = new Set();

function initQuiz() {
  renderQuizQuestion(currentQuizIdx);

  const btnCheck = document.getElementById('quiz-btn-check');
  const btnNext = document.getElementById('quiz-btn-next');
  const inputAnswer = document.getElementById('quiz-input-answer');

  if (btnCheck) {
    btnCheck.addEventListener('click', checkQuizAnswer);
  }

  if (inputAnswer) {
    inputAnswer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkQuizAnswer();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
        currentQuizIdx++;
        renderQuizQuestion(currentQuizIdx);
      }
    });
  }
}

function renderQuizQuestion(idx) {
  const q = QUIZ_QUESTIONS[idx];
  if (!q) return;

  const diffBadge = document.getElementById('quiz-diff-badge');
  const qNumber = document.getElementById('quiz-q-number');
  const problemText = document.getElementById('quiz-problem-text');
  const inputAnswer = document.getElementById('quiz-input-answer');
  const unitLabel = document.getElementById('quiz-unit-label');
  const feedbackBox = document.getElementById('quiz-feedback');
  const btnNext = document.getElementById('quiz-btn-next');
  const btnCheck = document.getElementById('quiz-btn-check');

  if (diffBadge) {
    diffBadge.className = `quiz-difficulty ${q.difficulty}`;
    diffBadge.textContent = q.diffLabel;
  }
  if (qNumber) qNumber.textContent = `Desafío ${idx + 1} de ${QUIZ_QUESTIONS.length}`;
  if (problemText) problemText.innerHTML = q.problem;
  if (unitLabel) unitLabel.textContent = q.unit || (q.type === 'section' ? 'mm²' : '');

  if (inputAnswer) {
    inputAnswer.value = '';
    inputAnswer.disabled = false;
    inputAnswer.focus();
  }

  if (feedbackBox) {
    feedbackBox.className = 'quiz-feedback-box';
    feedbackBox.innerHTML = '';
  }

  if (btnCheck) btnCheck.style.display = 'inline-flex';
  if (btnNext) btnNext.style.display = 'none';

  updateScoreUI();
}

function checkQuizAnswer() {
  const q = QUIZ_QUESTIONS[currentQuizIdx];
  const inputAnswer = document.getElementById('quiz-input-answer');
  const feedbackBox = document.getElementById('quiz-feedback');
  const btnNext = document.getElementById('quiz-btn-next');
  const btnCheck = document.getElementById('quiz-btn-check');

  if (!inputAnswer || !feedbackBox) return;

  const userVal = parseFloat(inputAnswer.value.replace(',', '.'));
  if (isNaN(userVal)) {
    alert("Por favor ingrese un valor numérico válido.");
    return;
  }

  let isCorrect = false;

  if (q.type === 'section') {
    isCorrect = (userVal === q.expectedSection);
  } else if (q.expectedDeltaU !== undefined) {
    isCorrect = Math.abs(userVal - q.expectedDeltaU) <= q.tolerance;
  } else if (q.expectedDeltaPct !== undefined) {
    isCorrect = Math.abs(userVal - q.expectedDeltaPct) <= q.tolerance;
  } else if (q.expectedSTeorica !== undefined) {
    isCorrect = Math.abs(userVal - q.expectedSTeorica) <= q.tolerance;
  }

  feedbackBox.classList.add('show');
  inputAnswer.disabled = true;
  if (btnCheck) btnCheck.style.display = 'none';

  if (isCorrect) {
    feedbackBox.className = 'quiz-feedback-box correct show';
    feedbackBox.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.35rem;">✓ ¡EXCELENTE CÁLCULO! RESPUESTA CORRECTA</div>
      <p>${q.solution}</p>
    `;
    if (!answeredQuestions.has(q.id)) {
      studentScore += 25; // 4 preguntas x 25 = 100 puntos
      answeredQuestions.add(q.id);
    }
  } else {
    feedbackBox.className = 'quiz-feedback-box incorrect show';
    feedbackBox.innerHTML = `
      <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.35rem;">✕ RESPUESTA FUERA DE TOLERANCIA</div>
      <p style="margin-bottom: 0.5rem;">Tu respuesta fue: <strong>${userVal}</strong>.</p>
      <p><strong>Resolución paso a paso:</strong> ${q.solution}</p>
    `;
  }

  updateScoreUI();

  if (btnNext) {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Siguiente Desafío ➜';
    } else {
      btnNext.style.display = 'inline-flex';
      btnNext.textContent = 'Ver Resultado Final 🏆';
      btnNext.onclick = showQuizFinalModal;
    }
  }
}

function updateScoreUI() {
  const scoreVal = document.getElementById('quiz-score-val');
  const progressFill = document.getElementById('quiz-progress-bar');
  if (scoreVal) scoreVal.textContent = `${studentScore} / 100 pts`;
  if (progressFill) progressFill.style.width = `${(answeredQuestions.size / QUIZ_QUESTIONS.length) * 100}%`;
}

function showQuizFinalModal() {
  alert(`¡Felicitaciones! Has completado el Laboratorio Técnico con una calificación de: ${studentScore} / 100 puntos.\n\nDemuestra tus cálculos y procedimientos en la hoja de evaluación del docente.`);
}

/* ==========================================================================
   6. NAVEGACIÓN Y EXPORTACIÓN DEL CUADERNILLO
   ========================================================================== */
function initBookletNav() {
  const printBtn = document.getElementById('btn-print-booklet');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      // Si no estamos en la pestaña del cuadernillo, activarla primero para imprimirla limpia
      const bookletTabBtn = document.querySelector('[data-tab="booklet-tab"]');
      if (bookletTabBtn) bookletTabBtn.click();
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }
}

/* ==========================================================================
   7. AUTENTICACIÓN CON SUPABASE
   ========================================================================== */
/* ==========================================================================
   7. AUTENTICACIÓN CON SUPABASE
   ========================================================================== */
const supabaseUrl = 'https://txozxnbkobqksijhhzjb.supabase.co';
const supabaseKey = 'sb_publishable_N5d5QLh9CZwUitypFtrztw_YVziOPaI';
let supabaseClient = null;

function initAuth() {
  if (typeof window.supabase === 'undefined') {
    console.error("Supabase SDK no cargado.");
    return;
  }

  supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

  const authOverlay = document.getElementById('auth-overlay');
  const appContainer = document.getElementById('app-container');
  const errorMsg = document.getElementById('auth-error');
  const btnLogout = document.getElementById('btn-logout');

  // Tabs y Botones
  const btnTabLogin = document.getElementById('btn-tab-login');
  const btnTabRegister = document.getElementById('btn-tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const btnSubmitRegister = document.getElementById('btn-submit-register');

  if (!authOverlay || !appContainer) return;

  // Manejo de pestañas del modal
  if (btnTabLogin && btnTabRegister) {
    btnTabLogin.addEventListener('click', (e) => {
      e.preventDefault();
      btnTabLogin.classList.add('active');
      btnTabRegister.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
    });

    btnTabRegister.addEventListener('click', (e) => {
      e.preventDefault();
      btnTabRegister.classList.add('active');
      btnTabLogin.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';
    });
  }

  // Logout listener
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (confirm('¿Desea cerrar la sesión actual?')) {
        await supabaseClient.auth.signOut();
      }
    });
  }

  // Revisar si ya hay sesión activa
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      showApp();
    }
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || session) {
      showApp();
    } else if (event === 'SIGNED_OUT') {
      showAuth();
    }
  });

  function showApp() {
    authOverlay.style.display = 'none';
    appContainer.style.display = 'block';
  }

  function showAuth() {
    authOverlay.style.display = 'flex';
    appContainer.style.display = 'none';
  }

  function showError(msg) {
    if (!errorMsg) return;
    errorMsg.style.display = 'block';

    // Traducir mensajes comunes de Supabase a español
    let text = msg;
    if (msg.includes('User already registered')) text = 'El correo electrónico ya se encuentra registrado.';
    else if (msg.includes('Invalid login credentials')) text = 'Correo electrónico o contraseña incorrectos.';
    else if (msg.includes('Password should be at least')) text = 'La contraseña debe tener al menos 6 caracteres.';
    else if (msg.includes('Unable to validate email')) text = 'Formato de correo electrónico inválido.';

    errorMsg.textContent = text;
  }

  // Submit Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorMsg) errorMsg.style.display = 'none';

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (btnSubmitLogin) {
        btnSubmitLogin.disabled = true;
        btnSubmitLogin.textContent = 'Iniciando sesión...';
      }

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          showError(error.message);
        } else if (data.session) {
          showApp();
        }
      } catch (err) {
        showError("Error de conexión al servidor de autenticación.");
      } finally {
        if (btnSubmitLogin) {
          btnSubmitLogin.disabled = false;
          btnSubmitLogin.textContent = 'Iniciar Sesión';
        }
      }
    });
  }

  // Submit Register
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorMsg) errorMsg.style.display = 'none';

      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      const meta = {
        nombre: document.getElementById('reg-nombre').value.trim(),
        apellido: document.getElementById('reg-apellido').value.trim(),
        escuela: document.getElementById('reg-escuela').value.trim(),
        curso: document.getElementById('reg-curso').value.trim(),
        division: document.getElementById('reg-division').value.trim()
      };

      if (btnSubmitRegister) {
        btnSubmitRegister.disabled = true;
        btnSubmitRegister.textContent = 'Registrando cuenta...';
      }

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: meta
          }
        });

        if (error) {
          showError(error.message);
        } else {
          // Si el usuario fue auto-confirmado o tiene sesión, inicia inmediatamente
          if (data.session) {
            showApp();
          } else {
            // Intentar inicio de sesión automático
            const { data: loginData } = await supabaseClient.auth.signInWithPassword({
              email,
              password
            });
            if (loginData && loginData.session) {
              showApp();
            } else {
              alert("¡Registro exitoso! Ya podés iniciar sesión con tus credenciales.");
              if (btnTabLogin) btnTabLogin.click();
            }
          }
        }
      } catch (err) {
        showError("Error al procesar el registro. Intente nuevamente.");
      } finally {
        if (btnSubmitRegister) {
          btnSubmitRegister.disabled = false;
          btnSubmitRegister.textContent = 'Crear Cuenta Estudiantil';
        }
      }
    });
  }
}
