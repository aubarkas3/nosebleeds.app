import { posts } from "@/lib/data"
import SocialFeedPost from "@/components/social-feed-post"

export default function SocialFeed() {
  return (
    <div className="mobile-container py-6">
      <h1 className="text-2xl font-bold mb-6">Social Feed</h1>
      <div className="event-spacing">
        {posts.map((post) => (
          <SocialFeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
