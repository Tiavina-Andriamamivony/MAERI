// Déclare les imports CSS comme side-effect valides pour TypeScript.
// Next.js gère réellement le CSS via son bundler ; cette déclaration ne sert
// qu'à éviter l'erreur TS 2882 ("Cannot find module ... './globals.css'").
declare module "*.css";
