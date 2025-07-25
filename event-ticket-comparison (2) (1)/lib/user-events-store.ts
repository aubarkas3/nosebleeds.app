// Simple store to manage user events across the app
class UserEventsStore {
  private eventsGoing: Set<string> = new Set()
  private eventsDownToGo: Set<string> = new Set()
  private listeners: (() => void)[] = []

  constructor() {
    // Load from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedGoing = localStorage.getItem("userEventsGoing")
      const savedDownToGo = localStorage.getItem("userEventsDownToGo")

      if (savedGoing) {
        this.eventsGoing = new Set(JSON.parse(savedGoing))
      }

      if (savedDownToGo) {
        this.eventsDownToGo = new Set(JSON.parse(savedDownToGo))
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("userEventsGoing", JSON.stringify([...this.eventsGoing]))
      localStorage.setItem("userEventsDownToGo", JSON.stringify([...this.eventsDownToGo]))
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  setEventGoing(eventId: string, isGoing: boolean) {
    if (isGoing) {
      this.eventsGoing.add(eventId)
      this.eventsDownToGo.delete(eventId) // Remove from down to go if marking as going
    } else {
      this.eventsGoing.delete(eventId)
    }
    this.saveToStorage()
    this.notifyListeners()
  }

  setEventDownToGo(eventId: string, isDownToGo: boolean) {
    if (isDownToGo) {
      this.eventsDownToGo.add(eventId)
      this.eventsGoing.delete(eventId) // Remove from going if marking as down to go
    } else {
      this.eventsDownToGo.delete(eventId)
    }
    this.saveToStorage()
    this.notifyListeners()
  }

  isEventGoing(eventId: string): boolean {
    return this.eventsGoing.has(eventId)
  }

  isEventDownToGo(eventId: string): boolean {
    return this.eventsDownToGo.has(eventId)
  }

  getGoingEvents(): string[] {
    return [...this.eventsGoing]
  }

  getDownToGoEvents(): string[] {
    return [...this.eventsDownToGo]
  }
}

export const userEventsStore = new UserEventsStore()
