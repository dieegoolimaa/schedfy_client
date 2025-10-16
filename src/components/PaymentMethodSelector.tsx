import React, { useState, useEffect } from "react";
import {
  usePaymentMethods,
  useFormatters,
  useLocalization,
} from "../hooks/useLocalization";
import type { PaymentMethodConfig } from "../services/localizationService";

interface PaymentMethodSelectorProps {
  amount: number;
  onPaymentMethodChange: (methodId: string, feeCalculation: any) => void;
  selectedMethodId?: string;
  className?: string;
  showFees?: boolean;
  showProcessingTime?: boolean;
  groupByType?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  onPaymentMethodChange,
  selectedMethodId,
  className = "",
  showFees = true,
  showProcessingTime = true,
  groupByType = false,
}) => {
  const { isPortugal, isBrazil } = useLocalization();
  const { paymentMethods, isLoadingMethods, calculatePaymentFee } =
    usePaymentMethods();
  const { formatCurrencySync } = useFormatters();
  const [feeCalculations, setFeeCalculations] = useState<Record<string, any>>(
    {}
  );

  // Calcular taxas para todos os métodos
  useEffect(() => {
    if (paymentMethods.length > 0 && amount > 0) {
      calculateFeesForAllMethods();
    }
  }, [paymentMethods, amount]);

  const calculateFeesForAllMethods = async () => {
    const calculations: Record<string, any> = {};

    for (const method of paymentMethods) {
      try {
        const feeCalc = await calculatePaymentFee(amount, method.id);
        calculations[method.id] = feeCalc;
      } catch (error) {
        console.error(`Erro ao calcular taxa para ${method.id}:`, error);
      }
    }

    setFeeCalculations(calculations);
  };

  const handleMethodSelect = (methodId: string) => {
    const feeCalc = feeCalculations[methodId];
    onPaymentMethodChange(methodId, feeCalc);
  };

  const getMethodsByType = () => {
    const grouped = paymentMethods.reduce((acc, method) => {
      if (!acc[method.type]) {
        acc[method.type] = [];
      }
      acc[method.type].push(method);
      return acc;
    }, {} as Record<string, PaymentMethodConfig[]>);

    return grouped;
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      digital_wallet: isPortugal() ? "Carteira Digital" : "Carteira Digital",
      card: "Cartões",
      bank_transfer: "Transferência",
      cash: "Dinheiro",
    };
    return labels[type] || type;
  };

  const getMethodIcon = (method: PaymentMethodConfig): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      pix: <span className="text-2xl">🔄</span>,
      mb_way: <span className="text-2xl">📱</span>,
      multibanco: <span className="text-2xl">🏛️</span>,
      credit_card: <span className="text-2xl">💳</span>,
      debit_card: <span className="text-2xl">💳</span>,
      boleto: <span className="text-2xl">📄</span>,
      bank_transfer: <span className="text-2xl">🏦</span>,
      cash: <span className="text-2xl">💵</span>,
    };

    return icons[method.id] || <span className="text-2xl">💳</span>;
  };

  const getMethodBadge = (
    method: PaymentMethodConfig
  ): React.ReactNode | null => {
    if (method.processingTime.includes("Instantâneo")) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ⚡ Instantâneo
        </span>
      );
    }

    if (method.id === "pix" || method.id === "mb_way") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          🌟 Recomendado
        </span>
      );
    }

    return null;
  };

  const renderPaymentMethod = (method: PaymentMethodConfig) => {
    const feeCalc = feeCalculations[method.id];
    const isSelected = selectedMethodId === method.id;

    return (
      <div
        key={method.id}
        className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }
                    ${className}
                `}
        onClick={() => handleMethodSelect(method.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">{getMethodIcon(method)}</div>
            <div className="flex-grow">
              <div className="font-medium text-gray-900">{method.name}</div>
              {method.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {method.description}
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                {getMethodBadge(method)}
                {showProcessingTime && (
                  <span className="text-xs text-gray-500">
                    {method.processingTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {showFees && feeCalc && (
            <div className="text-right text-sm">
              {feeCalc.feeAmount > 0 ? (
                <div className="text-gray-600">
                  <div>Taxa: {formatCurrencySync(feeCalc.feeAmount)}</div>
                  <div className="font-medium">
                    Total: {formatCurrencySync(feeCalc.totalAmount)}
                  </div>
                </div>
              ) : (
                <div className="text-green-600 font-medium">Sem taxa</div>
              )}
            </div>
          )}
        </div>

        {/* Indicador de seleção */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingMethods) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <div className="text-2xl mb-2">💳</div>
        <div>Nenhum método de pagamento disponível</div>
      </div>
    );
  }

  // Renderização agrupada por tipo
  if (groupByType) {
    const groupedMethods = getMethodsByType();

    return (
      <div className="space-y-6">
        {Object.entries(groupedMethods).map(([type, methods]) => (
          <div key={type}>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {getTypeLabel(type)}
            </h3>
            <div className="space-y-3">{methods.map(renderPaymentMethod)}</div>
          </div>
        ))}
      </div>
    );
  }

  // Renderização simples
  return (
    <div className="space-y-3">{paymentMethods.map(renderPaymentMethod)}</div>
  );
};

// Componente para resumo de pagamento
interface PaymentSummaryProps {
  amount: number;
  paymentMethodId?: string;
  className?: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  paymentMethodId,
  className = "",
}) => {
  const { calculatePaymentFee, calculateTax } = useLocalization();
  const { formatCurrencySync, config } = useFormatters();
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (amount > 0 && paymentMethodId) {
      calculateSummary();
    }
  }, [amount, paymentMethodId]);

  const calculateSummary = async () => {
    if (!paymentMethodId) return;

    setIsLoading(true);
    try {
      const [feeCalc, taxCalc] = await Promise.all([
        calculatePaymentFee(amount, paymentMethodId),
        calculateTax(amount),
      ]);

      const finalTotal =
        feeCalc.totalAmount + (taxCalc.taxIncluded ? 0 : taxCalc.taxAmount);

      setSummary({
        subtotal: amount,
        fee: feeCalc.feeAmount,
        tax: taxCalc.taxAmount,
        total: finalTotal,
        taxIncluded: taxCalc.taxIncluded,
      });
    } catch (error) {
      console.error("Erro ao calcular resumo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !summary || !config) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrencySync(summary.subtotal)}</span>
        </div>

        {summary.fee > 0 && (
          <div className="flex justify-between text-sm text-orange-600">
            <span>Taxa de processamento:</span>
            <span>{formatCurrencySync(summary.fee)}</span>
          </div>
        )}

        {summary.tax > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {config.taxConfig.taxName} ({config.taxConfig.vatRate}%)
              {summary.taxIncluded && " (incluído)"}:
            </span>
            <span>
              {summary.taxIncluded ? "---" : formatCurrencySync(summary.tax)}
            </span>
          </div>
        )}

        <hr className="border-gray-300" />

        <div className="flex justify-between font-medium text-lg">
          <span>Total:</span>
          <span>{formatCurrencySync(summary.total)}</span>
        </div>
      </div>
    </div>
  );
};
