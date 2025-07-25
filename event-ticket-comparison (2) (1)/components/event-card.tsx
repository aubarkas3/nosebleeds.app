"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Check } from "lucide-react"
import { userEventsStore } from "@/lib/user-events-store"

interface Event {
  id: string
  name: string
  date: string
  time: string
  venue: string
  city: string
  image: string
  category: string
  genre: string
  goingCount: number
  downToGoCount: number
  isUserGoing: boolean
  isUserDownToGo: boolean
}

export default function EventCard({ event }: { event: Event }) {
  const [isGoing, setIsGoing] = useState(false)
  const [isDownToGo, setIsDownToGo] = useState(false)
  const [goingCount, setGoingCount] = useState(event.goingCount)
  const [downToGoCount, setDownToGoCount] = useState(event.downToGoCount)

  useEffect(() => {
    // Initialize state from store
    setIsGoing(userEventsStore.isEventGoing(event.id))
    setIsDownToGo(userEventsStore.isEventDownToGo(event.id))

    // Subscribe to store changes
    const unsubscribe = userEventsStore.subscribe(() => {
      setIsGoing(userEventsStore.isEventGoing(event.id))
      setIsDownToGo(userEventsStore.isEventDownToGo(event.id))
    })

    return unsubscribe
  }, [event.id])

  const toggleGoing = () => {
    const newIsGoing = !isGoing

    if (newIsGoing) {
      setGoingCount(goingCount + 1)
      if (isDownToGo) {
        setDownToGoCount(downToGoCount - 1)
      }
    } else {
      setGoingCount(goingCount - 1)
    }

    userEventsStore.setEventGoing(event.id, newIsGoing)
  }

  const toggleDownToGo = () => {
    const newIsDownToGo = !isDownToGo

    if (newIsDownToGo) {
      setDownToGoCount(downToGoCount + 1)
      if (isGoing) {
        setGoingCount(goingCount - 1)
      }
    } else {
      setDownToGoCount(downToGoCount - 1)
    }

    userEventsStore.setEventDownToGo(event.id, newIsDownToGo)
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/event/${event.id}`}>
        <div className="relative h-40 w-full">
          <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/event/${event.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{event.name}</h3>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {event.date} • {event.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {event.venue} • {event.city}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm flex items-center gap-1">
              🎟️ <span className="font-medium">Going: {goingCount}</span>
            </span>
            <span className="text-sm flex items-center gap-1">
              ⬇️ <span className="font-medium">Down To Go: {downToGoCount}</span>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={isGoing ? "default" : "outline"} size="sm" onClick={toggleGoing} className="flex-1 gap-1">
            {isGoing && <Check className="h-4 w-4" />}
            <span>{isGoing ? "Going" : "🎟️ Going"}</span>
          </Button>
          <Button
            variant={isDownToGo ? "default" : "outline"}
            size="sm"
            onClick={toggleDownToGo}
            className="flex-1 gap-1"
          >
            {isDownToGo && <Check className="h-4 w-4" />}
            <span>{isDownToGo ? "Down To Go" : "⬇️ Down To Go"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
