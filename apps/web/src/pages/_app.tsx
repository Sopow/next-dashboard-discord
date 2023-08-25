import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import Layout from "~/src/components/Layout";
import "~/src/styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { api } from "~/src/utils/api";
import { appWithTranslation } from "next-i18next";
import React from "react";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <Layout>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Layout>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
