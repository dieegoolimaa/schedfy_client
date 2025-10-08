import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import type { User } from "@/interfaces/user.interface";
import professional from "@/mock-data/professional";
import {
    Calendar,
    BarChart2,
    Ticket,
    Gift,
    Users,
    PlusCircle,
    LayoutDashboard,
} from "lucide-react";

interface HeaderProps {
    user: User;
}

export function Header({ user }: HeaderProps) {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        toast("Logout realizado com sucesso!");
        navigate("/");
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsSheetOpen(false);
    };

    // Encontrar o profissional correspondente ao usuário logado
    const currentProfessional = professional.find(prof => prof.email === user.username);

    // Gerar iniciais do nome para fallback
    const getInitials = (name: string) => {
        if (currentProfessional) {
            return currentProfessional.name
                .split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return name
            .split("@")[0] // Para emails, usar parte antes do @
            .split(".")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Menu items baseado no role
    const getMenuItems = () => {
        if (user.role === "admin") {
            return [
                { label: "Agendamentos", path: "/admin/appointments", icon: <Calendar className="mr-2 h-4 w-4" /> },
                { label: "Análises", path: "/admin/analytics", icon: <BarChart2 className="mr-2 h-4 w-4" /> },
                { label: "Promoções", path: "/admin/promotions", icon: <Ticket className="mr-2 h-4 w-4" /> },
                { label: "Vouchers", path: "/admin/vouchers", icon: <Gift className="mr-2 h-4 w-4" /> },
                { label: "Profissionais", path: "/professionals", icon: <Users className="mr-2 h-4 w-4" /> },
                { label: "Agendar", path: "/book-appointment", icon: <PlusCircle className="mr-2 h-4 w-4" /> },
            ];
        } else if (user.role === "professional") {
            // Para profissionais, usar o ID do profissional, não do usuário
            const professionalId = currentProfessional?.id || user.id;
            return [
                { label: "Dashboard", path: "/professional/dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
                { label: "Agendamentos", path: `/appointments/${professionalId}`, icon: <Calendar className="mr-2 h-4 w-4" /> },
                { label: "Agendar", path: "/book-appointment", icon: <PlusCircle className="mr-2 h-4 w-4" /> },
            ];
        } else {
            return [
                { label: "Agendar", path: "/book-appointment", icon: <PlusCircle className="mr-2 h-4 w-4" /> },
            ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <header className="fixed top-0 left-0 right-0 bg-card/80 dark:bg-card/80 border-b border-border backdrop-blur-lg z-50 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Avatar e info do usuário */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Avatar className="size-8 sm:size-10 shrink-0">
                        <AvatarImage
                            src={currentProfessional?.photo}
                            alt={currentProfessional?.name || user.username}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                            {getInitials(user.username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden xs:block min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {currentProfessional?.name || user.username}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize truncate">
                            {currentProfessional?.specialty || user.role}
                        </p>
                    </div>
                </div>

                {/* Desktop Navigation - Hidden on mobile */}
                <div className="hidden lg:flex items-center gap-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.path}
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(item.path)}
                            className="text-xs whitespace-nowrap"
                        >
                            {item.label}
                        </Button>
                    ))}
                    <ThemeToggle 
                        variant="ghost" 
                        size="sm"
                        showLabel={false}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="text-xs"
                    >
                        Sair
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Quick action button for mobile */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/book-appointment")}
                        className="text-xs px-2 py-1"
                    >
                        Agendar
                    </Button>
                    
                    {/* Mobile menu */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                                <svg 
                                    className="h-4 w-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M4 6h16M4 12h16M4 18h16" 
                                    />
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 sm:w-80 flex flex-col p-0">
                            <SheetHeader className="p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-10">
                                        <AvatarImage
                                            src={currentProfessional?.photo}
                                            alt={currentProfessional?.name || user.username}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <SheetTitle className="text-sm font-medium text-foreground truncate">
                                            {currentProfessional?.name || user.username}
                                        </SheetTitle>
                                        <SheetDescription className="text-xs text-muted-foreground capitalize">
                                            {currentProfessional?.specialty || user.role}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>
                            
                            <div className="flex-1 p-4">
                                <nav className="space-y-2">
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            variant="ghost"
                                            onClick={() => handleNavigation(item.path)}
                                            className="w-full justify-start text-left"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-4 border-t space-y-2">
                                <ThemeToggle 
                                    variant="ghost" 
                                    size="default"
                                    showLabel={true}
                                    className="w-full"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    Sair
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}