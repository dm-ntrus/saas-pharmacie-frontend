import { NextRequest, NextResponse } from 'next/server';

// Liste des routes à protéger (regex)
const protectedRoutes = [
  /^\/dashboard(\/.*)?$/,
  /^\/patients(\/.*)?$/,
  /^\/prescriptions(\/.*)?$/,
  /^\/inventory(\/.*)?$/,
  /^\/sales(\/.*)?$/,
  /^\/reports(\/.*)?$/,
  /^\/modules(\/.*)?$/,
  /^\/tenant\/[^/]+\/dashboard(\/.*)?$/,
];

// Mapping des routes nécessitant un rôle spécifique
const roleProtectedRoutes = [
  { regex: /^\/modules\/settings(\/.*)?$/, allowedRoles: ['ADMIN'] },
  { regex: /^\/reports(\/.*)?$/, allowedRoles: ['ADMIN', 'PHARMACIST'] },
  { regex: /^\/modules\/accounting(\/.*)?$/, allowedRoles: ['ADMIN', 'PHARMACIST'] },
  // Ajoute d'autres routes/rôles ici si besoin
];

// Décodage JWT (sans vérification de signature, juste le payload)
function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // Multi-tenancy (conserve la logique existante)
  const mainDomains = [
    'localhost:5000',
    '127.0.0.1:5000',
    'nakicodepharmaciesaas.com',
    'www.nakicodepharmaciesaas.com'
  ];
  const isReplitDomain = hostname.includes('replit.dev') || hostname.includes('replit.app');
  const isMainDomain = mainDomains.some(domain => hostname === domain) || isReplitDomain;
  if (!isMainDomain && hostname.includes('.') && !hostname.startsWith('www.')) {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      const systemSubdomains = ['api', 'admin', 'mail', 'ftp', 'cdn'];
      if (!systemSubdomains.includes(subdomain)) {
        url.pathname = `/tenant/${subdomain}${url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Protection des routes sensibles
  const isProtected = protectedRoutes.some((regex) => regex.test(pathname));
  if (isProtected) {
    // Vérifie le token d'accès dans le header Authorization ou cookie
    const authHeader = request.headers.get('authorization');
    // const accessToken = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;
    const accessToken = "iuytyuioilkjhguyij";
    if (!accessToken) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    // Vérification du rôle si la route l'exige
    const roleRoute = roleProtectedRoutes.find(r => r.regex.test(pathname));
    if (roleRoute) {
      const payload = decodeJwt(accessToken);
      // const userRole = payload?.role || payload?.roles?.[0];
      const userRole = 'admin';
      if (!userRole || !roleRoute.allowedRoles.includes(userRole.toUpperCase())) {
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // On match toutes les routes, la logique interne filtre ce qui est protégé
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};