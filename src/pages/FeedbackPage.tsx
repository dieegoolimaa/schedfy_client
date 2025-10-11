import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type {
  AppointmentFeedback,
  FeedbackStats,
} from "@/interfaces/feedback.interface";

/**
 * Feedback Management Page
 * Shows all customer feedback/ratings for appointments
 * Available for all 3 plan types
 */
const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<AppointmentFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">(
    "all"
  );
  const [replyDialog, setReplyDialog] = useState<{
    open: boolean;
    feedback: AppointmentFeedback | null;
  }>({
    open: false,
    feedback: null,
  });
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const stored = localStorage.getItem("mock_feedbacks");
    if (stored) {
      const data = JSON.parse(stored);
      setFeedbacks(data);
      calculateStats(data);
    } else {
      // Initialize with empty data
      setFeedbacks([]);
      calculateStats([]);
    }
  };

  const calculateStats = (data: AppointmentFeedback[]) => {
    if (data.length === 0) {
      setStats({
        totalFeedbacks: 0,
        averageRating: 0,
        ratingBreakdown: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
        recommendationRate: 0,
        trend: "stable",
      });
      return;
    }

    const breakdown = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    let totalRating = 0;
    let recommendCount = 0;

    data.forEach((fb) => {
      totalRating += fb.overallRating;
      breakdown[fb.overallRating.toString() as keyof typeof breakdown]++;
      if (fb.wouldRecommend) recommendCount++;
    });

    setStats({
      totalFeedbacks: data.length,
      averageRating: totalRating / data.length,
      ratingBreakdown: breakdown,
      recommendationRate: (recommendCount / data.length) * 100,
      trend: "stable",
    });
  };

  const handleReply = (feedback: AppointmentFeedback) => {
    setReplyDialog({ open: true, feedback });
    setReplyMessage("");
  };

  const submitReply = () => {
    if (!replyDialog.feedback || !replyMessage.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }

    const updated = feedbacks.map((fb) =>
      fb.id === replyDialog.feedback!.id
        ? {
            ...fb,
            status: "replied" as const,
            reply: {
              message: replyMessage,
              repliedBy: "current_user",
              repliedAt: new Date().toISOString(),
            },
          }
        : fb
    );

    setFeedbacks(updated);
    localStorage.setItem("mock_feedbacks", JSON.stringify(updated));
    toast.success("Resposta enviada com sucesso!");
    setReplyDialog({ open: false, feedback: null });
  };

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((fb) => fb.overallRating === parseInt(filter));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">
            Avaliações dos Clientes
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Visualize o feedback e avaliações dos seus atendimentos
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Média Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  Baseado em {stats.totalFeedbacks} avaliações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Recomendação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {stats.recommendationRate.toFixed(0)}%
                  </span>
                  <ThumbsUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  dos clientes recomendam
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  5 Estrelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {stats.ratingBreakdown["5"]}
                  </span>
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  avaliações perfeitas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tendência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {stats.trend === "up" ? (
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  ) : stats.trend === "down" ? (
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  ) : (
                    <span className="text-2xl">→</span>
                  )}
                  <span className="text-sm font-medium">Estável</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            Todas ({feedbacks.length})
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filter === rating.toString() ? "default" : "outline"}
              onClick={() => setFilter(rating.toString() as any)}
              size="sm"
            >
              {rating} ⭐ (
              {feedbacks.filter((fb) => fb.overallRating === rating).length})
            </Button>
          ))}
        </div>

        {/* Feedbacks List */}
        {filteredFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50 text-[var(--color-muted-foreground)]" />
              <p className="text-[var(--color-muted-foreground)]">
                Nenhuma avaliação encontrada.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {feedback.customerName}
                      </CardTitle>
                      <CardDescription>
                        {new Date(feedback.submittedAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {renderStars(feedback.overallRating)}
                      <Badge
                        variant={
                          feedback.wouldRecommend ? "default" : "secondary"
                        }
                      >
                        {feedback.wouldRecommend
                          ? "Recomenda"
                          : "Não recomenda"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Rating */}
                  {feedback.professionalRating && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          Profissional:
                        </span>
                        {renderStars(feedback.professionalRating)}
                      </div>
                      {feedback.professionalComment && (
                        <p className="text-sm text-[var(--color-muted-foreground)] pl-4">
                          "{feedback.professionalComment}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Business Rating */}
                  {feedback.businessRating && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          Estabelecimento:
                        </span>
                        {renderStars(feedback.businessRating)}
                      </div>
                      {feedback.businessComment && (
                        <p className="text-sm text-[var(--color-muted-foreground)] pl-4">
                          "{feedback.businessComment}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Overall Comment */}
                  {feedback.overallComment && (
                    <div>
                      <span className="text-sm font-semibold">
                        Comentário Geral:
                      </span>
                      <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        "{feedback.overallComment}"
                      </p>
                    </div>
                  )}

                  {/* Reply Section */}
                  {feedback.reply ? (
                    <div className="border-t pt-4">
                      <span className="text-sm font-semibold text-blue-600">
                        Sua resposta:
                      </span>
                      <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        {feedback.reply.message}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                        Respondido em{" "}
                        {new Date(feedback.reply.repliedAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReply(feedback)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reply Dialog */}
        <Dialog
          open={replyDialog.open}
          onOpenChange={(open) => setReplyDialog({ open, feedback: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Responder Avaliação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reply">Sua Resposta</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Agradecemos seu feedback..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReplyDialog({ open: false, feedback: null })}
              >
                Cancelar
              </Button>
              <Button onClick={submitReply}>Enviar Resposta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default FeedbackPage;
