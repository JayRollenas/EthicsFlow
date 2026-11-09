# EthicsFlow Agent Reference

These are the shared instructions for AI agents working on EthicsFlow. Keep
this file focused on durable project conventions. Keep implementation and
workflow details in the single maintained guide:
[Developer workflow](docs/DEVELOPER_WORKFLOW.md).

## Project location

The Laravel application root is this directory (`SPPQ_App`). Run Composer,
Artisan, npm, and Git commands from here. The parent workspace is not the app
root.

## Before changing code

- Inspect the relevant routes, controllers, models, migrations, frontend pages,
  and tests before editing; follow existing patterns.
- Check the current worktree first. Preserve unrelated or pre-existing changes.
- Keep changes surgical. Do not add dependencies without approval.
- Preserve type safety and validate inputs server-side.
- For authenticated workflows, enforce authorization and record ownership on
  the server; frontend visibility is not an access control.
- Treat user uploads and sensitive research material as private unless the
  feature explicitly requires public access.

## Project conventions

- Backend: Laravel 13, PHP 8.5, Eloquent, and feature tests using Pest.
- Frontend: Inertia.js with React and TypeScript under `resources/js`.
- Routes are declared in `routes/web.php` and `routes/auth.php`.
- Run PHP formatting with Pint on changed PHP files.
- Add or update focused feature tests for behavior, authorization, validation,
  and persistence changes.

## Verification

Run the narrowest relevant tests first:

```powershell
php artisan test tests/Feature/Applications/ApplicationsTest.php
php artisan test tests/Feature/Auth/AuthenticationTest.php
```

For frontend changes, run:

```powershell
npm.cmd run build
```

PowerShell may block `npm.ps1`; use `npm.cmd`. The frontend type-check may
report existing errors in `AuthenticatedLayout.tsx` and `Dashboard.tsx`; report
baseline failures separately from diagnostics introduced by a change. To
verify Vite bundling independently, run:

```powershell
node_modules\.bin\vite.cmd build
```

## Keep the reference current

- Update [Developer workflow](docs/DEVELOPER_WORKFLOW.md) when implementation
  changes alter setup, architecture, routes, roles, persistence, workflows, or
  known limitations.
- Update this file only when durable agent-facing conventions or verification
  practices change.
- Keep one central workflow guide; do not create a separate documentation file
  for each feature.
- Summarize test/build results and any known unrelated failures in the final
  response.
