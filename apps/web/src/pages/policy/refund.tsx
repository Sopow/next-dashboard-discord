import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { FaHashtag } from "react-icons/fa";
import Footer from "~/src/components/Footer/Footer";
import Header from "~/src/components/Header/Header";
import PageWrapper from "~/src/components/PageWrapper/PageWrapper";

function Refund() {
    const refundPolicy = [
        {
          title: "Refund Policy",
          description:
            "Thank you for using Test Bot. Please read this refund policy carefully before making any purchase. By using our services, you agree to the terms outlined below.",
        },
        {
          title: "Refund Eligibility",
          description:
            "We offer refunds for purchases made through Test Bot only in specific cases, such as technical issues that prevent the bot from functioning as intended. Refunds are not provided for other reasons, including changes in preference or behavior.",
        },
        {
          title: "Refund Process",
          description:
            "To request a refund, please contact our support team at [support email] within [refund period] from the date of purchase. We will review your case and process refunds accordingly.",
        },
        {
          title: "No Guarantees",
          description:
            "While we strive to provide high-quality services, we do not guarantee specific outcomes or results from using Test Bot. Refunds will not be issued based on the perceived effectiveness of the bot's features.",
        },
        {
          title: "Changes To This Refund Policy",
          description:
            "We reserve the right to update this Refund Policy as necessary. Any changes will be effective immediately upon posting the updated policy on our website or through Discord.",
        },
        {
          title: "Contact Us",
          description:
            "If you have questions about our refund policy, you can reach out to us at [support email].",
        },
      ];
        
  return (
    <>
      <PageWrapper t={useTranslation("header").t} isThereFooter={true} isTherePadding={true} padding={20}>
        <div className="flex w-full max-w-[85%] flex-col items-start justify-center rounded-lg bg-[#171821] px-8 py-8 shadow-lg">
            {refundPolicy.map((text, i) => (
              <div key={i} className="flex flex-col items-start justify-center py-8 font-manrop">
                <div className="flex items-center justify-center gap-4">
                  <FaHashtag className="text-2xl text-gray-700 italic" />
                  <h1 className="text-2xl font-bold text-white">
                    {(i === 0 && text.title.toUpperCase()) || text.title}
                  </h1>
                </div>
                <p className="mt-4 text-gray-500 font-medium">{text.description}</p>
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
      ...(await serverSideTranslations(context.locale, ["refund", "header"])),
    },
  };
}

export default Refund;
