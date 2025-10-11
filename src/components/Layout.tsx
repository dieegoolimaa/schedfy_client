import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {user && <Header user={user} />}
      <main className={user ? "pt-20" : ""}>{children}</main>
    </div>
  );
}
