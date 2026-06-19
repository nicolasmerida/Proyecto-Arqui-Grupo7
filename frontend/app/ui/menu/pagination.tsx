// app/ui/menu/pagination.tsx
'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { HiArrowSmLeft, HiArrowSmRight } from 'react-icons/hi';

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
    <nav className="flex items-center justify-center gap-4 mt-8">
      {/* Previous */}
      <Link
        href={getPageLink(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl 
          border border-amber-300 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 text-amber-600
          ${isFirst ? 'opacity-40 pointer-events-none' : 'hover:bg-amber-50 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'}`}
        aria-disabled={isFirst}
      >
        <HiArrowSmLeft className="text-xl" />
      </Link>

      {/* Page indicator */}
      <div className="px-5 py-2 text-sm font-medium border border-amber-300 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm">
        <span className="font-bold text-slate-800">{currentPage}</span> 
        <span className="text-amber-500 mx-1">/</span> 
        <span className="font-bold text-slate-800">{totalPages}</span>
      </div>

      {/* Next */}
      <Link
        href={getPageLink(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl 
          border border-amber-300 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 text-amber-600
          ${isLast ? 'opacity-40 pointer-events-none' : 'hover:bg-amber-50 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'}`}
        aria-disabled={isLast}
      >
        <HiArrowSmRight className="text-xl" />
      </Link>
    </nav>
  );
}