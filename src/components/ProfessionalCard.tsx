import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, Building2, Calendar, BarChart2 } from "lucide-react";
import type { Profissional } from "@/interfaces/professional.interface";

interface ProfessionalCardProps {
    professional: Profissional;
    onViewSchedule?: () => void;
    onContact?: () => void;
    onViewAnalytics?: () => void;
}

export function ProfessionalCard({
    professional,
    onViewSchedule,
    onContact,
    onViewAnalytics,
}: ProfessionalCardProps) {
    // Gerar iniciais do nome para fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 border">
            <CardHeader className="pb-3">
                <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="w-16 h-16">
                        <AvatarImage
                            src={professional.photo}
                            alt={professional.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                            {getInitials(professional.name)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-medium">
                            {professional.name}
                        </CardTitle>
                        <Badge variant="secondary">
                            {professional.specialty}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{professional.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{professional.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate">{professional.commerce}</span>
                    </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                    <Button 
                        className="w-full"
                        onClick={onViewSchedule}
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Ver Agenda
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={onViewAnalytics}
                    >
                        <BarChart2 className="w-4 h-4 mr-2" />
                        Ver Análises
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={onContact}
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Contatar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}