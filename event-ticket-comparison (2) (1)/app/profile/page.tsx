"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { events } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Settings } from "lucide-react"
import { userEventsStore } from "@/lib/user-events-store"

const userProfile = {
  username: "musicfan123",
  displayName: "Alex Johnson",
  bio: "Concert enthusiast | Sports fan | Always looking for the next great event",
  profilePic: "/placeholder.svg?height=100&width=100&text=AJ&bg=6c5ce7&color=white",
  location: "Boston, MA",
  joinedDate: "January 2023",
}

export default function ProfilePage() {
  const [eventsGoing, setEventsGoing] = useState<any[]>([])
  const [eventsDownToGo, setEventsDownToGo] = useState<any[]>([])

  const updateUserEvents = () => {
    const goingEventIds = userEventsStore.getGoingEvents()
    const downToGoEventIds = userEventsStore.getDownToGoEvents()

    const userGoingEvents = events
      .filter((event) => goingEventIds.includes(event.id))
      .map((event) => ({
        id: event.id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        image: event.image,
      }))

    const userDownToGoEvents = events
      .filter((event) => downToGoEventIds.includes(event.id))
      .map((event) => ({
        id: event.id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        image: event.image,
      }))

    setEventsGoing(userGoingEvents)
    setEventsDownToGo(userDownToGoEvents)
  }

  useEffect(() => {
    // Initial load
    updateUserEvents()

    // Subscribe to store changes
    const unsubscribe = userEventsStore.subscribe(() => {
      updateUserEvents()
    })

    return unsubscribe
  }, [])

  return (
    <div className="mobile-container py-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden ring-2 ring-primary/20">
            <Image
              src={userProfile.profilePic || "/placeholder.svg"}
              alt={userProfile.displayName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userProfile.displayName}</h1>
            <p className="text-sm text-muted-foreground">@{userProfile.username}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{userProfile.location}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Prominent Feedback Button */}
      <div className="mb-4">
        <Link href="https://forms.gle/7T31qYYytAb8ovfo6" target="_blank">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
            💬 Give Feedback
          </Button>
        </Link>
      </div>

      <p className="mb-6">{userProfile.bio}</p>

      <Tabs defaultValue="downToGo" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="downToGo">⬇️ Down To Go ({eventsDownToGo.length})</TabsTrigger>
          <TabsTrigger value="going">🎟️ Going ({eventsGoing.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="downToGo" className="mt-4">
          <div className="event-spacing">
            {eventsDownToGo && eventsDownToGo.length > 0 ? (
              eventsDownToGo.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <Card className="overflow-hidden">
                    <div className="relative h-32 w-full">
                      <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{event.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.venue}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                You haven't marked any events as "Down To Go" yet.
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="going" className="mt-4">
          <div className="event-spacing">
            {eventsGoing && eventsGoing.length > 0 ? (
              eventsGoing.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <Card className="overflow-hidden">
                    <div className="relative h-32 w-full">
                      <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{event.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.venue}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">You haven't marked any events as "Going" yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button className="w-full">Edit Profile</Button>
    </div>
  )
}
