import React from "react";

const GuildSearch = ({ setSearch }) => {
  return (
    <input
      type="text"
      className="mt-1 rounded-lg bg-[#16131d] px-4 py-2 text-white placeholder-gray-500 outline-none focus:border-transparent focus:placeholder-purple-500 focus:ring-2 focus:ring-purple-600"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default GuildSearch;
