import { type GetServerSideProps } from "next";
import Header from "~/src/components/Header/Header";
import { getServerAuthSession } from "src/server/auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Sidebar from "~/src/components/Sidebar/Sidebar";
import React from "react";
import Guilds from "~/src/components/GuildSelect/Guild";
import GuildSearch from "~/src/components/GuildSelect/Search";
import { motion } from "framer-motion";

const Index = () => {
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex h-[100vh] w-[100vw] flex-wrap items-start justify-start bg-[#17161e]">
      <Header t={useTranslation("header").t} />
      <Sidebar
        t={useTranslation("sidebar").t}
        isTherePlugins={false}
        guild={null}
        onToggle={null}
      />
      <motion.div
        className="mt-20 h-4/5 w-10/12 rounded-[2rem] bg-[#0f0d18] p-8 sm:ml-64"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex gap-12 pb-6">
          <h1 className="text-4xl font-bold text-white">Select a Server</h1>
          <GuildSearch setSearch={setSearch} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Guilds search={search} t={useTranslation("guilds").t} />
        </div>
      </motion.div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // If redirecting from adding the bot, redirect to that guild
  const { guild_id } = context.query as { guild_id?: string };
  if (guild_id) {
    return {
      redirect: {
        destination: `/${context.locale}/guilds/${guild_id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "guilds",
        "header",
        "sidebar",
      ])),
    },
  };
};

export default Index;
