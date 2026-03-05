Rediseña completamente la interfaz del juego digital RESONANCIA NEGRA como una app para tablet horizontal (1366x1024).

Basar la estructura en el manual oficial del juego (tablero pentagonal, decisiones morales, hoja digital gestionada por Clara, sistema de retos y acertijos).

🎨 SISTEMA VISUAL
Tipografía

Alumni Sans (usar distintos pesos para jerarquía).

Paleta oficial (usar exclusivamente estos colores):

#100605 → Fondo principal (negro profundo)

#063850 → Paneles / contenedores

#11A1AB → Botones principales / acciones positivas

#9F1B0B → Peligro / daño / decisiones negativas

#B89726 → Bordes activos / resaltados / selección actual

#FCFFBA → Texto principal

Estética:
Oscura, elegante, narrativa, sensación de sistema oficial postapocalíptico.
Sin diseño infantil.
Sin UI genérica.
Minimal pero tensa.

🧭 FLUJO COMPLETO DE PANTALLAS
1️⃣ PANTALLA DE CARGA

Pantalla vertical inmersiva con:

Logo RESONANCIA NEGRA centrado

Texto: "Cargando recursos..."

Barra de carga en color #B89726

Fondo con textura oscura y sombras sutiles

2️⃣ PANTALLA INICIO

Logo centrado

Botón principal: INICIAR JUEGO

Fondo narrativo con ilustración tenue

Botón en #FCFFBA con texto oscuro

3️⃣ DECISIÓN DE CAMINO (D20)

Después de presionar iniciar:

Pantalla con:

Título:
"El destino decide el camino"

Explicación:
1–10 → Camino derecho
11–20 → Camino izquierdo

Botón: Lanzar D20

Animación visual del resultado.

Mostrar claramente:
"El equipo iniciará por el CAMINO DERECHO"
o
"El equipo iniciará por el CAMINO IZQUIERDO"

Botón: Continuar

4️⃣ CONTEXTO NARRATIVO

Pantallas tipo carrusel con el texto introductorio del manual 

Sociotecnologia Proyecto 1

.

Diseño:

Fondo oscuro

Texto centrado

Botón "Continuar"

🏠 5️⃣ HOME PRINCIPAL (PANTALLA CENTRAL DEL JUEGO)

Diseño en 3 columnas:

🔹 IZQUIERDA — CASILLAS ACTIVAS (6 BOTONES)

Mostrar solo las casillas con icono (las de retos).

Cada casilla es un botón grande con:

Fondo #063850

Icono del tablero físico

Hover/activo en #B89726

Al presionar una casilla:
Se abre el modal del reto correspondiente.

NO mostrar dados.
NO mostrar tablero completo.
Solo las 6 casillas activas.

🔹 CENTRO — ESTADO DEL GRUPO

Panel con:

Puntos grupales (con stepper manual [-] número [+])

Recursos:

Escudo de Plasma

Detector de Esporas

Kit Médico

Munición

Cada recurso editable manualmente con stepper.

Mostrar:
Retos completados
Nivel de infección global (si aplica)

🔹 DERECHA — ESTADO DE JUGADORES

5 tarjetas:

Cada tarjeta incluye:

Nombre
Rol
HP → control manual [-] número [+]
Puntos → control manual [-] número [+]
Keira incluye munición editable

Sin botones fijos tipo +5.
Solo incremento libre.

🧩 MODALES DE RETOS

Cada reto debe abrir un modal inmersivo.

Estructura:

Título grande (ej: RETO: DETECTOR DE ESPORAS)

Zona

Evento narrativo

Opciones claras en botones grandes

Colores:
Decisiones positivas → #11A1AB
Decisiones negativas → #9F1B0B
Decisiones neutrales → #063850

🔐 ACERTIJOS (CASILLA AZUL)

Debe incluir:

Texto completo del acertijo

Input para escribir respuesta

Botón "Confirmar"

Validación:

Si respuesta correcta:
Mostrar pantalla éxito en turquesa
Aplicar efectos manualmente

Si incorrecta:
Mostrar alerta roja

Respuestas correctas configuradas:

Lado derecho:
“El tiempo”

Lado izquierdo:
“La infección”

Debe aceptar variaciones sin mayúsculas.

📌 RETOS LADO DERECHO

Configurar los siguientes modales:

1️⃣ Laboratorio Abandonado
2️⃣ Detector de Esporas
3️⃣ Campo de Esporas
4️⃣ Cámara Sellada
5️⃣ Tormenta de Esporas
6️⃣ Acertijo del Vigía

Cada uno con exactamente las decisiones y consecuencias descritas.

Incluir decisiones anidadas donde Clara debe elegir compartir u ocultar pista.

📌 RETOS LADO IZQUIERDO

1️⃣ Bosque Abandonado
2️⃣ Fábrica en Ruinas
3️⃣ Emboscada Nocturna
4️⃣ Señal de Radio
5️⃣ Puente Inestable
6️⃣ Acertijo: El Susurro de la Sombra

Configurar decisiones grupales y resultados como descrito.

En Puente Inestable:
Incluir tirada D20 visual solo dentro del modal.

🏁 FINAL DEL JUEGO

No mostrar botón de prueba.

Botón en Home:
FINALIZAR PARTIDA

Al presionar:
Calcular final según:

Puntos grupales

Retos completados

Recursos

Bajas

HP mínimo

Mostrar automáticamente una de las 4 pantallas finales con narrativa cinematográfica.

🏆 PODIO

Después del final:

Pantalla de ranking:

1er lugar (80+)
2do lugar (65–75)
3er lugar (50–55)

Animación elegante en dorado #B89726.

⚙️ REGLAS IMPORTANTES

El inventario NO es automático (Clara lo gestiona manualmente) 

Sociotecnologia Proyecto 1

.

La UI no debe sentirse como videojuego arcade.

Debe sentirse como sistema táctico narrativo.

Las decisiones deben tener peso visual.

Mantener coherencia con tablero pentagonal del manual