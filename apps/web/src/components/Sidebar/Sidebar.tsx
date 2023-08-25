// eslint-disable-next-line react-hooks/
import { useRouter } from "next/router";
import React from "react";
import { FaHouseUser } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { api } from "~/src/utils/api";
import { GuildIcon } from "../GuildSelect/Icon";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { SidebarProps, SidebarContent, GuildData, Plugin } from "../../../../../@types"

const Sidebar: React.FC<SidebarProps> = ({
  t,
  isTherePlugins,
  guild,
  onToggle,
}: SidebarProps) => {
  const { push, query } = useRouter();
  const sidebarContent: SidebarContent[][] = [
    [
      {
        name: t("guilds"),
        href: () => push("/guilds"),
        icon: <FaHouseUser />,
      },
    ],
  ];
  const plugins: Plugin[] = [];
  const [guildDataState, setGuildDataState] = React.useState<GuildData>();
  const [selectedPlugin, setSelectedPlugin] = React.useState<string>();

  if (isTherePlugins) {
    const guildData: {
      data?: GuildData;
    } = api.discord.getGuildData.useQuery(guild.id, {
      refetchOnWindowFocus: false,
    });

    React.useEffect(() => {
      if (guildData.data) setGuildDataState(guildData.data);
      setSelectedPlugin(query.plugin as string);
    }, [guildData.data]);

    const pluginsArray = Object.keys(guildDataState?.plugins || {}).map(
      (key) => ({
        name: key,
        utilities: guildDataState?.plugins[key],
      }),
    );

    pluginsArray.forEach((plugin) => {
      plugins.push({
        name: plugin.name,
        href: () => push(`/guilds/${guildDataState.id}?plugin=${plugin.name}`),
        icon: <BsGear />,
        disabled: plugin.utilities,
      });
    });
  }

  return (
    <aside
      id="logo-sidebar"
      className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full bg-[#17161e] pt-20 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-[#17161e] pb-4">
        <ul className="space-y-2 font-medium">
          {sidebarContent.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="px-3">
                {group.map((c, itemIndex) => (
                  <div key={itemIndex} className="flex w-full items-center z-10 relative">
                    <button
                      disabled={!c.disabled && Object.hasOwn(c, "disabled")}
                      onClick={c.href}
                      className="group mr-6 flex w-4/6 cursor-pointer items-center justify-between rounded-lg p-2 text-gray-300 hover:bg-[#11101a] hover:text-white disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      <div className="flex items-center justify-center">
                        <span className="ml-3 text-sm font-medium">
                          {c.icon}
                        </span>
                        <span className="ml-3">
                          {t(`items.${c.name}`, { returnObjects: true })}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              {groupIndex === 0 && isTherePlugins && (
                <hr className="my-2 border-4 border-[#11101a]" />
              )}
              {guild && (
                <div className="flex items-center justify-start gap-4 px-5 py-3">
                  <GuildIcon guild={guild} size={40} />
                  <h1 className="text-xl font-bold text-white">{guild.name}</h1>
                </div>
              )}
              <div className="mt-2 flex flex-col gap-1">
                {plugins.length > 0
                  ? plugins?.map((c, itemIndex) => (
                      <div
                        className="mx-2 rounded-lg hover:bg-[#11101a] hover:text-white"
                        style={{
                          background:
                            selectedPlugin === c.name
                              ? "linear-gradient(90deg, rgba(124,76,231,1) 0%, rgba(167,122,250,1) 100%)"
                              : "",
                        }}
                        key={itemIndex}
                      >
                        <div
                          key={itemIndex}
                          className="flex w-full items-center"
                        >
                          <button
                            disabled={
                              !c.disabled && Object.hasOwn(c, "disabled")
                            }
                            onClick={() => {
                              c.href();
                              setSelectedPlugin(c.name);
                            }}
                            className="group mr-6 flex w-4/6 cursor-pointer items-center justify-between rounded-lg p-2 text-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
                          >
                            <div className="flex items-center justify-center">
                              <span className="ml-3 text-sm font-medium">
                                {c.icon}
                              </span>
                              <span className="ml-5">
                                {t(`plugins.${c.name}`, {
                                  returnObjects: true,
                                })}
                              </span>
                            </div>
                          </button>
                          {Object.hasOwn(c, "disabled") && (
                            <label className="relative inline-flex h-fit cursor-pointer items-center">
                              <input
                                type="checkbox"
                                name="toggle"
                                id="toggle"
                                className="peer sr-only"
                                defaultChecked={c.disabled}
                                onChange={(e) => {
                                  if (onToggle)
                                    onToggle(c.name, e.target.checked);
                                  if (guildDataState) {
                                    guildDataState.plugins[c.name] =
                                      e.target.checked;
                                    setGuildDataState(guildDataState);
                                  }
                                  if (query.plugin === c.name) {
                                    push(`/guilds/${guildDataState.id}`);
                                  }
                                  if (!e.target.checked)
                                    setSelectedPlugin(undefined);
                                }}
                              />
                              <div className="peer h-6 w-11 rounded-full border-2 border-gray-500 bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-purple-200 after:transition-all after:content-[''] peer-checked:border-purple-500 peer-checked:border-opacity-30 peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-purple-500 peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                            </label>
                          )}
                        </div>
                      </div>
                    ))
                  : isTherePlugins &&
                    Array(3)
                      .fill(null)
                      .map((_, index) => (
                        <SkeletonTheme
                          baseColor="#231f31"
                          highlightColor="#16131d"
                          key={index}
                        >
                          <div className="flex">
                            <div className="ml-4 flex w-full items-center justify-start gap-4">
                              <Skeleton width={20} height={20} />
                              <Skeleton width={100} height={20} />
                            </div>
                            <div className="ml-10 flex w-full items-center justify-start">
                              <Skeleton
                                width={50}
                                height={25}
                                borderRadius={20}
                              />
                            </div>
                          </div>
                        </SkeletonTheme>
                      ))}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
