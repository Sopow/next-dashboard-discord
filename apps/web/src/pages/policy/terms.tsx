import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { FaHashtag } from "react-icons/fa";
import Footer from "~/src/components/Footer/Footer";
import Header from "~/src/components/Header/Header";
import PageWrapper from "~/src/components/PageWrapper/PageWrapper";

function Terms() {
  const termsOfUse = [
    {
      title: "Terms of Use",
      description:
        "Welcome to Test Bot! By using our bot and services, you agree to abide by the following terms and conditions. Please read them carefully before using our services.",
    },
    {
      title: "User Conduct",
      description:
        "You agree to use Test Bot responsibly and lawfully. You shall not use the bot for any malicious, harmful, or unlawful activities. We reserve the right to suspend or terminate your access if you violate these terms.",
    },
    {
      title: "Ownership",
      description:
        "All rights, title, and interest in and to Test Bot are and will remain the exclusive property of the Test Bot development team. You are not allowed to modify, distribute, or reverse engineer the bot.",
    },
    {
      title: "Limitation of Liability",
      description:
        "We strive to provide accurate and reliable services, but we do not guarantee error-free performance. We are not liable for any damages, direct or indirect, arising from the use or inability to use Test Bot.",
    },
    {
      title: "Changes To Terms",
      description:
        "We may update these Terms of Service from time to time. We will notify you of any changes by posting the new terms on our website or through Discord. Continued use of the bot after changes constitutes acceptance.",
    },
    {
      title: "Contact Us",
      description:
        "If you have any questions or concerns about our Terms of Service, you can contact us at help@testbot.com.",
    },
  ];

  return (
    <>
      <PageWrapper t={useTranslation("header").t} isThereFooter={true} isTherePadding={true} padding={20}>
        <div className="flex w-full max-w-[85%] flex-col items-start justify-center rounded-lg bg-[#171821] px-8 py-8 shadow-lg">
          {termsOfUse.map((text, i) => (
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
      ...(await serverSideTranslations(context.locale, ["terms", "header"])),
    },
  };
}

export default Terms;
