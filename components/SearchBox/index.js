import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SearchBox({ className }) {
  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  return (
    <>
      <div
        className={`w-full h-full flex items-center  border border-qgray-border bg-white ${
          className || ''
        }`}
      >
        <div className="flex-1 bg-red-500 h-full">
          <form onSubmit={submitHandler} className="h-full">
            <input
              type="text"
              className="search-input"
              placeholder="Search Product..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
        <button
          className="search-btn w-[40px] h-full text-sm font-600"
          type="button"
        >
          <SearchIcon className="h-5 w-5"></SearchIcon>
        </button>
      </div>
    </>
  );
}
