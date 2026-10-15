# 🤖 MANUAL DE TRANSFERENCIA Y DIRECTIVAS PARA AGENTES (AGENTS.md)
> **LEER OBLIGATORIAMENTE ANTES DE MODIFICAR CUALQUIER ARCHIVO.**  
> Este documento contiene la arquitectura completa, las reglas físicas y normativas inmutables, la estructura de archivos y las instrucciones paso a paso para que cualquier agente de IA (incluso con capacidades limitadas de contexto) pueda continuar, mantener y expandir este proyecto sin cometer errores técnicos ni romper el diseño.

---

## 1. RESUMEN EJECUTIVO Y PROPÓSITO DEL PROYECTO

- **Destinatarios:** Estudiantes y docentes del Ciclo Superior de Educación Secundaria Técnica (ETP - Especialidades: Electromecánica, Electricidad, Energías Renovables).
- **Tema Central:** **Cálculo y dimensionamiento de conductores eléctricos por Caída de Tensión ($\Delta U$)**, aplicando el criterio de selección dual (térmico + eléctrico).
- **Marco Normativo Vigente:** Reglamentación **AEA 90364** (Asociación Electrotécnica Argentina) y Normas **IRAM NM 247-3**, **IRAM 2178** e **IEC 60364**.
- **Naturaleza del Software:** Aplicación Web Frontend 100% estática, autocontenida, sin dependencias de Node.js, sin empaquetadores (no requiere `npm install` ni `webpack`), ejecutable directamente desde el navegador o servidor HTTP básico (Python/LiveServer). Esto permite su uso offline en talleres escolares mediante pendrives o plataformas tipo Moodle/Classroom.

---

## 2. MAPA DE ARCHIVOS Y ARQUITECTURA

```
c:\Users\Usuario\Desktop\nahuel\
│
├── AGENTS.md                         <- [ESTE ARCHIVO] Instrucciones maestras para agentes
├── index.html                        <- Landing Page pública con CTA de instalación PWA
├── app.html                          <- Portal Web principal integral (Simulador, Diapositivas, Cuadernillo, Quiz, Tablas)
├── cuadernillo.html                  <- Versión exclusiva e imprimible en A4 (con carátula técnica y transformador)
├── presentacion.html                 <- Vista standalone de diapositivas para cañón proyector o Smart TV de aula
│
├── css/
│   └── styles.css                    <- Hoja de estilos única (Design tokens, glassmorphism, responsive y @media print)
│
├── js/
│   └── app.js                       <- Lógica del simulador matemático, pasador de diapositivas y motor de autoevaluación
│
├── images/
│   └── transformador.jpg             <- Imagen HD de la subestación transformadora MT/BT (usada en carátula y visor)
│
└── docs/
    ├── cuadernillo_estudiante.md     <- Cuadernillo en formato Markdown editable para Word / Google Docs / Moodle
    └── plan_de_clase_y_diapositivas.md <- Planificación didáctica docente, encuadre curricular y rúbricas
```

### Detalle de Responsabilidad de cada archivo:
1. **`index.html`**:
   - Landing page promocional del proyecto con diseño glassmorphism.
   - CTA principal: botón "Instalar Aplicación" (PWA `beforeinstallprompt`).
   - CTA secundario: botón "Usar en el navegador" que redirige a `app.html`.
   - Secciones: Hero, Features (5 módulos), Tech Strip, Bottom CTA, Footer.
2. **`app.html`**:
   - Contiene un sistema de pestañas (Tabs):
     - `calc-tab`: Calculadora / Simulador con feedback semafórico en tiempo real.
     - `slides-tab`: Reproductor de diapositivas con notas docentes y pantalla completa.
     - `booklet-tab`: Visor del cuadernillo completo (incluye carátula y botón de impresión A4).
     - `lab-tab`: Laboratorio interactivo de desafíos numéricos con autocorrección.
     - `norm-tab`: Tablas de referencia rápida AEA 90364 / IRAM.
2. **`cuadernillo.html`**:
   - Diseñado estrictamente para **Impresión en A4** o exportación limpia a PDF.
   - Posee una **Carátula Técnica (Página 1)** con imagen del transformador eléctrico, rótulo formal IRAM y salto de página forzado (`page-break-after: always`).
   - La teoría y ejercicios comienzan en la **Página 2**.
3. **`presentacion.html`**:
   - Vista limpia a pantalla completa para el docente frente a la clase.
   - Atajos de teclado: <kbd>→</kbd> / <kbd>Espacio</kbd> (Avanzar), <kbd>←</kbd> (Retroceder), <kbd>F</kbd> (Fullscreen), <kbd>N</kbd> (Notas docentes).
