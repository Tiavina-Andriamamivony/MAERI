export {};

/** Rôles reconnus par l'application, stockés dans `publicMetadata.role` (Clerk). */
export type Role = "admin";

declare global {
  /**
   * Claims personnalisés du session token Clerk. Nécessite dans le Dashboard
   * Clerk (Sessions → Customize session token → Claims) :
   *
   *   { "metadata": "{{user.public_metadata}}" }
   *
   * Sans ce claim, `metadata` est `undefined` et l'accès admin est refusé.
   */
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Role;
    };
  }
}
