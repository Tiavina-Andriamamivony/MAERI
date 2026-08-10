import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)'])
const isApiRoute = createRouteMatcher(['/api(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // Première barrière : redirige vers la connexion si pas de session.
    const { sessionClaims } = await auth.protect()

    // Seconde barrière : le rôle vit dans `publicMetadata` (pas dans les rôles
    // d'organisation Clerk), donc `auth.protect({ role })` ne peut pas le voir.
    // Un compte connecté sans le rôle admin est renvoyé à l'accueil (401 pour
    // les routes API, qui ne suivent pas de redirection). Les pages et server
    // actions revérifient de leur côté via `requireAdmin`.
    if (sessionClaims?.metadata?.role !== 'admin') {
      return isApiRoute(req)
        ? new NextResponse('Accès refusé', { status: 401 })
        : NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}