4. **`css/styles.css`**:
   - Variables CSS en `:root` (paleta azul eléctrico, fuentes Google Outfit, Inter y JetBrains Mono).
   - Soporte para Tema Oscuro (`[data-theme="dark"]`) y Claro (`[data-theme="light"]`).
   - Bloque crítico `@media print` al final que oculta barras de navegación y garantiza fondo blanco y texto negro puro para imprimir.
5. **`js/app.js`**:
   - Tab manager (`initTabs`).
   - Theme manager (`initTheme`).
   - Motor de cálculo físico (`calculateVoltageDrop`, `updateCalculatorUI`).
   - Array de datos de diapositivas (`SLIDES_DATA`).
   - Array y validador de ejercicios interactivos (`QUIZ_QUESTIONS`).

---

## 3. FUNDAMENTOS FÍSICOS Y REGLAS DE CÁLCULO (INMUTABLES)

> [!CAUTION]
> **REGLA ESTRICTA:** No modifiques las siguientes fórmulas ni valores numéricos predeterminados. Provienen de leyes físicas y normas electrotécnicas oficiales.

### 3.1 Resistividad del Cobre según Temperatura ($\rho$)
* **Cobre a 20°C (Reposo/Laboratorio):** $\rho_{20} = 0.0178 \ \Omega\cdot\text{mm}^2/\text{m}$ (o $0.018$).
* **Cobre a 70°C (Servicio Continuo con aislación de PVC según AEA 90364):** $\mathbf{\rho_{70} = 0.0210 \ \Omega\cdot mm^2/m}$.  
  *(En todos los cálculos de diseño reglamentario se utiliza obligatoriamente $\mathbf{0.021}$, ya que calcular a 20°C subestima la caída un 18%).*
* **Cobre a 90°C (Aislación XLPE/EPR):** $\rho_{90} = 0.0230 \ \Omega\cdot\text{mm}^2/\text{m}$.
* **Aluminio a 70°C:** $\rho_{70} = 0.0340 \ \Omega\cdot\text{mm}^2/\text{m}$.

### 3.2 Fórmulas de Caída de Tensión

#### A) Circuito Monofásico ($220\text{ V}$ o $230\text{ V}$):
La corriente va por la fase y vuelve por el neutro (distancia total del camino del electrón = $2 \cdot L$):
$$\Delta U = \frac{2 \cdot \rho \cdot L \cdot I}{S} \quad [\text{V}]$$
$$\Delta U\% = \frac{\Delta U}{U_n} \cdot 100\%$$
$$S_{mín} \ge \frac{2 \cdot \rho \cdot L \cdot I}{\Delta U_{adm}} \quad [\text{mm}^2]$$

#### B) Circuito Trifásico Equilibrado ($380\text{ V}$ o $400\text{ V}$):
El neutro no transporta corriente neta ($I_N = 0$). La composición fasorial introduce el factor $\sqrt{3} \approx 1.732$:
$$\Delta U = \frac{\sqrt{3} \cdot \rho \cdot L \cdot I \cdot \cos\varphi}{S} \quad [\text{V}]$$
Si se conoce la potencia activa trifásica total $P$ (en Watts):
$$\Delta U = \frac{\rho \cdot L \cdot P}{U_n \cdot S} \quad [\text{V}]$$
$$S_{mín} \ge \frac{\sqrt{3} \cdot \rho \cdot L \cdot I \cdot \cos\varphi}{\Delta U_{adm}} \quad [\text{mm}^2]$$

### 3.3 Límites Máximos Permitidos (AEA 90364)
- **Circuitos terminales de Iluminación:** $\Delta U\% \le \mathbf{3.0\%}$ ($6.6\text{ V}$ en $220\text{V}$, $11.4\text{ V}$ en $380\text{V}$).
- **Circuitos terminales de Fuerza Motriz / Tomas de Uso General:** $\Delta U\% \le \mathbf{5.0\%}$ ($11.0\text{ V}$ en $220\text{V}$, $19.0\text{ V}$ en $380\text{V}$).
- **Líneas Principales (Medidor a Tablero Principal):** $\Delta U\% \le \mathbf{1.0\%}$ ($2.2\text{ V}$ en $220\text{V}$).
- **Arranque de Motores (Régimen Transitorio):** Se tolera entre un **$10\%$ y $15\%$**.

### 3.4 La Regla de Selección Dual
La sección comercial normalizada adoptada debe satisfacer **SIMULTÁNEAMENTE**:
1. **Condición Térmica:** $I_b \le I_n \le I_z$ (el conductor no debe sobrecalentarse).
2. **Condición de Caída de Tensión:** $\Delta U\% \le \Delta U\%_{adm}$.
**SIEMPRE se elige la sección MAYOR resultante de ambas comprobaciones.**

### 3.5 Secciones Comerciales Normalizadas IRAM
`[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240] mm²`

---

## 4. GUÍA PASO A PASO PARA MODIFICACIONES COMUNES

