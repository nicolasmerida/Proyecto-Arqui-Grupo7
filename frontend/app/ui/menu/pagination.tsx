'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  function getPageLink(page: number) {
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav className="flex items-center justify-center gap-4 mt-12 text-white">
      {/* Previous */}
      <Link
        href={getPageLink(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
          border border-white/30 bg-white/10 shadow-md transition 
          ${isFirst ? 'opacity-30 pointer-events-none' : 'hover:bg-white/20'}`}
        aria-disabled={isFirst}
      >
        {/*Flecha hacia atras => <IoIosArrowBack className="text-xl" />*/}
      </Link>

      {/* Page indicator */}
      <div className="px-4 py-2 text-sm font-medium border border-white/20 rounded-xl bg-white/10 shadow-sm backdrop-blur-sm">
        <span className="font-semibold">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
      </div>

      {/* Next */}
      <Link
        href={getPageLink(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
          border border-white/30 bg-white/10 shadow-md transition 
          ${isLast ? 'opacity-30 pointer-events-none' : 'hover:bg-white/20'}`}
        aria-disabled={isLast}
      >
        {/*Flecha hacia adelante => <IoIosArrowForward className="text-xl" />*/}
      </Link>
    </nav>
  );
}
