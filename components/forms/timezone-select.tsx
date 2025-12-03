"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const timezones = [
  { value: "UTC-12", label: "(UTC-12:00) International Date Line West" },
  { value: "UTC-11", label: "(UTC-11:00) Coordinated Universal Time-11" },
  { value: "UTC-10", label: "(UTC-10:00) Hawaii" },
  { value: "UTC-9", label: "(UTC-09:00) Alaska" },
  { value: "UTC-8", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "UTC-7", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "UTC-6", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "UTC-5", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "UTC-4", label: "(UTC-04:00) Atlantic Time (Canada)" },
  { value: "UTC-3", label: "(UTC-03:00) Brasilia, Buenos Aires" },
  { value: "UTC-2", label: "(UTC-02:00) Mid-Atlantic" },
  { value: "UTC-1", label: "(UTC-01:00) Azores" },
  { value: "UTC+0", label: "(UTC+00:00) London, Lisbon, Dublin" },
  { value: "UTC+1", label: "(UTC+01:00) Paris, Berlin, Rome" },
  { value: "UTC+2", label: "(UTC+02:00) Athens, Cairo, Jerusalem" },
  { value: "UTC+3", label: "(UTC+03:00) Moscow, Istanbul" },
  { value: "UTC+4", label: "(UTC+04:00) Dubai, Baku" },
  { value: "UTC+5", label: "(UTC+05:00) Islamabad, Karachi" },
  { value: "UTC+5:30", label: "(UTC+05:30) Mumbai, New Delhi" },
  { value: "UTC+6", label: "(UTC+06:00) Dhaka, Astana" },
  { value: "UTC+7", label: "(UTC+07:00) Bangkok, Jakarta" },
  { value: "UTC+8", label: "(UTC+08:00) Beijing, Singapore" },
  { value: "UTC+9", label: "(UTC+09:00) Tokyo, Seoul" },
  { value: "UTC+10", label: "(UTC+10:00) Sydney, Melbourne" },
  { value: "UTC+11", label: "(UTC+11:00) Solomon Islands" },
  { value: "UTC+12", label: "(UTC+12:00) Auckland, Fiji" },
]

interface TimezoneSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimezoneSelect({ value, onChange, disabled }: TimezoneSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400">
        <SelectValue placeholder="Selecciona tu zona horaria" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {timezones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            {tz.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}