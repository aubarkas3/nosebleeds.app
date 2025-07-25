import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { userProfiles } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const userProfile = userProfiles[params.username as keyof typeof userProfiles]

  if (!userProfile) {
    return (
      <div className="mobile-container py-6 text-center">
        <p>User not found</p>
        <Link href="/">
          <Button className="mt-4">Back to Feed</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mobile-container py-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to feed
        </Link>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden">
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
        <p className="mb-6">{userProfile.bio}</p>
      </div>

      <Tabs defaultValue="downToGo" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="downToGo">⬇️ Down To Go</TabsTrigger>
          <TabsTrigger value="going">🎟️ Going</TabsTrigger>
        </TabsList>
        <TabsContent value="downToGo" className="mt-4">
          <div className="event-spacing">
            {userProfile.eventsDownToGo && userProfile.eventsDownToGo.length > 0 ? (
              userProfile.eventsDownToGo.map((event) => (
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
                {userProfile.username} hasn't marked any events as "Down To Go" yet.
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="going" className="mt-4">
          <div className="event-spacing">
            {userProfile.eventsGoing && userProfile.eventsGoing.length > 0 ? (
              userProfile.eventsGoing.map((event) => (
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
                {userProfile.username} hasn't marked any events as "Going" yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
