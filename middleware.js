import { NextResponse } from 'next/server';
import projectsConfig from './projects.json';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');

  // Check if the hostname exists in our project configuration
  if (projectsConfig[hostname]) {
    // Rewrite the URL to a specific page, passing the hostname as a query parameter
    url.pathname = `/project`;
    url.searchParams.set('projectHostname', hostname);

    return NextResponse.rewrite(url);
  }

  // If no matching project is found, let the request proceed normally
  return NextResponse.next();
}
