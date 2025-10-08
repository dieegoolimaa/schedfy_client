"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker, DateRangePicker, MonthYearPicker } from "@/components/ui/date-picker"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"

const DatePickerShowcase = () => {
  const [singleDate, setSingleDate] = useState<Date | undefined>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [monthYear, setMonthYear] = useState<Date | undefined>()
  const [calendarDate, setCalendarDate] = useState<Date | undefined>()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Componentes de Seleção de Data
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Experimente as diferentes opções do Shadcn UI para seleção de datas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Picker Simples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Date Picker Simples
              <Badge variant="secondary">Recomendado</Badge>
            </CardTitle>
            <CardDescription>
              Interface limpa com popover para seleção de uma única data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DatePicker
              date={singleDate}
              onDateChange={setSingleDate}
              placeholder="Selecione uma data"
            />
            {singleDate && (
              <p className="text-sm text-muted-foreground">
                Data selecionada: {singleDate.toLocaleDateString('pt-BR')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Date Range Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Date Range Picker
              <Badge variant="outline">Período</Badge>
            </CardTitle>
            <CardDescription>
              Ideal para selecionar um período de datas (início e fim)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Selecione um período"
            />
            {dateRange?.from && (
              <p className="text-sm text-muted-foreground">
                Período: {dateRange.from.toLocaleDateString('pt-BR')}
                {dateRange.to && ` até ${dateRange.to.toLocaleDateString('pt-BR')}`}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Month Year Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Month Year Picker
              <Badge variant="outline">Mês/Ano</Badge>
            </CardTitle>
            <CardDescription>
              Para seleção de mês e ano com dropdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MonthYearPicker
              date={monthYear}
              onDateChange={setMonthYear}
              placeholder="Selecione mês e ano"
            />
            {monthYear && (
              <p className="text-sm text-muted-foreground">
                Selecionado: {monthYear.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Calendar Tradicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Calendar Tradicional
              <Badge variant="destructive">Antigo</Badge>
            </CardTitle>
            <CardDescription>
              Interface antiga que ocupava muito espaço na tela
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md border"
            />
            {calendarDate && (
              <p className="text-sm text-muted-foreground">
                Data selecionada: {calendarDate.toLocaleDateString('pt-BR')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparação */}
      <Card>
        <CardHeader>
          <CardTitle>Vantagens dos Novos Date Pickers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ Date Picker (Novo)</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Interface compacta</li>
                <li>• Abre em popover quando necessário</li>
                <li>• Mostra valor selecionado como texto</li>
                <li>• Formato brasileiro (dd/mm/yyyy)</li>
                <li>• Placeholder customizável</li>
                <li>• Melhor UX em mobile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ Calendar (Antigo)</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sempre visível (ocupa espaço)</li>
                <li>• Interface confusa em telas pequenas</li>
                <li>• Difícil navegação de mês/ano</li>
                <li>• Layout não responsivo</li>
                <li>• Experiência ruim em mobile</li>
                <li>• Não mostra valor selecionado claramente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DatePickerShowcase