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
    <nav className="flex items-center justify-center gap-4 mt-8 text-slate-700">
      {/* Previous */}
      <Link
        href={getPageLink(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl 
          border border-slate-200 bg-white shadow-sm transition-all duration-200 
          ${isFirst ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 text-slate-800'}`}
        aria-disabled={isFirst}
      >
        <HiArrowSmLeft className="text-xl" />
      </Link>

      {/* Page indicator */}
      <div className="px-5 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white shadow-sm">
        <span className="font-bold text-slate-800">{currentPage}</span> 
        <span className="text-slate-400 mx-1">/</span> 
        <span className="font-bold text-slate-800">{totalPages}</span>
      </div>

      {/* Next */}
      <Link
        href={getPageLink(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl 
          border border-slate-200 bg-white shadow-sm transition-all duration-200 
          ${isLast ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 text-slate-800'}`}
        aria-disabled={isLast}
      >
        <HiArrowSmRight className="text-xl" />
      </Link>
    </nav>
  );
}
