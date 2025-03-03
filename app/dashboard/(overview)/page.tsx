import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
 
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 현재 Dashboard에서 RevenueChart는 3초의 Timeout을 가지고 있다. 그렇기에 다른 요소들 보다
        느리게 렌더링 되는데 이때 Suspense를 추가로 이용해서 적용해주면 다른요소는 먼저보이고, Revnue CHar는
        RevenuChartSkeleton이 보여져서 3초가 지난뒤에 redering 되게 할 수 있다. 
        
        만약 이 작업이 없다면 RevenueChart의 3초 Data fetching이 끝날때까지 dashboard 의 모든 요소가 skeleton으로 보인다.*/}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}