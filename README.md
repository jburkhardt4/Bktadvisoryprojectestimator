
  # BKT Advisory (Project Estimator)

  This is a code bundle for BKT Advisory (Project Estimator). The original project is available at https://www.figma.com/design/wzYytd1PoNcanZgdHIQbL9/BKT-Advisory--Project-Estimator-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Codex account setup

  This project does not require any Codex-specific connectors. For both the `bktadvisory` and `bktadvisoryprojectestimator` environments, the only items to keep updated in your Codex account are the secrets used by the Supabase edge functions:

  - `OPENAI_API_KEY` (used by the AI routes)
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

  No other Codex integrations or account updates are needed beyond keeping these three secrets current.
  
