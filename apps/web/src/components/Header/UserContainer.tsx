// header/UserContainer.tsx
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/src/utils/api";
import React from "react";

interface UserContainerProps {
  session: any; // Remplacez par le type approprié pour votre session
  t: (key: string) => string;
  openMenu: boolean;
  onMenuToggle: () => void;
}

const UserContainer: React.FC<UserContainerProps> = ({
  session,
  t,
  openMenu,
  onMenuToggle,
}) => {
  const { data: user } = api.discord.getUserData.useQuery(session.user.id, {
    refetchOnWindowFocus: false,
  });
  const { push } = useRouter();

  const buttons = [
    {
      text: t("guilds"),
      onClick: () => push(`/guilds`),
      color: "#fff",
    },
    {
      text: t("logout"),
      onClick: () => signOut(),
      color: "#ef4444",
    },
  ];

  return (
    !!user && (
      <div
        className="relative flex cursor-pointer items-center gap-2 text-white"
        onClick={() => {
          onMenuToggle(); // Toggle the menu state in the parent component
        }}
      >
        <img
          className="rounded-full"
          src={`https://cdn.discordapp.com/avatars/${user?.id}/${user.avatar}.png`}
          alt={user.global_name}
          width={32}
          height={32}
        />
        <p className="text-sm">{user.global_name}</p>
        <svg
          className="ml-2 h-4 w-4 -scale-x-[1]"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        <div
          style={{ display: !openMenu ? "none" : "block" }}
          id="dropdownDefaultRadio"
          className="absolute right-0 top-12 z-20 hidden min-w-[170px] max-w-[200px] divide-y rounded-lg bg-[#24252e] shadow"
        >
          <ul
            className="space-2 text-sm text-gray-700"
            aria-labelledby="dropdownRadioButton"
          >
            {buttons?.map((c, key) => (
              <div key={key}>
              <span
                key={key}
                className="mx-2 my-2 grid grid-cols-1 gap-1.5"
                onClick={() => {
                  c.onClick();
                  onMenuToggle();
                }}
              >
                <div
                  className={`flex items-center cursor-pointer justify-start gap-3 rounded-sm px-4 py-2 transition-all duration-200 hover:bg-[#363845]`}
                  style={{ color: c.color }}
                >
                  <p>{c.text}</p>
                </div>
              </span>
              {key !== buttons.length - 1 && (
                  <hr className="h-[1.5px] cursor-auto border-[#4f5265] w-5/6 mx-auto my-2" />
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default UserContainer;