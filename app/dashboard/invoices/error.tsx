// error.tsx는 client컴포넌트이어야 합니다.
// 이 error.tsx가 받는 두 props, error와 reset은 각각을 의미합니다.
// error: 이 객체는 JS의 Native Error 객체이다.
// reset: 이 함수는 에러가 발생했을때, 다시 시도할 수 있게끔 해주는 함수이다.
// 이 컴포넌트는 예상하 못한 에러가 발생하였을때 유용하다.
'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}