"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { DatePicker, DateRangePicker, MonthYearPicker } from "@/components/ui/date-picker"
import type { DateRange } from "react-day-picker"

const CalendarTestPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [monthYear, setMonthYear] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Teste dos Componentes de Calendário
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comparação entre o calendário tradicional e os date pickers compactos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendário Tradicional */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Calendário Tradicional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Calendário sempre visível - ocupa mais espaço mas permite navegação direta
              </p>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
              <div className="text-sm text-gray-600">
                Data selecionada: {date?.toLocaleDateString('pt-BR') || 'Nenhuma'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Pickers Compactos */}
        <Card>
          <CardHeader>
            <CardTitle>🗓️ Date Pickers Compactos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Date Picker Simples</h3>
                <DatePicker
                  date={date}
                  onDateChange={setDate}
                  placeholder="Selecione uma data"
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Date Range Picker</h3>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder="Selecione um período"
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Month & Year Picker</h3>
                <MonthYearPicker
                  date={monthYear}
                  onDateChange={setMonthYear}
                  placeholder="Selecione mês e ano"
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  ✅ Vantagens dos Date Pickers:
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• 90% menos espaço ocupado</li>
                  <li>• Interface só aparece quando necessário</li>
                  <li>• Formato brasileiro nativo</li>
                  <li>• Melhor para mobile</li>
                  <li>• Navegação mais rápida</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demonstração de Cards Compactos */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Demonstração de Cards Compactos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card Compacto de Estatística */}
          <Card className="p-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Agendamentos Hoje</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</span>
              <span className="text-xs text-green-600 mt-1">+3 desde ontem</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Receita do Dia</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">R$ 850</span>
              <span className="text-xs text-blue-600 mt-1">Meta: R$ 1.000</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Clientes Atendidos</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</span>
              <span className="text-xs text-purple-600 mt-1">67% da meta</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avaliação Média</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">4.8</span>
              <span className="text-xs text-yellow-600 mt-1">⭐⭐⭐⭐⭐</span>
            </div>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Design Compacto Aplicado:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <code>p-4</code> - Padding consistente</li>
            <li>• <code>text-xs</code> - Typography otimizada</li>
            <li>• Grid responsivo para diferentes telas</li>
            <li>• Espaçamento entre elementos bem definido</li>
            <li>• Cores semânticas para diferentes métricas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CalendarTestPage