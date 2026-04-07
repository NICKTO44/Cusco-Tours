# Mascca Tours Cusco

Sitio web profesional para **Mascca Tours Cusco** (Cusco, Perú): tours, movilidad privada y reservas bilingües (ES/EN).

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- **next-intl** — rutas localizadas (`es` por defecto, `en` con prefijo `/en`)
- Framer Motion, React Hook Form
- **next/image** con dominio permitido `images.unsplash.com`
- PayPal (**@paypal/react-paypal-js**) y Cloudflare Turnstile (**@marsidev/react-turnstile**)

## Instalación

```bash
cd mascca-tours-cusco
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) (español por defecto). Inglés: [http://localhost:3000/en](http://localhost:3000/en).

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# PayPal (SDK oficial en el cliente — solo la client ID pública)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_de_paypal

# Cloudflare Turnstile (widget visible en /reservas)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=tu_site_key_de_turnstile
```

### PayPal

1. Crea una aplicación en [PayPal Developer](https://developer.paypal.com/).
2. Copia el **Client ID** del entorno que uses (Sandbox para pruebas, Live para producción).
3. Pégalo en `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.

Sin esta variable, la sección de pago muestra un aviso y el botón de PayPal no se carga.

### Cloudflare Turnstile

1. En el panel de Cloudflare, crea un sitio **Turnstile** (widget managed o non-interactive).
2. Copia la **Site Key** pública en `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

Si no configuras Turnstile, el formulario de reserva **no** exige captcha (útil en desarrollo). En producción se recomienda activarlo.

> El importe enviado a PayPal se toma del tour o ruta seleccionada (precio en USD de los datos de ejemplo). Para rutas “a consultar” se usa un monto placeholder (`50.00` USD) hasta que conectes tu lógica real en servidor.

## Estructura de rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Inicio |
| `/tours` | Listado de tours |
| `/tours/[slug]` | Detalle |
| `/movilidad-privada` | Transporte privado |
| `/galeria` | Galería |
| `/machu-picchu-tips` | Consejos |
| `/preguntas-frecuentes` | FAQ |
| `/reservas` | Formulario + WhatsApp + PayPal + Turnstile |
| `/contacto` | Contacto y mapa |
| `/gracias` | Tras pago PayPal (redirección cliente) |

Rutas en inglés con prefijo `/en/...`.

## Datos de ejemplo

Tours, rutas de movilidad, imágenes y textos viven en `src/data/` y `messages/*.json`. Sustituye por contenido real y fotos propias cuando estén listos.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — compilación de producción
- `npm run start` — servir build
- `npm run lint` — ESLint
