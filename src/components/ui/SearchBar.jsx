import { Search } from "lucide-react";

function SearchBar() {
  return (
    <section className="bg-white py-5 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="O que você procura hoje?" className="w-full h-14 rounded-full border border-gray-200 bg-gray-50 pl-14 pr-5 text-sm outline-none transition duration-300 focus:bg-white focus:border-black focus:shadow-lg" />
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
