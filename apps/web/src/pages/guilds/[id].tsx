import { type GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import Header from "~/src/components/Header/Header";
import { getServerAuthSession } from "src/server/auth";
import { api } from "~/src/utils/api";
import {
  buildInviteUrl,
  getGuild,
  getGuildRoles,
  getGuildChannels,
} from "~/src/utils/discord";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Sidebar from "~/src/components/Sidebar/Sidebar";
import { useRouter } from "next/router";
import { upperFirstLetter } from "~/src/utils/functions";
import WelcomeMessage from "~/src/components/Welcome/Welcome";
import AccessControl from "~/src/components/Access/Access";
import {
  GuildRole,
  GuildChannel,
  DiscordGuild,
  GuildData,
} from "../../../../../@types";
import Leveling from "~/src/components/Leveling/Leveling";

const GuildPage = ({
  guild,
  roles,
  channels,
}: {
  guild: DiscordGuild;
  roles: GuildRole[];
  channels: GuildChannel[];
}) => {
  const setGuildData = api.discord.setGuildData.useMutation();
  const { t } = useTranslation("guildconfig");
  const { query, push } = useRouter();
  const plugin = query.plugin as string;

  const res: {
    isLoading: boolean;
    isFetched: boolean;
    data?: GuildData;
  } = api.discord.getGuildData.useQuery(guild.id, {
    refetchOnWindowFocus: false,
  });

  const [newGuildData, setnewGuildData] = useState<GuildData>();

  useEffect(() => {
    if (res.isFetched && res.data) {
      setnewGuildData(res.data as unknown as GuildData);
    }
  }, [res.data]);

  useEffect(() => {
    if (!res.data?.plugins[plugin] && res.data?.plugins) {
      push(`/guilds/${guild.id}`);
    }
  }, [plugin, res.data]);

  const handlePluginToggle = async (pluginName: string, isChecked: boolean) => {
    try {
      await setGuildData.mutateAsync({
        id: guild.id,
        plugins: {
          ...newGuildData?.plugins,
          [pluginName]: isChecked,
        },
        ...newGuildData,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const componentsPerCategory = {
    utilities: [
      {
        name: t("welcomeMessage"),
        component: (
          <WelcomeMessage
            t={t}
            channels={channels}
            newGuildData={newGuildData}
            setnewGuildData={setnewGuildData}
          />
        ),
      },
      {
        name: t("accessControl"),
        component: (
          <AccessControl
            t={t}
            roles={roles}
            newGuildData={newGuildData}
            setnewGuildData={setnewGuildData}
          />
        ),
      },
    ],
    moderation: [],
    leveling: [
      {
        name: "Leveling",
        component: (
          <Leveling
            t={t}
            channels={channels}
            newGuildData={newGuildData}
            setnewGuildData={setnewGuildData}
          />
        ),
      },
    ],
  };

  const [changesDetected, setChangesDetected] = useState(false);
  // Function to check if changes are detected
  const areChangesDetected = () => {
    if (!newGuildData) return false;

    const changesDetected =
      JSON.stringify(res.data) !== JSON.stringify(newGuildData);

    if (changesDetected) {
      setChangesDetected(true);
      return true;
    }

    setChangesDetected(false);
    return false;
  };

  useEffect(() => {
    const changesDetected = areChangesDetected();

    setChangesDetected(changesDetected);

    return () => {
      setChangesDetected(false);
    };
  }, [newGuildData]);

  return (
    <div className="flex h-full min-h-screen w-screen flex-wrap items-start justify-center bg-[#17161e]">
      <Header t={useTranslation("header").t} />
      <Sidebar
        t={useTranslation("sidebar").t}
        guild={guild}
        isTherePlugins={true}
        onToggle={handlePluginToggle}
      />
      <div className="my-20 flex w-10/12 flex-col rounded-[2rem] bg-[#0f0d18] p-8 sm:ml-64">
        {res.data?.plugins[plugin] ? (
          componentsPerCategory[plugin].map((component, key) => {
            return (
              <div key={key}>
                <h1 className="py-3 text-2xl text-gray-300">
                  {upperFirstLetter(component.name)}
                </h1>
                <div className="flex h-fit w-full items-center gap-4 rounded border-4 border-[#191824] bg-[#0d0b18] px-4 py-4">
                  {component.component}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex w-full items-center gap-4 rounded border-4 border-[#191824] bg-[#0d0b18] px-4 py-4">
            <h1 className="text-lg text-gray-300">{t("noPluginSelected")}</h1>
          </div>
        )}
      </div>
      <div
        className={`prevent-animation fixed bottom-10 z-50 w-10/12 rounded-lg bg-[#17181f] px-4 text-white transition-all lg:px-6
        `}
        id={
          changesDetected
            ? "animate-changes-detected"
            : "animate-changes-not-detected"
        }
        data-visible="true"
      >
        <div className="bg-dark-900 flex w-full items-center justify-between rounded-lg py-5 pl-5 pr-4">
          <p className="text-dark-100 text-sm">{t("changesDetected")}</p>
          <div className="flex space-x-3">
            <button
              className="relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg bg-white bg-opacity-10 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-opacity-20 active:bg-opacity-5 active:text-opacity-60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-opacity-10"
              onClick={() => {
                setnewGuildData(res.data);
                setChangesDetected(false);
              }}
            >
              <div className="flex max-w-full flex-grow justify-center">
                <span className="block w-full shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-center transition-all duration-200">
                  {t("cancel")}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setGuildData.mutate(newGuildData, {
                  onSuccess: () => {
                    setChangesDetected(false);
                    setnewGuildData(newGuildData);
                  },
                });
              }}
              className="text-dark-100 relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg bg-purple-500 bg-opacity-70 px-4 py-2 text-sm transition-all duration-200 hover:bg-opacity-100 active:bg-opacity-40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex max-w-full flex-grow justify-center">
                <span className="block w-full shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-center transition-all duration-200">
                  {t("save")}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
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

  const { id } = context.params as { id: string };
  const guild = await getGuild(id);
  const roles = await getGuildRoles(id);
  const channels = await getGuildChannels(id);

  // If guild response is null, the bot is not in the guild, prompt user to invite
  if (!guild) {
    return {
      redirect: {
        destination: buildInviteUrl(id),
        permanent: false,
      },
    };
  }

  return {
    props: {
      guild: guild,
      roles: roles,
      channels: channels,
      ...(await serverSideTranslations(context.locale, [
        "guildconfig",
        "header",
        "sidebar",
      ])),
    },
  };
};

export default GuildPage;