### Tarea A: ¿Cómo agregar o editar una Diapositiva?
1. Abre `js/app.js`.
2. Localiza la constante `SLIDES_DATA` (alrededor de la línea 190).
3. Cada diapositiva es un objeto con 4 claves:
   ```javascript
   {
     badge: "Diapositiva 11 / 11 • Título de Etiqueta",
     title: "Título Grande de la Diapositiva",
     body: `<p>Contenido explicativo en HTML...</p>`,
     notes: "Texto con sugerencias pedagógicas para que el profesor explique en clase."
   }
   ```
4. Guarda el archivo. El reproductor recalculará automáticamente la cantidad total de diapositivas.

### Tarea B: ¿Cómo agregar o modificar un Desafío en el Laboratorio/Quiz?
1. Abre `js/app.js`.
2. Localiza el array `QUIZ_QUESTIONS` (alrededor de la línea 390).
3. Agrega un nuevo problema respetando la estructura:
   ```javascript
   {
     id: 5,
     difficulty: "medio", // "facil", "medio" o "avanzado"
     diffLabel: "Medio • Caso Práctico",
     problem: "Enunciado del problema en HTML...",
     expectedDeltaU: 8.50, // O expectedSection, expectedDeltaPct, expectedSTeorica
     tolerance: 0.20,      // Margen de error tolerado en ±
     unit: "V",
     hint: "Pista para el estudiante...",
     solution: "Explicación detallada del desarrollo algebraico paso a paso."
   }
   ```

### Tarea C: ¿Cómo modificar la Carátula del Cuadernillo?
1. Para la versión impresa, edita `cuadernillo.html` dentro del contenedor `<div class="cover-sheet">`.
2. Para el portal web, edita `app.html` dentro de `<div class="cover-sheet">` en la pestaña `#booklet-tab`.
3. La imagen del transformador se encuentra en `images/transformador.jpg`. Si se reemplaza la imagen, asegúrate de mantener la misma ruta o actualizar el atributo `src`.
4. **IMPORTANTE:** En `cuadernillo.html`, la clase `.cover-sheet` tiene `page-break-after: always !important;`. Nunca elimines esta propiedad porque asegura que la carátula se imprima sola en la primera página.

### Tarea D: ¿Cómo modificar los Estilos sin romper la Impresión?
1. Edita `css/styles.css`.
2. Si añades clases nuevas para el cuadernillo, verifica la sección `@media print` al final del archivo.
3. Asegúrate de que los elementos que no deben imprimirse tengan `display: none !important;` en `@media print`.

---

## 5. PROTOCOLO DE EJECUCIÓN Y PRUEBAS LOCALES

Para levantar y verificar el proyecto localmente:

1. **Iniciar Servidor Local:**
   ```powershell
   python -m http.server 8080
   ```
2. **Rutas Clave en el Navegador:**
   - Landing page: `http://localhost:8080/index.html`
   - Portal maestro (app): `http://localhost:8080/app.html`
   - Cuadernillo con carátula para impresión A4: `http://localhost:8080/cuadernillo.html`
   - Presentación para aula: `http://localhost:8080/presentacion.html`
3. **Checklist de Verificación Obligatoria:**
   - [ ] Mover el slider de longitud en el simulador: verificar que $\Delta U$ y $\Delta U\%$ cambien instantáneamente.
   - [ ] Conmutar entre Monofásico y Trifásico: verificar que la tensión cambie entre 220V y 380V.
   - [ ] En la pestaña de Diapositivas: presionar <kbd>→</kbd> y verificar avance fluido; presionar "Notas Docente" y verificar que aparezca el recuadro amarillo.
   - [ ] En la pestaña de Cuadernillo: verificar que la carátula muestre la foto del transformador, el rótulo técnico y que al hacer clic en "Imprimir Formato A4", la vista previa de impresión separe la carátula en la página 1.
   - [ ] En el Quiz: ingresar un valor numérico y verificar que la retroalimentación paso a paso se muestre correctamente.

---

## 6. RESTRICCIONES Y PROHIBICIONES PARA EL AGENTE

- ❌ **NO instales Node.js, Vite, React, Vue ni TailwindCSS** a menos que el usuario lo pida expresamente. El proyecto está diseñado intencionalmente en Vanilla HTML/CSS/JS para funcionar sin dependencias en computadoras de escuelas técnicas que pueden carecer de conexión a internet o permisos de administrador.
- ❌ **NO uses rutas absolutas** en enlaces (`href`) o imágenes (`src`). Usa siempre rutas relativas (ej: `images/transformador.jpg`, `css/styles.css`).
- ❌ **NO cambies la resistividad reglamentaria $\rho = 0.021$** a menos que se trate explícitamente de un cálculo a 20°C de laboratorio.
- ❌ **NO alteres los límites reglamentarios** (3% iluminación, 5% fuerza motriz/tomas, 1% acometida), ya que corresponden a la reglamentación argentina AEA 90364.
