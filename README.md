# Portfolio Web - Miguel Mayordomo

Portfolio profesional construido con React + Vite, con arquitectura por dominios (`features`) y módulos compartidos (`shared`).

## Stack

- React + Vite (JavaScript)
- `react-router-dom`
- `@tanstack/react-query`
- `sass` (SCSS)
- `react-hot-toast`

## Características

- Layout general con `WaveBars` + `SteppedPanel` + `Outlet` + `Footer`
- Páginas: Home, Contact, NotFound (404)
- Datos desde JSON en `src/mocks` (sin API real)
- Servicio `profileApi.js` con `getExperience()` y `getEducation()` (datos locales)
- React Query para experiencia y formación en Home
- Modal reutilizable accesible:
  - overlay
  - cierre con `ESC`
  - cierre click fuera
  - `role="dialog"` y `aria-modal="true"`
  - bloqueo de scroll del body
- Copiado de email al portapapeles con toast de éxito/error

## Estructura

```txt
src/
  app/
    App.jsx
    router.jsx
  features/
    home/
      pages/HomePage.jsx
      components/
    contact/
      pages/ContactPage.jsx
    not-found/
      pages/NotFoundPage.jsx
  shared/
    components/
      layout/
      ui/
    constants/
    lib/
  services/
    profileApi.js
  mocks/
    experience.json
    education.json
  styles/
    abstracts/
    components/
    features/
    index.scss
  main.jsx
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # entorno de desarrollo
npm run build    # build de producción
npm run preview  # preview del build
```

## Datos del portfolio

- Nombre: Miguel Mayordomo
- Rol: Desarrollador Frontend / Mobile
- Experiencia principal: Gyoza Technology Studio S.L. (Remoto) — Feb 2024 - Actualidad
- Formación:
  - Técnico Superior en DAW — ILERNA FP (2023–2024)
  - Bachillerato Científico-Tecnológico — IES Ricardo Ortega (2002–2004)

## Contacto

- Email: `miguelmayordomoespejo@gmail.com`
- GitHub: https://github.com/mayordomoespejo
- LinkedIn: https://www.linkedin.com/in/miguel-mayordomo-espejo-779542203
