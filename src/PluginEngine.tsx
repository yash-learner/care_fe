/* eslint-disable i18next/no-literal-string */
import React, { Suspense, useEffect, useState } from "react";

import ErrorBoundary from "@/components/Common/ErrorBoundary";
import Loading from "@/components/Common/Loading";

import { CareAppsContext, useCareApps } from "@/hooks/useCareApps";

import { SupportedPluginComponents, pluginMap } from "@/pluginTypes";

export default function PluginEngine({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            Error loading plugins
          </div>
        }
      >
        <CareAppsContext.Provider value={pluginMap}>
          {/* <RemoteComponent
            url="http://localhost:5000/assets/remoteEntry.js"
            scope="care_livekit"
            module="CareLivekit"
          /> */}
          <DynamicMicrofrontend configUrl="http://localhost:5173/assets/remoteEntry.js" />
          {children}
        </CareAppsContext.Provider>
      </ErrorBoundary>
    </Suspense>
  );
}

type PluginProps<K extends keyof SupportedPluginComponents> =
  React.ComponentProps<SupportedPluginComponents[K]>;

export function PLUGIN_Component<K extends keyof SupportedPluginComponents>({
  __name,
  ...props
}: { __name: K } & PluginProps<K>) {
  const plugins = useCareApps();

  return (
    <>
      {plugins.map((plugin) => {
        const Component = plugin.components[
          __name
        ] as React.ComponentType<unknown>;

        if (!Component) {
          return null;
        }

        return <Component {...props} key={plugin.plugin} />;
      })}
    </>
  );
}

type MicrofrontendConfig = {
  url: string; // URL to the remoteEntry.js
  module: string; // Exposed module key (e.g., "./CareLivekit")
};

type DynamicMicrofrontendProps = {
  configUrl: string; // API endpoint to fetch microfrontend config
};

const DynamicMicrofrontend: React.FC<DynamicMicrofrontendProps> = ({
  configUrl,
}) => {
  const [MicrofrontendComponent, setMicrofrontendComponent] =
    useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMicrofrontend = async () => {
      try {
        // Fetch microfrontend configuration
        const response = await fetch(configUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch microfrontend configuration from ${configUrl}`,
          );
        }

        const config: MicrofrontendConfig = {
          url: "http://localhost:5173/assets/remoteEntry.js",
          module: "./CareLivekit",
        };

        // Dynamically import the remoteEntry.js
        const remote = await import(/* @vite-ignore */ config.url);

        // Initialize shared dependencies
        await remote.init({
          react: { singleton: true, version: "18.0.0" },
          "react-dom": { singleton: true, version: "18.0.0" },
        });

        // Get the exposed module
        const ModuleFactory = await remote.get(config.module);
        const Component = ModuleFactory();

        setMicrofrontendComponent(() => Component);
      } catch (err: any) {
        console.error("Error loading microfrontend:", err);
        setError(
          err.message || "An error occurred while loading the microfrontend.",
        );
      }
    };

    loadMicrofrontend();
  }, [configUrl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!MicrofrontendComponent) {
    return <div>Loading microfrontend...</div>;
  }

  return (
    <Suspense fallback={<div>Loading microfrontend component...</div>}>
      <MicrofrontendComponent />
    </Suspense>
  );
};
