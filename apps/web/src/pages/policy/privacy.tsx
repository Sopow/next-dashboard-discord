import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { FaHashtag } from "react-icons/fa";
import Footer from "~/src/components/Footer/Footer";
import Header from "~/src/components/Header/Header";
import PageWrapper from "~/src/components/PageWrapper/PageWrapper";

function Privacy() {
  const privacyPolicy = [
    {
      title: "Privacy Policy",
      description:
        "Welcome to the Privacy Policy of Test Bot. This policy outlines how we collect, use, and protect your information. By using Test Bot, you consent to the practices described in this policy.",
    },
    {
      title: "Definitions",
      description:
        "In this Privacy Policy, the terms 'we', 'us', and 'our' refer to the Test Bot development team. 'User', 'you', and 'your' refer to the users of Test Bot.",
    },
    {
      title: "Information Collection And Use",
      description:
        "We collect and use personal information solely for the purpose of enhancing your experience with Test Bot. This information may include your Discord username, user ID, server activity, and interactions with the bot.",
    },
    {
      title: "Data Protection",
      description:
        "We take the security of your data seriously. We implement various security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.",
    },
    {
      title: "Cookies",
      description:
        "Test Bot does not use cookies to track your activity. However, third-party services integrated with Test Bot may use cookies for their own purposes. We recommend reviewing their respective privacy policies for more information.",
    },
    {
      title: "Information Sharing",
      description:
        "We do not sell, trade, or rent your personal information to third parties. Your data may be shared with third-party service providers to assist in bot functionality, but only to the extent necessary.",
    },
    {
      title: "Changes To This Privacy Policy",
      description:
        "We reserve the right to update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website or through Discord. It is recommended to review this policy periodically.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions or concerns about this Privacy Policy or the practices of Test Bot, you can contact us at help@testbot.com.",
    },
  ];
  return (
    <>
      <PageWrapper t={useTranslation("header").t} isThereFooter={true} isTherePadding={true} padding={20}>
        <div className="flex w-full max-w-[85%] flex-col items-start justify-center rounded-lg bg-[#171821] px-8 py-8 shadow-lg">
          {privacyPolicy.map((text, i) => (
            <div
              key={i}
              className="font-manrop flex flex-col items-start justify-center py-8"
            >
              <div className="flex items-center justify-center gap-4">
                <FaHashtag className="text-2xl italic text-gray-700" />
                <h1 className="text-2xl font-bold text-white">
                  {(i === 0 && text.title.toUpperCase()) || text.title}
                </h1>
              </div>
              <p className="mt-4 font-medium text-gray-500">
                {text.description}
              </p>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["privacy", "header"])),
    },
  };
}

export default Privacy;
