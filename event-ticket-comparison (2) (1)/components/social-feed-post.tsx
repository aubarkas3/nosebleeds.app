"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sampleUsers } from "@/lib/data"

interface Post {
  id: string
  username: string
  profilePic: string
  event: string
  eventId: string
  goingCount: number
  downToGoCount: number
  timestamp: string
  isGoing: boolean
  isDownToGo: boolean
}

export default function SocialFeedPost({ post }: { post: Post }) {
  const [goingCount, setGoingCount] = useState(post.goingCount)
  const [downToGoCount, setDownToGoCount] = useState(post.downToGoCount)

  const postText = post.isGoing ? " is going to " : " is Down To Go to "

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <Link href={`/user/${post.username}`}>
            <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
              <AvatarImage src={post.profilePic || "/placeholder.svg"} alt={post.username} />
              <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/user/${post.username}`} className="font-medium hover:text-primary transition-colors">
                {post.username}
              </Link>
              {postText}
              <Link href={`/event/${post.eventId}`} className="font-medium text-primary hover:underline">
                {post.event}
              </Link>
            </p>
            <div className="text-xs text-muted-foreground mt-1">{post.timestamp}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <span>🎟️</span>
                <span className="font-medium">Going: {goingCount}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Going to {post.event}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {sampleUsers.going.slice(0, goingCount > 10 ? 10 : goingCount).map((user, index) => (
                    <Link key={index} href={`/user/${user.username}`}>
                      <div className="flex items-center gap-2 hover:bg-muted p-2 rounded cursor-pointer">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.username}</span>
                      </div>
                    </Link>
                  ))}
                  {goingCount > 10 && <div className="text-xs text-muted-foreground">+{goingCount - 10} more</div>}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <span>⬇️</span>
                <span className="font-medium">Down To Go: {downToGoCount}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Down To Go to {post.event}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {sampleUsers.downToGo.slice(0, downToGoCount > 10 ? 10 : downToGoCount).map((user, index) => (
                    <Link key={index} href={`/user/${user.username}`}>
                      <div className="flex items-center gap-2 hover:bg-muted p-2 rounded cursor-pointer">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.username} />
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.username}</span>
                      </div>
                    </Link>
                  ))}
                  {downToGoCount > 10 && (
                    <div className="text-xs text-muted-foreground">+{downToGoCount - 10} more</div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
