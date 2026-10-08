# Plan Pedagógico y Guía Docente: Caída de Tensión en Instalaciones Eléctricas

## 1. Fundamentación y Encuadre Curricular
- **Nivel:** Escuela de Educación Secundaria Técnica (Ciclo Superior - 4to a 6to año).
- **Especialidades:** Electromecánica, Electricidad, Energías Renovables, Construcciones.
- **Espacios Curriculares:** Instalaciones Eléctricas, Electrotecnia, Taller de Electricidad / Montaje.
- **Marco Normativo:** Reglamentación AEA 90364 (Asociación Electrotécnica Argentina) e IEC 60364.

---

## 2. Objetivos de Aprendizaje
Al finalizar la unidad temática, el estudiante será capaz de:
1. Comprender el origen físico de la caída de tensión debido a la resistividad y longitud de los conductores.
2. Reconocer las consecuencias técnicas del exceso de caída de tensión (pérdida de torque en motores, calentamiento, disminución de flujo lumínico, disparo intempestivo de protecciones).
3. Aplicar con precisión las fórmulas de cálculo de caída de tensión para circuitos monofásicos y trifásicos en corriente alterna.
4. Determinar la sección transversal adecuada de un conductor cumpliendo simultáneamente el criterio térmico ($I_b \le I_n \le I_z$) y el criterio de caída de tensión admisible ($\Delta U \le \Delta U_{adm}$).
5. Manejar tablas normativas de conductores IRAM NM 247-3 (tipo taller/unipolar) e IRAM 2178 (subterráneos/aislación XLPE-PVC).

---

## 3. Estructura de Contenidos

### Módulo A: Fundamentos Teóricos
- Resistencia eléctrica de conductores: Ley de Pouillet ($R = \rho \cdot \frac{L}{S}$).
- Variación de la resistividad con la temperatura: Cobre a 20°C ($\rho = 0.0178 \ \Omega\cdot\text{mm}^2/\text{m}$) vs. régimen continuo de servicio a 70°C ($\rho \approx 0.021 \ \Omega\cdot\text{mm}^2/\text{m}$) para aislaciones de PVC.
- Longitud de cálculo: Ida y vuelta ($2L$) en circuitos monofásicos vs. longitud de fase simple ($L$) en trifásicos equilibrados.
- Influencia del factor de potencia ($\cos\varphi$) y la reactancia inductiva ($X_L$) en cables de gran sección ($S \ge 25 \text{ mm}^2$).

### Módulo B: Fórmulas de Cálculo
1. **Circuito Monofásico ($220 \text{ V}$):**
   $$\Delta U = \frac{2 \cdot \rho \cdot L \cdot I}{S} \quad [\text{V}]$$
   $$\Delta U\% = \frac{\Delta U}{220} \cdot 100\%$$
   $$S_{mín} = \frac{2 \cdot \rho \cdot L \cdot I}{\Delta U_{adm}} \quad [\text{mm}^2]$$

2. **Circuito Trifásico Equilibrado ($380 \text{ V}$):**
   $$\Delta U = \frac{\sqrt{3} \cdot \rho \cdot L \cdot I \cdot \cos\varphi}{S} \quad [\text{V}]$$
   $$\Delta U\% = \frac{\Delta U}{380} \cdot 100\%$$
   $$S_{mín} = \frac{\sqrt{3} \cdot \rho \cdot L \cdot I \cdot \cos\varphi}{\Delta U_{adm}} \quad [\text{mm}^2]$$

### Módulo C: Límites Admisibles según Normativa (AEA 90364)
- **Circuitos terminales de iluminación:** $\Delta U\% \le 3\%$ ($6.6 \text{ V}$ en $220\text{V}$, $11.4 \text{ V}$ en $380\text{V}$).
- **Circuitos terminales de tomas y fuerza motriz / motores:** $\Delta U\% \le 5\%$ ($11 \text{ V}$ en $220\text{V}$, $19 \text{ V}$ en $380\text{V}$).
- **Línea principal (Medidor a Tablero Principal):** $\Delta U\% \le 1\%$.
- **Arranque de motores:** Se tolera hasta un $10\% - 15\%$ durante el período transitorio de aceleración.

---

## 4. Guía de Diapositivas para el Docente

| Diapositiva | Título | Conceptos Clave y Dinámica de Clase |
|---|---|---|
| **01** | Portada e Introducción | Presentación del problema: ¿Por qué parpadean las luces o no arranca una bomba lejana? |
| **02** | ¿Qué es la Caída de Tensión? | Analogía hidráulica (fricción en cañerías) y eléctrica. Tensión nominal vs. tensión en carga. |
| **03** | Parámetros que la Gobiernan | Ley de Pouillet: Longitud ($L$), Sección ($S$), Material ($\rho$), Corriente ($I$). |
| **04** | La Temperatura Importa | Conductores a 20°C vs. 70°C en régimen continuo. Coeficiente térmico del cobre. |
| **05** | Fórmulas: Circuito Monofásico | Deducción paso a paso. Longitud de ida y retorno ($2L$). Cálculo de sección necesaria. |
| **06** | Fórmulas: Circuito Trifásico | Cargas equilibradas. Factor $\sqrt{3}$. Desplazamiento fasorial y efecto del $\cos\varphi$. |
| **07** | Normativa y Valores Límites | AEA 90364: 3% iluminación, 5% fuerza motriz/usos generales, 1% acometidas. |
| **08** | Criterio de Selección Dual | Doble condición obligatoria: Corriente admisible ($I_z \ge I_n$) Y Caída de tensión ($\Delta U \le \Delta U_{adm}$). |
| **09** | Caso Práctico Resuelto | Alimentación a un taller/bomba de agua a 85 metros. Elección de sección comercial. |
| **10** | Conclusiones y Taller | Errores comunes a evitar, buenas prácticas de instalación y presentación del simulador interactivo. |

---

## 5. Rúbrica de Evaluación de la Actividad
- **Criterio 1:** Identificación correcta del tipo de circuito (monofásico/trifásico) y su longitud real ($20\%$).
- **Criterio 2:** Aplicación exacta de la fórmula matemática y unidades dimensionales ($30\%$).
- **Criterio 3:** Verificación frente a los límites normativos AEA ($20\%$).
- **Criterio 4:** Selección de la sección comercial normalizada inmediata superior ($15\%$).
- **Criterio 5:** Verificación térmica conjunta con la capacidad de corriente de la tabla IRAM ($15\%$).
