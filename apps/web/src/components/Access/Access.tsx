import React, { useState } from "react";
import { AccessControlProps, GuildRole } from "../../../../../@types";

const AccessControl: React.FC<AccessControlProps> = ({
  t,
  roles,
  newGuildData,
  setnewGuildData,
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
  };

  const handleRoleSelected = (selectedRole: GuildRole) => {
    toggle();

    const roleAlreadySelected = newGuildData?.adminRoles.find(
      (role) => role === selectedRole.id,
    );

    setnewGuildData({
      ...newGuildData,
      adminRoles: roleAlreadySelected ? newGuildData?.adminRoles : [...newGuildData?.adminRoles, selectedRole.id],
    });
  };

  return (
    <div className="w-full rounded px-4 py-4">
      {/* Menu where you can select roles */}
      <div className="flex flex-col">
        <h1 className="text-xl text-gray-300">{t("adminRoles")}</h1>
        <p className="text-md text-gray-500">{t("adminRolesDesc")}</p>
        <div className="flex flex-wrap py-4">
          <div className="relative w-[30rem]">
            <button
              onClick={toggle}
              className={`flex w-full items-center justify-between rounded bg-[#1a1825] p-2 ring-1 ${
                open ? "ring-[#2c293f]" : "ring-[#1a1825]"
              }`}
            >
              <span>
                {newGuildData?.adminRoles ? (
                  newGuildData.adminRoles.map((role) => {
                    const roleInGuild = roles.find(
                      (guildRole) => guildRole.id === role,
                    );
                    return (
                      roleInGuild && (
                        <span
                          key={roleInGuild.id}
                          className="mx-1 rounded bg-[#2c293f] px-2 py-1 text-white"
                          style={{
                            color: roleInGuild?.color
                              ? `#${roleInGuild.color.toString(16)}`
                              : "",
                          }}
                        >
                          {roleInGuild?.name}
                        </span>
                      )
                    );
                  })
                ) : (
                  <span className="text-gray-400">No role selected</span>
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
              {roles ? (
                roles.map((role) => {
                  return (
                    <li
                      className="cursor-pointer select-none p-2 hover:bg-[#2c293f]"
                      style={{
                        color: role.color
                          ? `#${role.color.toString(16)}`
                          : "white",
                      }}
                      onClick={() => handleRoleSelected(role)}
                      key={role.id}
                    >
                      {role.name}
                    </li>
                  );
                })
              ) : (
                <li
                  className="cursor-pointer select-none p-2 hover:bg-[#2c293f]"
                  key="no-roles"
                >
                  No roles
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
