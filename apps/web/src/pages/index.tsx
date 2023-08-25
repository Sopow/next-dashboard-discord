import { type GetServerSideProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { buildInviteUrl, getTopGuilds } from "../utils/discord";
import { signIn, useSession } from "next-auth/react";
import env from "../env";
import { DiscordGuild } from "../../../../@types";
import { FaSkull, FaLevelUpAlt, FaLanguage } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { HiOutlineHand } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import { motion } from "framer-motion";

const Index: NextPage = ({
  inviteUrl,
  serverUrl,
  topGuilds,
  totalGuilds,
}: {
  inviteUrl: string;
  serverUrl: string;
  topGuilds: DiscordGuild[];
  totalGuilds: number;
}) => {
  const { data: session } = useSession();
  const openDiscordWindow = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const desc = [
    {
      title: "Best Welcomer",
      description:
        "Our welcomer welcomes users via ready-to-use designs and customizable designs",
      icon: <HiOutlineHand />,
    },
    {
      title: "Anti-raid Protection",
      description:
        "Detect raid behavior and respond automatically at various levels",
      icon: <FaSkull />,
    },
    {
      title: "Auto Moderation",
      description:
        "TestBot's automod system detect bad users' behaviour and take actions on them",
      icon: <MdAddModerator />,
    },
    {
      title: "Multi Lingual",
      description: "TestBot support more than 13 languages!",
      icon: <FaLanguage />,
    },
    {
      title: "Leveling System",
      description:
        "TestBot's leveling system allows you to reward your users for their activity",
      icon: <FaLevelUpAlt />,
    },
    {
      title: "99.99% Uptime",
      description:
        "TestBot is hosted on a powerful server with a 99.99% uptime",
      icon: <BiTime />,
    },
  ];

  return (
    <PageWrapper
      t={useTranslation("header").t}
      isThereFooter={true}
      isTherePadding={false}
    >
      <div className="flex flex-col items-center justify-center pt-[25vh]">
        <h1 className="text-5xl font-bold text-white">
          {"Your server, Your rules, Your way."
            .split(/\b/)
            .map((part, index) => {
              const trimmedPart = part.trim(); // Retire les espaces en dÃ©but et fin de partie
              if (
                ["server", "rules", "way"].includes(trimmedPart.toLowerCase())
              ) {
                return (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
                  >
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </span>
                );
              } else {
                return part;
              }
            })}
        </h1>
        <p className="w-[50%] py-8 text-center text-xl text-gray-500">
          A versatile bot that is highly customizable for welcome image,
          detailed logs, social commands, moderation and much more...
        </p>
        <div className="flex justify-between py-8 [&>button]:mx-4">
          <button
            className="bg-size-200 bg-pos-0 hover:bg-pos-100 flex items-center justify-between rounded-xl bg-gradient-to-tl from-purple-800 via-purple-600 to-purple-400 px-5 py-3 text-base font-medium text-white transition-all duration-500"
            onClick={() => {
              openDiscordWindow(inviteUrl);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 inline-block h-8 w-8"
              viewBox="0 0 71 80"
              fill="none"
            >
              <path
                d="M60.1045 13.8978C55.5792 11.8214 50.7265 10.2916 45.6527 9.41542C45.5603 9.39851 45.468 9.44077 45.4204 9.52529C44.7963 10.6353 44.105 12.0834 43.6209 13.2216C38.1637 12.4046 32.7345 12.4046 27.3892 13.2216C26.905 12.0581 26.1886 10.6353 25.5617 9.52529C25.5141 9.44359 25.4218 9.40133 25.3294 9.41542C20.2584 10.2888 15.4057 11.8186 10.8776 13.8978C10.8384 13.9147 10.8048 13.9429 10.7825 13.9795C1.57795 27.7309 -0.943561 41.1443 0.293408 54.3914C0.299005 54.4562 0.335386 54.5182 0.385761 54.5576C6.45866 59.0174 12.3413 61.7249 18.1147 63.5195C18.2071 63.5477 18.305 63.5139 18.3638 63.4378C19.7295 61.5728 20.9469 59.6063 21.9907 57.5383C22.0523 57.4172 21.9935 57.2735 21.8676 57.2256C19.9366 56.4931 18.0979 55.6 16.3292 54.5858C16.1893 54.5041 16.1781 54.304 16.3068 54.2082C16.679 53.9293 17.0513 53.6391 17.4067 53.3461C17.471 53.2926 17.5606 53.2813 17.6362 53.3151C29.2558 58.6202 41.8354 58.6202 53.3179 53.3151C53.3935 53.2785 53.4831 53.2898 53.5502 53.3433C53.9057 53.6363 54.2779 53.9293 54.6529 54.2082C54.7816 54.304 54.7732 54.5041 54.6333 54.5858C52.8646 55.6197 51.0259 56.4931 49.0921 57.2228C48.9662 57.2707 48.9102 57.4172 48.9718 57.5383C50.038 59.6034 51.2554 61.5699 52.5959 63.435C52.6519 63.5139 52.7526 63.5477 52.845 63.5195C58.6464 61.7249 64.529 59.0174 70.6019 54.5576C70.6551 54.5182 70.6887 54.459 70.6943 54.3942C72.1747 39.0791 68.2147 25.7757 60.1968 13.9823C60.1772 13.9429 60.1437 13.9147 60.1045 13.8978ZM23.7259 46.3253C20.2276 46.3253 17.3451 43.1136 17.3451 39.1693C17.3451 35.225 20.1717 32.0133 23.7259 32.0133C27.308 32.0133 30.1626 35.2532 30.1066 39.1693C30.1066 43.1136 27.28 46.3253 23.7259 46.3253ZM47.3178 46.3253C43.8196 46.3253 40.9371 43.1136 40.9371 39.1693C40.9371 35.225 43.7636 32.0133 47.3178 32.0133C50.9 32.0133 53.7545 35.2532 53.6986 39.1693C53.6986 43.1136 50.9 46.3253 47.3178 46.3253Z"
                fill="currentColor"
              />
            </svg>
            <p>Add to Discord</p>
          </button>
          {!session ? (
            <button
              className="flex items-center justify-between rounded-xl border-4 border-gray-700 bg-transparent px-5 py-3 text-base font-medium text-gray-400 transition duration-200 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                signIn("discord");
              }}
            >
              <p>Login</p>
            </button>
          ) : (
            <button
              className="flex items-center justify-between rounded-xl border-4 border-gray-700 bg-transparent px-5 py-3 text-base font-medium text-gray-400 transition duration-200 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                openDiscordWindow(serverUrl);
              }}
            >
              <p>Join our Discord</p>
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-start pt-[15vh]">
        <p className="pb-10 text-3xl font-bold text-white">
          Trusted by more than
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {" "}
            {totalGuilds}{" "}
          </span>
          servers
        </p>
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[400px] before:bg-[linear-gradient(to_right,#0f0d18_0%,rgba(19,27,33,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[400px] after:-scale-x-100 after:bg-[linear-gradient(to_right,#0f0d18_0%,rgba(19,27,33,0)_100%)] after:content-['']">
          <div className="animate-infinite-slider flex w-[calc(500px*10)] gap-12">
            {topGuilds.map((guild, key) => (
              <motion.div
                className="flex h-full items-center gap-4"
                key={key}
                initial={{ y: 65, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: 65 }}
                transition={{ duration: 0.5, delay: 0.2 * key }}
              >
                {guild.icon ? (
                  <img
                    src={guild.icon}
                    className="block h-[48px] w-[48px] rounded"
                    alt="Anime Soul Discord"
                  />
                ) : (
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded bg-gray-700 text-white">
                    <p className="text-xl">
                      {guild.name?.charAt(0).toUpperCase()}
                    </p>
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-white">{guild.name}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {guild.memberCount} Members
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-[70vh] items-center pb-[10vh] pt-[20vh]">
        <motion.div
          className="flex h-full w-1/3 flex-col items-start justify-evenly px-20 pb-40"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-3xl font-semibold text-white">
            Why Test bot <span className="font-bold text-purple-500">?</span>
          </h2>
          <p className="text-xl text-gray-500">
            Test bot is a bot that allows you to test your bot before deploying
            it on your server
          </p>
        </motion.div>
        <div className="grid w-2/3 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {desc.map((d, key) => (
            <motion.div
              className=" hover:!scale-105 flex max-w-sm cursor-context-menu items-center gap-4 space-x-6 rounded-md bg-transparent p-6 shadow-2xl transition-all duration-200"
              key={key}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1 + 0.3 * key }}
            >
              <div className="text-3xl text-purple-400">{d.icon}</div>
              <div>
                <h3 className="pb-4 text-xl font-semibold text-white">
                  {d.title}
                </h3>
                <p className="text-gray-500">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const originalTopGuilds = await getTopGuilds();

  // Vérifier si originalTopGuilds est null avant de le déstructurer
  const topGuildsData = originalTopGuilds ? originalTopGuilds.guilds : [];

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["home", "header"])),
      inviteUrl: buildInviteUrl(null),
      serverUrl: env.DISCORD_INVITE_URL,
      topGuilds: Array.from({ length: 20 }, (_, index) => ({
        ...topGuildsData[index % topGuildsData.length],
      })),
      totalGuilds: originalTopGuilds ? originalTopGuilds.totalGuilds : 0,
    },
  };
};

export default Index;