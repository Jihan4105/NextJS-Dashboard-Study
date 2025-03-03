// loading.tsx는 Nextjs의 내장 컴포넌트로 사용자가 페이지를 이동할 때 로딩 화면을 보여주는 컴포넌트입니다.
// 여기서는 DashboardSkeleton 컴포넌트를 사용하여 로딩 화면을 구성합니다.
// loading.tsx는 내부적으로 React Suspense를 사용하는데, 이는 React에 내장된 기능으로 준비되지 않은 컴포넌트가 있을때 로딩화면을 보여주고 로딩이 완료되면 해당 컴포넌트를 보여주는 기능입니다.

// Nextjs에서는 방대한 량의 데이터가 전부 준비되기까지 걸리는 시간에 전체 페이지가 blocking되는 것을 방지하기 위해 streaming, 이라는 개념을 적용하기를 추천합니다.

// streaming 이라 함은 페이지에 표시되는 경로들(컴포넌트)을 "chunk"라는 작은 단위로 나누어서 각각이 준비가 되면 개별적으로 렌더링하는 데이터 전송 기술입니다.

// loading.tsx는 상속되기 때문에, /dashboard/customers 경로나 /dashboard/invoices 경로로 이동할때 또한 보여집니다.

import DashboardSkeleton from "@/app/ui/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}