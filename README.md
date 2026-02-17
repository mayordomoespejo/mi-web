# Portfolio Web - Miguel Mayordomo

Portfolio profesional construido con React + Vite, con navegación multipágina, datos locales desde JSON (mocks) y gestión de estado con TanStack React Query.

## Stack

- React + Vite (JavaScript)
- `react-router-dom`
- `@tanstack/react-query`
- `sass` (SCSS)
- `react-hot-toast`

## Características

- Layout general con `Navbar` responsive + `Outlet` + `Footer`
- Páginas: Home, Contact, NotFound (404)
- Datos desde JSON en `src/mocks` (sin API real)
- Servicio `profileApi.js` con `getExperience()`, `getEducation()`, `getProfileSummary()` (datos locales)
- React Query para experiencia en Home (`getExperience`)
- Modal reutilizable accesible:
  - overlay
  - cierre con `ESC`
  - cierre click fuera
  - `role="dialog"` y `aria-modal="true"`
  - bloqueo de scroll del body
- Tooltip reutilizable sin librerías externas
- Copiado de email al portapapeles con toast de éxito/error

## Estructura

```txt
src/
  app/
    App.jsx
    routes.jsx
  components/
    Layout/
      Layout.jsx
      Navbar.jsx
      Footer.jsx
      WaveBars.jsx
      BrandMme.jsx
      SteppedPanel.jsx
      LanguageSwitcher.jsx
    HomeExperienceSection.jsx
    UI/
      Button.jsx
      Card.jsx
      Modal.jsx
      Tooltip.jsx
      WheelPicker.jsx
  pages/
    Home.jsx
    Contact.jsx
    NotFound.jsx
  services/
    profileApi.js
  mocks/
    experience.json
    education.json
    profile.json
  styles/
    _variables.scss
    _mixins.scss
    global.scss
    components/
    pages/
  utils/
    clipboard.js
    constants.js
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
