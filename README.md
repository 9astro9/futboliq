# FUTBOLIQ — versión 100% gratuita para empezar

Esta edición está preparada para Cloudflare Workers + Workers Static Assets + D1 + Turnstile.

## Coste

Para un proyecto pequeño/personal puedes empezar con $0/mes dentro de los límites del plan gratuito. Workers Free incluye 100.000 requests/día y D1 Free incluye 5 millones de filas leídas/día, 100.000 filas escritas/día y 5 GB de almacenamiento. Turnstile tiene plan gratuito. Revisa siempre los límites actuales antes de publicar a gran escala.

## 1. Instala Node.js

Instala Node.js LTS en tu PC.

## 2. Abre una terminal en esta carpeta

```bash
npm install
```

## 3. Inicia sesión en Cloudflare

```bash
npx wrangler login
```

Se abrirá el navegador para autorizar tu cuenta.

## 4. Crea la base de datos gratuita

```bash
npx wrangler d1 create futboliq-db --use-remote
```

Wrangler mostrará un `database_id`. Copia ese ID en `wrangler.toml`, sustituyendo:

```text
REEMPLAZAR_CON_EL_ID_DE_D1
```

## 5. Crea las tablas

```bash
npx wrangler d1 migrations apply futboliq-db --remote
```

## 6. Configura secretos

No pongas secretos dentro de `index.html` ni `worker.js`.

```bash
npx wrangler secret put DEV_PANEL_CODE
npx wrangler secret put PASSWORD_PEPPER
npx wrangler secret put ADMIN_USERNAME
```

Para Turnstile:

```bash
npx wrangler secret put TURNSTILE_SECRET
```

La clave pública se configura como variable no secreta en Wrangler o en el dashboard:

```bash
npx wrangler deploy --var TURNSTILE_SITEKEY:TU_SITEKEY
```

También puedes añadirla en el dashboard de Cloudflare.

## 7. Publica

```bash
npm run deploy
```

Cloudflare te dará una dirección `workers.dev` para empezar. No hace falta comprar un dominio.

## 8. Tu primera cuenta de desarrollador

Pon como secreto:

```text
ADMIN_USERNAME=tu_usuario
DEV_PANEL_CODE=un_codigo_nuevo
```

Luego registra esa cuenta. El servidor la crea con rol `admin`.

En el juego:

```text
F → T → B
```

Después introduce el código de desarrollador.

## Seguridad

- Las contraseñas se derivan con PBKDF2-HMAC-SHA-256 y salt individual.
- Las sesiones usan tokens aleatorios almacenados como hash en D1.
- La puntuación y las respuestas correctas se calculan en el servidor.
- El rol admin se comprueba en D1 en cada operación administrativa.
- El código del panel no se envía al navegador.
- Turnstile se verifica en el servidor.
- Nunca guardes contraseñas en texto plano ni subas secretos a GitHub.

## Sobre el coste

El plan gratuito tiene límites diarios. D1 deja de aceptar consultas cuando alcanzas sus límites del día; no te convierte automáticamente en un cobro si estás en el plan Free. Para un juego pequeño es una buena forma de empezar y aprender.
