import React, { useState } from "react";
import type { GuildChannel, GuildData } from "../../../../../@types";
import { TFunction } from "next-i18next";

interface WelcomeMessageProps {
  channels: GuildChannel[];
  newGuildData?: GuildData;
  setnewGuildData?: any;
  t: TFunction;
}

const Welcome: React.FC<WelcomeMessageProps> = ({
  t,
  channels,
  newGuildData,
  setnewGuildData,
}: {
  t: any;
  channels: GuildChannel[];
  newGuildData?: GuildData;
  setnewGuildData?: any;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };
  const handleChannelSelected = (selectedChannel: GuildChannel) => {
    toggle();

    setnewGuildData({
      ...newGuildData,
      welcome: {
        ...newGuildData?.welcome,
        channel: selectedChannel.id,
      },
    });
  };

  const example = {
    "member.mention": t("example.member.mention"),
    "member.username": t("example.member.username"),
  };

  return (
    <div className="w-full rounded px-4 py-4">
      {/* Menu where you can select channels */}
      <div className="flex flex-col">
        <h1 className="text-xl text-gray-300">{t("welcomeChannel")}</h1>
        <div className="flex flex-wrap py-4">
          <div className="relative w-[30rem]">
            <button
              onClick={toggle}
              disabled={
                channels &&
                channels.filter((channel) => channel.type === 0).length <= 0
              }
              className={`flex w-full items-center justify-between rounded bg-[#1a1825] p-2 ring-1 ${
                open ? "ring-[#2c293f]" : "ring-[#1a1825]"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span>
                {newGuildData?.welcome.channel ? (
                  channels &&
                  channels.filter((channel) => channel.type === 0).length >
                    0 ? (
                    channels
                      .filter((channel) => channel.type === 0)
                      .map((channel) => {
                        if (channel.id === newGuildData?.welcome.channel) {
                          return (
                            <span
                              key={channel.id}
                              className="mx-1 rounded bg-[#2c293f] px-2 py-1 text-white"
                            >
                              #{channel.name}
                            </span>
                          );
                        }
                      })
                  ) : (
                    <span className="text-gray-400">{t("noChannels")}</span>
                  )
                ) : (
                  <span className="text-gray-400">
                    {t("noChannelSelected")}
                  </span>
                )}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  open ? "text-white" : "text-gray-400"
                } transition-all duration-300`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
            </button>

            <ul
              className={`absolute z-20 mt-1 h-min max-h-44 w-full overflow-y-auto overflow-x-hidden rounded bg-[#1a1825] ring-1 ring-[#2c293f] ${
                open ? "block" : "hidden"
              }`}
            >
              {/* Choices */}
              {channels &&
                channels
                  .filter((channel) => channel.type === 0)
                  .map((channel) => {
                    return (
                      <li
                        className="cursor-pointer select-none p-2 text-white hover:bg-[#2c293f]"
                        onClick={() => handleChannelSelected(channel)}
                        key={channel.id}
                      >
                        #{channel.name}
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl text-gray-300">{t("welcomeMessage")}</h1>
        <textarea
          className="mt-4 max-h-[10rem] min-h-[5rem] w-full rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
          value={newGuildData?.welcome.message}
          onChange={(e) =>
            setnewGuildData({
              ...newGuildData,
              welcome: {
                ...newGuildData?.welcome,
                message: e.target.value,
              },
            })
          }
        />
        <div className={`mt-4 flex flex-col gap-2`}>
          <p className="text-sm text-gray-400">
            {t("example.title", {
              returnObjects: true,
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(example).map((key) => {
              return (
                <button
                  key={key}
                  className="flex items-center justify-center rounded bg-[#36324d] bg-opacity-20 p-2 text-sm text-gray-300 transition-all duration-200 hover:bg-opacity-100"
                  onClick={() => {
                    setnewGuildData({
                      ...newGuildData,
                      welcome: {
                        ...newGuildData?.welcome,
                        message: `${
                          newGuildData?.welcome.message
                        } ${"{{ "}${key}${" }}"}`,
                      },
                    });
                  }}
                >
                  {t(`example.${key}`, {
                    returnObjects: true,
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
