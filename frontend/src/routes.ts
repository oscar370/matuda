import type { RouteDefinition } from "@solidjs/router";

import { lazy } from "solid-js";
import AppLayout from "./components/app-layout";
import { Providers } from "./components/providers";
import { preloadConfig } from "./features/config/config.service";
import { preloadIsAppInit } from "./features/manager/manager.service";
import { preloadServiceStatus } from "./features/service/service.service";

export const routes: RouteDefinition[] = [
  {
    component: Providers,
    children: [
      {
        path: "/",
        component: lazy(() => import("@/app/home")),
        preload: preloadIsAppInit,
      },
      {
        component: AppLayout,
        children: [
          {
            path: "/service",
            component: lazy(() => import("@/app/service")),
            preload: preloadServiceStatus,
          },
          {
            path: "/config",
            component: lazy(() => import("@/app/config")),
            preload: preloadConfig,
          },
          {
            path: "/settings",
            component: lazy(() => import("@/app/settings")),
          },
        ],
      },
    ],
  },
];
