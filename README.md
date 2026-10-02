# FUTBOLIQ

Quiz de fútbol con cuentas, ranking global, configuración y consola administrativa.

## Arquitectura

- Cloudflare Workers: backend y API.
- Workers Static Assets: interfaz.
- Cloudflare D1: cuentas, sesiones, partidas, ranking y auditoría.

## Despliegue

1. Conecta este repositorio de GitHub a **Workers & Pages → Create application → Get started → Import a repository**.
2. Importa `9astro9/futboliq`.
3. El proyecto ya incluye `wrangler.toml` y la base D1.
4. El comando de deploy ejecuta las migraciones y publica el Worker.

## Secretos

Configura en el proyecto de Cloudflare:

- `PASSWORD_PEPPER`
- `ADMIN_USERNAME`
- `DEV_PANEL_CODE`

Nunca subas estos valores a GitHub.

## Primer administrador

Antes de registrar tu cuenta, configura `ADMIN_USERNAME` con tu nombre de usuario. Esa cuenta se crea con rol `admin`.

## Consola de desarrollador

Pulsa **F**, luego **T**, luego **B**. El navegador pedirá el código de desarrollador y el servidor verificará que la cuenta tenga rol administrador.

Incluye:

- ver todas las cuentas
- sumar/restar puntos
- fijar puntuación
- bloquear/desbloquear
- promover/quitar administradores
- resetear estadísticas
- estadísticas del servidor
- registro de acciones administrativas

## Gratis

Puedes empezar con los planes gratuitos de Cloudflare dentro de sus límites actuales. Revisa los límites y precios actuales antes de crecer.

## Seguridad

- El servidor calcula la puntuación.
- Las respuestas correctas no se envían al navegador.
- Las sesiones se almacenan como hashes.
- Las contraseñas usan PBKDF2-HMAC-SHA-256 con salt individual.
- El código de desarrollador vive solo como secreto del servidor.
- El registro y el inicio de sesión tienen límites de intentos por IP.
- Se comprueba el origen de las operaciones de escritura.
