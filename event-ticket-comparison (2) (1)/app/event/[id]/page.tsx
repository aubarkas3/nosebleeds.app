"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Check, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { events, seatingSections, ticketProviders, ticketPrices } from "@/lib/data"
import { userEventsStore } from "@/lib/user-events-store"

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find((e) => e.id === params.id)
  const [isGoing, setIsGoing] = useState(false)
  const [isDownToGo, setIsDownToGo] = useState(false)
  const [goingCount, setGoingCount] = useState(event?.goingCount || 0)
  const [downToGoCount, setDownToGoCount] = useState(event?.downToGoCount || 0)

  useEffect(() => {
    if (event) {
      // Initialize state from store
      setIsGoing(userEventsStore.isEventGoing(event.id))
      setIsDownToGo(userEventsStore.isEventDownToGo(event.id))

      // Subscribe to store changes
      const unsubscribe = userEventsStore.subscribe(() => {
        setIsGoing(userEventsStore.isEventGoing(event.id))
        setIsDownToGo(userEventsStore.isEventDownToGo(event.id))
      })

      return unsubscribe
    }
  }, [event])

  if (!event) {
    return (
      <div className="mobile-container py-6 text-center">
        <p>Event not found</p>
        <Link href="/search">
          <Button className="mt-4">Back to Search</Button>
        </Link>
      </div>
    )
  }

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
    <div className="mobile-container py-6">
      <div className="mb-6">
        <Link
          href="/search"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to search
        </Link>
        <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
          <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm flex items-center gap-1">
              🎟️ <span className="font-medium">Going: {goingCount}</span>
            </span>
            <span className="text-sm flex items-center gap-1">
              ⬇️ <span className="font-medium">Down To Go: {downToGoCount}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant={isGoing ? "default" : "outline"} size="sm" onClick={toggleGoing} className="gap-1">
              {isGoing && <Check className="h-4 w-4" />}
              <span>{isGoing ? "Going" : "🎟️"}</span>
            </Button>
            <Button variant={isDownToGo ? "default" : "outline"} size="sm" onClick={toggleDownToGo} className="gap-1">
              {isDownToGo && <Check className="h-4 w-4" />}
              <span>{isDownToGo ? "Down To Go" : "⬇️"}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Seating Chart</h2>
        <div className="bg-muted rounded-lg p-4 mb-4 relative aspect-square">
          {/* Floor section */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs bg-transparent"
              >
                Floor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Floor Tickets</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {ticketProviders.map((provider) => {
                    const price = ticketPrices.floor?.[provider.id as keyof typeof ticketPrices.floor]
                    if (!price) return null

                    return (
                      <Card key={provider.id}>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground mb-2">via {provider.name}</div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">${price.total.toFixed(2)}</div>
                              <div className="text-xs text-muted-foreground">
                                ${price.price.toFixed(2)} + ${price.fees.toFixed(2)} fees
                              </div>
                            </div>
                            <Link href={price.url} target="_blank">
                              <Button size="sm">Buy Now</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* 100s sections - inner circle (5 sections) */}
          {seatingSections
            .filter((s) => s.id.startsWith("s1"))
            .map((section, index) => {
              const angle = index * 72 * (Math.PI / 180) // 72 degrees apart (360/5)
              const radius = 35 // % from center
              const top = 50 + radius * Math.sin(angle)
              const left = 50 + radius * Math.cos(angle)

              return (
                <Dialog key={section.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs bg-transparent"
                      style={{ top: `${top}%`, left: `${left}%` }}
                    >
                      {section.name.replace("Section ", "")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{section.name} Tickets</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {ticketProviders.map((provider) => {
                          const price =
                            ticketPrices[section.id as keyof typeof ticketPrices]?.[
                              provider.id as keyof (typeof ticketPrices)[typeof section.id]
                            ]
                          if (!price) return null

                          return (
                            <Card key={provider.id}>
                              <CardContent className="p-3">
                                <div className="text-xs text-muted-foreground mb-2">via {provider.name}</div>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">${price.total.toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground">
                                      ${price.price.toFixed(2)} + ${price.fees.toFixed(2)} fees
                                    </div>
                                  </div>
                                  <Link href={price.url} target="_blank">
                                    <Button size="sm">Buy Now</Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )
            })}

          {/* 200s sections - outer circle (5 sections) */}
          {seatingSections
            .filter((s) => s.id.startsWith("s2"))
            .map((section, index) => {
              const angle = index * 72 * (Math.PI / 180) // 72 degrees apart (360/5)
              const radius = 45 // % from center
              const top = 50 + radius * Math.sin(angle)
              const left = 50 + radius * Math.cos(angle)

              return (
                <Dialog key={section.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs bg-transparent"
                      style={{ top: `${top}%`, left: `${left}%` }}
                    >
                      {section.name.replace("Section ", "")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>{section.name} Tickets</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-80">
                      <div className="space-y-3">
                        {ticketProviders.map((provider) => {
                          const price =
                            ticketPrices[section.id as keyof typeof ticketPrices]?.[
                              provider.id as keyof (typeof ticketPrices)[typeof section.id]
                            ]
                          if (!price) return null

                          return (
                            <Card key={provider.id}>
                              <CardContent className="p-3">
                                <div className="text-xs text-muted-foreground mb-2">via {provider.name}</div>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">${price.total.toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground">
                                      ${price.price.toFixed(2)} + ${price.fees.toFixed(2)} fees
                                    </div>
                                  </div>
                                  <Link href={price.url} target="_blank">
                                    <Button size="sm">Buy Now</Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )
            })}
        </div>
      </div>
    </div>
  )
}
