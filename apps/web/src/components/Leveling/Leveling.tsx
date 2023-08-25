import React, { useState } from "react";
import type { GuildChannel, GuildData } from "../../../../../@types";
import { TFunction } from "next-i18next";
import XPCard from "./XPCard";
import { useSession } from "next-auth/react";

interface LevelingProps {
  channels: GuildChannel[];
  newGuildData?: GuildData;
  setnewGuildData?: any;
  t: TFunction;
}

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: "online", label: "Online" },
  { value: "idle", label: "Idle" },
  { value: "dnd", label: "DND" },
  { value: "offline", label: "Offline" },
];

const Leveling: React.FC<LevelingProps> = ({
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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleChannelSelected = (selectedChannel: GuildChannel) => {
    toggle();

    setnewGuildData({
      ...newGuildData,
      leveling: {
        ...newGuildData?.leveling,
        channel: selectedChannel.id,
      },
    });
  };

  const handleStatusSelected = (selectedStatus: string) => {
    toggleStatusDropdown();
    setCardData({
      ...cardData,
      status: selectedStatus,
    });
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : "";
  };

  const example = {
    "member.mention": t("example.member.mention"),
    "member.level": t("example.member.level"),
  };

  const handleCardData = (key: string, value: string) => {
    const isValidColor = (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
    const isValidURL = (value: string) => {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return false;
      }
    };
    if (isValidColor(value) || isValidURL(value)) {
      setCardData({
        ...cardData,
        [key]: value,
      });
      setnewGuildData({
        ...newGuildData,
        leveling: {
          ...newGuildData?.leveling,
          card: {
            ...newGuildData?.leveling.card,
            [key]: value,
          },
        },
      });
    }
  };

  const initialCardData = {
    background: newGuildData?.leveling.card.background,
    progressBarColor: newGuildData?.leveling.card.progressBarColor,
    textColor: newGuildData?.leveling.card.textColor,
    username: session?.user?.name,
    avatar: session?.user?.image,
    status: "online",
    overlay: newGuildData?.leveling.card.overlay,
  };

  const [cardData, setCardData] = useState(initialCardData);

  // Utilisez useEffect pour mettre à jour cardData lorsque newGuildData change
  React.useEffect(() => {
    setCardData(initialCardData);
  }, [newGuildData]);

  return (
    <div className="w-full rounded px-4 py-4">
      {/* Menu where you can select channels */}
      <div className="flex flex-col">
        <h1 className="text-xl text-gray-300">Level Up Channel</h1>
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
                {newGuildData?.leveling.channel ? (
                  channels &&
                  channels.filter((channel) => channel.type === 0).length >
                    0 ? (
                    channels
                      .filter((channel) => channel.type === 0)
                      .map((channel) => {
                        if (channel.id === newGuildData?.leveling.channel) {
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
        <h1 className="text-xl text-gray-300">Level Up Message</h1>
        <textarea
          className="mt-4 max-h-[10rem] min-h-[5rem] w-full rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
          value={newGuildData?.leveling.message}
          onChange={(e) =>
            setnewGuildData({
              ...newGuildData,
              leveling: {
                ...newGuildData?.leveling,
                message: e.target.value,
              },
            })
          }
        />
        <div className={`mt-4 flex flex-col gap-2 pb-4`}>
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
                      leveling: {
                        ...newGuildData?.leveling,
                        message: `${
                          newGuildData?.leveling.message
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
      <div className="flex flex-col">
        <h1 className="text-xl text-gray-300">Level Up Card</h1>
        <div className="flex flex-col flex-wrap py-4">
          <XPCard data={cardData} />
          <div className="mt-4 flex flex-row">
            <div className="pr-4">
              <p className="text-sm text-gray-400">Progress Bar Color</p>
              <input
                type="color"
                className="mt-2 h-10 w-16 rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
                value={cardData.progressBarColor}
                onChange={(e) => {
                  handleCardData("progressBarColor", e.target.value);
                }}
              />
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-400">Background</p>
              <textarea
                className="mt-2 h-10 w-full resize-none rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
                value={cardData.background}
                onChange={(e) => {
                  setCardData({
                    ...cardData,
                    background: e.target.value,
                  });
                  setnewGuildData({
                    ...newGuildData,
                    leveling: {
                      ...newGuildData?.leveling,
                      card: {
                        ...newGuildData?.leveling.card,
                        background: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-400">Overlay Color</p>
              <input
                type="color"
                className="mt-2 h-10 w-16 rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
                value={cardData.overlay}
                onChange={(e) => {
                  handleCardData("overlay", e.target.value);
                }}
              />
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-400">Text Color</p>
              <input
                type="color"
                className="mt-2 h-10 w-16 rounded bg-[#1a1825] px-4 py-2 text-gray-300 outline-none"
                value={cardData.textColor}
                onChange={(e) => {
                  handleCardData("textColor", e.target.value);
                }}
              />
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-400">Status</p>
              {/** Choices */}
              <div className="relative mt-2 h-10 w-32">
                <button
                  onClick={toggleStatusDropdown}
                  className={`flex w-full text-white items-center justify-between rounded bg-[#1a1825] p-2 ring-1 ${
                    statusDropdownOpen ? "ring-[#2c293f]" : "ring-[#1a1825]"
                  }`}
                >
                  <span>{getStatusLabel(cardData.status)}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      statusDropdownOpen ? "text-white" : "text-gray-400"
                    } transition-all duration-300`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {statusDropdownOpen ? (
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
                  className={`absolute z-20 mt-1 h-min max-h-28 w-full overflow-y-auto overflow-x-hidden rounded bg-[#1a1825] ring-1 ring-[#2c293f] ${
                    statusDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  {statusOptions.map((option) => (
                    <li
                      key={option.value}
                      className={`cursor-pointer select-none p-2 ${
                        cardData.status === option.value ? "bg-[#2c293f]" : ""
                      } text-white hover:bg-[#2c293f]`}
                      onClick={() => handleStatusSelected(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leveling;
