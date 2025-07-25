"use client"

import { useState } from "react"
import { events } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import EventCard from "@/components/event-card"

export default function EventSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [genre, setGenre] = useState<string | undefined>(undefined)

  const filteredEvents = events.filter((event) => {
    // Filter by search query
    const matchesSearch =
      !searchQuery ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by genre
    const matchesGenre = !genre || event.genre.toLowerCase() === genre.toLowerCase()

    // Filter by date (simplified for demo)
    const matchesDate = !date || event.date.includes(format(date, "MMMM d, yyyy"))

    return matchesSearch && matchesGenre && matchesDate
  })

  return (
    <div className="mobile-container py-6">
      <h1 className="text-2xl font-bold mb-6">Event Search</h1>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by artist, team, venue, or city..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal flex-1", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="stand-up">Stand-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="event-spacing">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-center py-8 text-muted-foreground">No events found matching your criteria.</p>
        )}
      </div>
    </div>
  )
}
