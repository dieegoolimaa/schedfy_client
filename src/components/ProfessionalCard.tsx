import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  BarChart2,
  Edit,
  Power,
} from "lucide-react";
import type { Profissional } from "@/interfaces/professional.interface";

interface ProfessionalCardProps {
  professional: Profissional;
  onViewSchedule?: () => void;
  onContact?: () => void;
  onViewAnalytics?: () => void;
  onEdit?: () => void;
  onToggleActive?: () => void;
}

export function ProfessionalCard({
  professional,
  onViewSchedule,
  onContact,
  onViewAnalytics,
  onEdit,
  onToggleActive,
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

  const isActive = professional.isActive !== false; // Default to true if undefined

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 border">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
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
            {/* Status indicator */}
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-lg font-medium">
              {professional.name}
            </CardTitle>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <Badge variant="secondary">{professional.specialty}</Badge>
              <Badge variant={isActive ? "default" : "outline"}>
                {isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
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
          {/* Management buttons */}
          {(onEdit || onToggleActive) && (
            <div className="flex gap-2 mb-3">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
              {onToggleActive && (
                <Button
                  variant={isActive ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={onToggleActive}
                >
                  <Power className="w-4 h-4 mr-2" />
                  {isActive ? "Desativar" : "Ativar"}
                </Button>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={onViewSchedule}
            disabled={!isActive}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Ver Agenda
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onViewAnalytics}
            disabled={!isActive}
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Ver Análises
          </Button>
          <Button variant="outline" className="w-full" onClick={onContact}>
            <Mail className="w-4 h-4 mr-2" />
            Contatar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
