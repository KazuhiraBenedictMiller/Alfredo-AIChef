'use client';

import { useEffect, useState, useRef } from 'react';
import { useClerk } from '@clerk/nextjs';

type AuthCheckProps = {
  children: React.ReactNode;
};

const domain = '@sudents.opit.com, faculty.opit.com';

export default function AuthCheck({ children }: AuthCheckProps) {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth-check');
        if (!res.ok) {
          setModalMessage('You are not authorized to access this application.');
          // Delay sign out to give the user time to read the message
          timeoutRef.current = setTimeout(() => {
            signOut({ redirectUrl: '/' });
          }, 3000);
          return;
        }
        const data = await res.json();

        // If the user is deleted, sign them out
        if (data?.message === 'User deleted') {
          setModalMessage(`Your account has been deleted. Only Users with ${domain} email addresses are permitted. `);
          timeoutRef.current = setTimeout(() => {
            signOut({ redirectUrl: '/' });
          }, 3000);
          return;
        }


      } catch {
        setModalMessage('An error occurred while checking your account status.');
        timeoutRef.current = setTimeout(() => {
          signOut({ redirectUrl: '/' });
        }, 3000);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // Cleanup function to clear timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [signOut]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <span className="ml-3 text-white">Loading...</span>
      </div>
    );
  }

  return (
    <>
      {modalMessage && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-lg text-red-500">{modalMessage}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
      {!modalMessage && children}
    </>
  );
}
