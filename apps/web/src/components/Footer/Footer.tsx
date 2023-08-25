import React from "react";

function Footer() {
  return (
    <div className="w-full bg-[url('https://cdn.discordapp.com/attachments/1135971514626351215/1143271526586650737/vague.png')] bg-cover bg-center bg-no-repeat pt-[30vh]">
      <div className="flex flex-row items-center justify-center py-6 [&>div]:px-8">
        <div>
          <span className="text-md text-white">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div>
          {["Contact", "Terms Of Use", "Privacy Policy", "Refund Policy"].map(
            (c, i) => (
              <a
                key={i}
                href={
                  i === 0
                    ? "mailto:help@testbot.com"
                    : `/policy/${c.split(" ")[0].toLowerCase()}`
                }
                className="text-md text-white transition-all duration-200 hover:text-gray-300"
              >
                {i > 0 && " - "}
                {c}
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Footer;
