/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The React Router guide teaches integration inside an app that installed
   react-router v7; this declared surface covers exactly the members the
   samples use, with the prop shapes they pass. It never ships. */
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react';

export interface RouteObject {
  path?: string;
  element?: ReactNode;
  children?: RouteObject[];
  index?: boolean;
}

export interface Router {
  readonly routes: RouteObject[];
}

export declare function createBrowserRouter(routes: RouteObject[]): Router;
export declare const RouterProvider: ComponentType<{ router: Router }>;
export declare const Outlet: ComponentType;
export declare const Links: ComponentType;
export declare const Meta: ComponentType;
export declare const Scripts: ComponentType;
export declare const ScrollRestoration: ComponentType;
export declare const Link: ComponentType<
  AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; children?: ReactNode }
>;
