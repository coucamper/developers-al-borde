# Developers al borde de un ataque de nervios

Aplicacion estatica de una sola pagina pensada como manual honesto para desarrolladores junior.

La idea del proyecto es hablar con claridad sobre lo que rara vez se cuenta bien en la universidad o en cursos iniciales:

- Como funciona de verdad el trabajo en equipos de software.
- Que habitos vuelven fiable a una persona junior.
- Como hacer debug sin tocar cosas al azar.
- Por que dominar git cambia mucho tu nivel profesional.
- Como pensar en usuario, cliente, riesgo y contexto.
- Por que cada entorno tiene sus propias URLs, bases de datos, servidores y credenciales.
- Como crecer fuera del horario laboral sin quemarte.

## Que incluye

- Hero y narrativa principal dirigidos directamente a desarrolladores junior.
- Cinco modulos de aprendizaje practico:
  - La verdad del oficio
  - Debug y pruebas
  - Git y colaboracion
  - Entornos y produccion
  - Crecer fuera del horario
- Tres etapas de madurez:
  - `Primeros 90 dias`
  - `Entrega fiable`
  - `Criterio profesional`
- Checklists interactivos por etapa con persistencia en `localStorage`.
- Navegacion lateral por modulos y progreso visible.
- Responsive para escritorio, tablet y movil.

## Estructura

```text
developers-al-borde-v2/
  index.html
  styles/
    main.css
  scripts/
    main.js
  assets/
  README.md
```

## Como ejecutarlo en local

Al ser un proyecto estatico, puedes:

1. Abrir `index.html` directamente en el navegador.
2. Levantar un servidor local desde la raiz del proyecto:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Intencion del contenido

Este proyecto no intenta "motivar" de forma vacia. Intenta transferir criterio:

- Menos ego, mas metodo.
- Menos intuicion dramatica, mas evidencia.
- Menos velocidad nerviosa, mas fiabilidad.
- Menos consumo pasivo de contenido, mas practica con intencion.

## Decisiones tecnicas

- HTML, CSS y JavaScript sin framework para mantener el proyecto ligero y facil de abrir, leer y modificar.
- La interfaz reutiliza un sistema visual editorial e interactivo para hacer el contenido mas memorable sin depender de build tools.
- El progreso se guarda en el navegador para permitir recorridos personales por modulo y etapa.
- No hay dependencias externas ni proceso de build.

## Posibles mejoras futuras

- Anadir casos reales de debug tipo "que haria un junior fuerte aqui".
- Incluir ejemplos de buenos PR, buenos commits y malas practicas frecuentes.
- Crear una vista para mentores o tech leads con notas de facilitacion.
- Anadir mini simulaciones sobre entornos, configuracion y riesgo operacional.
