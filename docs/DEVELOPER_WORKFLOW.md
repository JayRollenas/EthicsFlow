# EthicsFlow Developer Workflow

This is the central developer guide for the EthicsFlow application. Update this
file when implementation changes alter how developers run, test, or understand
the system. Keep workflow documentation here instead of creating a separate
guide for each feature.

## Project layout

The Laravel application is in `SPPQ_App`, not the parent workspace directory.
Run Composer, Artisan, and frontend commands from this directory.

- `app/Http/Controllers` — request handling and application workflows.
- `app/Models` — Eloquent models and relationships.
- `routes/web.php` and `routes/auth.php` — web and authentication routes.
- `database/migrations` and `database/seeders` — schema and local test data.
- `resources/js/Pages` — Inertia React pages.
- `resources/js/Layouts/AuthenticatedLayout.tsx` — authenticated navigation.
- `tests/Feature` — HTTP, authorization, and workflow tests.

## Local development

Prerequisites are PHP 8.3 or later, Composer, Node.js/npm, and a database
configured in `.env`. The checked-in `phpunit.xml` configures feature tests to
use an in-memory SQLite database.

From `SPPQ_App`, install dependencies if needed:

```powershell
composer install
npm.cmd install
```

In separate terminals, run the Laravel and frontend development servers:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
npm.cmd run dev
```

Open `http://localhost:8000`. In PowerShell, use `npm.cmd` if the execution
policy prevents running `npm.ps1`.

Apply database migrations and populate local demo accounts with:

```powershell
php artisan migrate
php artisan db:seed
```

The `DatabaseSeeder` intentionally returns without creating demo accounts
outside the `local` and `testing` environments. Never use production seeding as
a way to create or repair user accounts. In local/testing databases it seeds
nine reviewer accounts: `elena.garcia@example.test` (password `elena123`) and
`reviewer1@example.test` through `reviewer8@example.test` (password
`Reviewer123!` for each). Re-run `php artisan db:seed` to create or refresh
these accounts; seeding is idempotent.

Run the relevant application tests with:

```powershell
php artisan test tests/Feature/Applications/ApplicationsTest.php
php artisan test tests/Feature/Auth/AuthenticationTest.php
```

`npm.cmd run build` runs TypeScript checking and Vite. The Vite bundle can be
built separately with `node_modules\.bin\vite.cmd build` when unrelated
TypeScript diagnostics prevent the combined command from completing.

## Roles and authentication

The `users.role` column accepts `researcher`, `reviewer`, and `coordinator`.
Student accounts use the `researcher` role. Registration currently creates
researchers; login uses Laravel's standard email/password authentication.

Authentication routes are in `routes/auth.php`. Authenticated user data is
shared with Inertia by `HandleInertiaRequests`. The dashboard route in
`routes/web.php` selects a page based on the user's role.

The student application routes require authentication and verified email.
Application listing, creation, submission, and confirmation are additionally
restricted to researchers in `ApplicationsController`. Keep ownership checks
on the server; hiding a link or button in React is not authorization.

## Student application lifecycle

1. A researcher opens **My Applications** (`GET /applications`) or starts a
   new form (`GET /applications/create`).
2. The React wizard gathers research details, researcher/adviser information,
   ethics answers, and required documents.
3. The final submit action posts the structured form and uploaded files to
   `POST /applications`. Laravel validates each section and requires manuscript,
   consent, and instruments PDFs.
4. Laravel creates a `research_fields` entry for the selected research type if
   needed, then creates a `research_submissions` record with `submitted` status
   and its initial `submission_versions` record.
5. Uploaded documents are stored on Laravel's private `local` disk under a
   submission-specific directory. Database writes run in a transaction; files
   written before a failed submission are removed.
6. On success, the researcher is redirected to an owner-checked confirmation
   page. Its reference is generated from the submission year and database ID.
7. **My Applications** queries only the signed-in researcher's records with a
   non-null `submitted_at`, then displays their reference, title, department,
   status, and dates. Draft and other students' records are excluded.

The related routes and implementation are:

- `GET /applications` — `applications.index`
- `GET /applications/create` — `applications.create`
- `POST /applications` — `applications.store`
- `GET /applications/{submission}/revision` — `applications.revision`
- `POST /applications/{submission}/revision` — `applications.resubmit`
- `GET /applications/{submission}/confirmation` — `applications.confirmation`
- `ApplicationsController`, `ResearchSubmission`, `ResearchField`, and the
  `User::researchSubmissions()` relationship
- `resources/js/Pages/Applications/Create.tsx` and
  `resources/js/Pages/Applications/Index.tsx`

## Coordinator, reviewer, and clearance lifecycle

1. `/dashboard` dispatches coordinators and reviewers to their database-backed
   dashboards through `RoleDashboardController`.
2. Coordinators can view submitted manuscript details and download private
   documents. Their operational action is assigning exactly three distinct
   reviewer accounts to a submission in `submitted` or `resubmitted` status.
   The coordinator does not perform compliance checks or return applications.
3. Each reviewer receives an assignment and can download only documents
   associated with the version assigned to them. Opening an assigned review
   marks it `in_progress`.
4. Each reviewer submits one `approve` or `disapprove` recommendation and a
   required written comment. The panel waits until all three reviews are
   submitted. Unanimous approval marks the panel approved, the submission
   cleared, and creates an ethics clearance automatically.
5. After all reviews are submitted, any disapproval requests revisions and
   notifies the researcher; no clearance is issued. The researcher can open the
   revision form only for their own application while its status is
   `revision_required`, then resubmit a new version. The coordinator can assign
   a new panel cycle to that `resubmitted` version.

The workflow endpoints are declared in `routes/web.php`:

- `POST /coordinator/submissions/{submission}/panel`
- `GET /coordinator/submissions/{submission}/documents/{document}`
- `POST /reviewer/assignments/{assignment}/start`
- `POST /reviewer/assignments/{assignment}/review`
- `GET /reviewer/assignments/{assignment}/documents/{document}`

`CoordinatorWorkflowController` and `ReviewerWorkflowController` enforce role,
status, and assignment checks server-side. Document storage remains on the
private `local` disk; dashboard props include filenames, not storage paths.

## Current workflow boundaries

- **Save draft** and **Save and exit** in the application wizard are not backed
  by persistence. The application list intentionally shows submitted records,
  not unsaved browser state or database drafts.
- Reviewer expertise matching is not implemented; coordinators can select any
  three distinct accounts with the reviewer role.
- User and account administration are outside the coordinator's assignment
  workflow.
- The student dashboard still contains sample application data. The
  authoritative submitted-application list is **My Applications**.

## Feature change checklist

When changing an application workflow, update this guide only when its setup
instructions, route map, roles, persistence behavior, or workflow boundaries
change. Add or update focused feature tests for ownership, authorization,
validation, review outcomes, and resulting database/storage behavior. Preserve
server-side authorization and avoid exposing private uploads through public
storage.
