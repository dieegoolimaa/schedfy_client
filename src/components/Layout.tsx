import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import type { User } from "@/interfaces/user.interface";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedInUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {user && <Header user={user} />}
      <main className={user ? "pt-20" : ""}>
        {children}
      </main>
    </div>
  );
}