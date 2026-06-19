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
    <nav className="flex items-center justify-center gap-4 mt-12 text-amber-500">
      {/* Previous */}
      <Link
        href={getPageLink(currentPage - 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
          border border-orange-400 bg-amber-600 shadow-md transition 
          ${isFirst ? 'opacity-30 pointer-events-none' : 'hover:bg-amber-400'}`}
        aria-disabled={isFirst}
      >
        <HiArrowSmLeft className="text-xl" />
      </Link>

      {/* Page indicator */}
      <div className="px-4 py-2 text-sm font-medium border border-orange-400 rounded-xl bg-amber-600 shadow-sm backdrop-blur-sm">
        <span className="font-semibold text-amber-400">{currentPage} / {totalPages}</span>
      </div>

      {/* Next */}
      <Link
        href={getPageLink(currentPage + 1)}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
          border border-orange-400 bg-amber-600 shadow-md transition 
          ${isLast ? 'opacity-30 pointer-events-none' : 'hover:bg-amber-400'}`}
        aria-disabled={isLast}
      >
        <HiArrowSmRight className="text-xl" />
      </Link>
    </nav>
  );
}