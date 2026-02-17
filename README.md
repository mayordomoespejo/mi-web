# Portfolio Web - Miguel Mayordomo

Portfolio profesional construido con React + Vite, con navegación multipágina, consumo de datos locales simulados vía Axios y gestión de estado servidor con TanStack React Query.

## Stack

- React + Vite (JavaScript)
- `react-router-dom`
- `@tanstack/react-query`
- `axios`
- `sass` (SCSS)
- `react-hot-toast`

## Características

- Layout general con `Navbar` responsive + `Outlet` + `Footer`
- Páginas: Home, Experience, Education, Contact, NotFound (404)
- API local simulada con JSON en `src/mocks`
- 3 queries con React Query:
  - `getExperience()`
  - `getEducation()`
  - `getProfileSummary()`
- Estados de UI en queries: loading, error, empty
- Botón `Refrescar` en Experience y Education con `invalidateQueries`
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
    UI/
      Button.jsx
      Card.jsx
      Modal.jsx
      Tooltip.jsx
  pages/
    Home.jsx
    Experience.jsx
    Education.jsx
    Contact.jsx
    NotFound.jsx
  services/
    apiClient.js
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
