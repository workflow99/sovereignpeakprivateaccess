# React + Vite

## Login Verification

Account creation still uses the private access key. Investor login now requires the email and password first, followed by a new six-digit verification code after every logout.

The code endpoints run as Vercel serverless functions and require these server-only environment variables in Vercel:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (keep the `\\n` line breaks when pasting it)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `VERIFICATION_CODE_SECRET` (use a long random value)

For temporary Resend test mode, optionally set `RESEND_TEST_TO_EMAIL` to the single verified test recipient. Omit it after a sending domain is verified so codes go to each user's account email.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
