import { Event, EventType, EventPrivacy, EventStatus } from "./types";

export const ROYALTY_FREE_TRACKS = [
  { id: "t-1", name: "Lagos Sunset Groove", genre: "Afrobeats Party", duration: "3:15", artist: "Tunji & The Band" },
  { id: "t-2", name: "Traditional Grace (Asoke Love)", genre: "Acoustic Highlife", duration: "4:00", artist: "Yemi Alade Tribute" },
  { id: "t-3", name: "Heavenly Bells Thanksgiving", genre: "Gospel Uplifting", duration: "3:40", artist: "Redeemed Harmonies" },
  { id: "t-4", name: "Cinematic Eternity", genre: "Orchestral Love", duration: "2:50", artist: "Royal Strings Orchestra" },
  { id: "t-5", name: "Owambe Drums Live", genre: "Talking Drums & Juju", duration: "5:00", artist: "King Sunny Tribute" },
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: "event-1",
    code: "OWAMBE2026",
    name: "Tobi & Adaeze's Royal Traditional Wedding",
    description: "Celebrating the divine convergence of families, aso-ebi colors, rich traditional rites, and everlasting love in Lekki, Lagos.",
    date: "2026-06-12",
    type: EventType.TRADITIONAL_WEDDING,
    coverPhoto: "https://picsum.photos/seed/wedding_cover/1200/600",
    privacy: EventPrivacy.PUBLIC,
    status: EventStatus.ACTIVE,
    storageUsed: 235.8, // MB
    photos: [
      {
        id: "p-1",
        eventId: "event-1",
        guestName: "Funmi Alao",
        url: "https://picsum.photos/seed/wed1/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed1/400/400",
        likes: 42,
        createdAt: "2026-06-12T16:15:00Z",
        comments: [
          { id: "c-1", photoId: "p-1", author: "Aunty Ngozi", body: "The bride's fabric is exceptionally regal! Outstanding!", createdAt: "2026-06-12T16:30:00Z" }
        ],
        labels: ["Bride", "Smiles"]
      },
      {
        id: "p-2",
        eventId: "event-1",
        guestName: "Emeka Okafor",
        url: "https://picsum.photos/seed/wed2/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed2/400/400",
        likes: 18,
        createdAt: "2026-06-12T16:21:00Z",
        comments: []
      },
      {
        id: "p-3",
        eventId: "event-1",
        guestName: "Chima Obi",
        url: "https://picsum.photos/seed/wed3/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed3/400/400",
        originalUrl: "https://picsum.photos/seed/wed3_old/1000/1000",
        likes: 56,
        createdAt: "2026-06-12T16:45:00Z",
        comments: [
          { id: "c-2", photoId: "p-3", author: "Tobi (Groom)", body: "Unbelievable shot! The face scanning matching hit this spot on.", createdAt: "2026-06-13T08:00:00Z" }
        ],
        labels: ["Groom", "Dancing"]
      },
      {
        id: "p-4",
        eventId: "event-1",
        guestName: "Bose Thomas",
        url: "https://picsum.photos/seed/wed4/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed4/400/400",
        likes: 12,
        createdAt: "2026-06-12T17:02:00Z",
        comments: []
      },
      {
        id: "p-5",
        eventId: "event-1",
        guestName: "Sola King",
        url: "https://picsum.photos/seed/wed5/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed5/400/400",
        likes: 29,
        createdAt: "2026-06-12T17:34:00Z",
        comments: [],
        labels: ["Bride", "Groom", "Toast"]
      },
      {
        id: "p-6",
        eventId: "event-1",
        guestName: "Kelechi Ugo",
        url: "https://picsum.photos/seed/wed6/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed6/400/400",
        likes: 31,
        createdAt: "2026-06-12T17:50:00Z",
        comments: []
      },
      {
        id: "p-7",
        eventId: "event-1",
        guestName: "Dayo Shonibare",
        url: "https://picsum.photos/seed/wed7/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed7/400/400",
        likes: 9,
        createdAt: "2026-06-12T18:05:00Z",
        comments: []
      },
      {
        id: "p-8",
        eventId: "event-1",
        guestName: "Chioma Johnson",
        url: "https://picsum.photos/seed/wed8/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed8/400/400",
        likes: 72,
        createdAt: "2026-06-12T18:15:00Z",
        comments: [
          { id: "c-3", photoId: "p-8", author: "Adaeze (Bride)", body: "This captures my exact laughter! Perfect candid memory.", createdAt: "2026-06-12T20:30:00Z" }
        ],
        labels: ["Bride", "Cake"]
      },
      {
        id: "p-9",
        eventId: "event-1",
        guestName: "Yetunde Cole",
        url: "https://picsum.photos/seed/wed9/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed9/400/400",
        likes: 23,
        createdAt: "2026-06-12T18:40:00Z",
        comments: []
      },
      {
        id: "p-10",
        eventId: "event-1",
        guestName: "Ibrahim Musa",
        url: "https://picsum.photos/seed/wed10/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/wed10/400/400",
        likes: 47,
        createdAt: "2026-06-12T19:00:00Z",
        comments: [],
        labels: ["Bride", "Dancing"]
      }
    ],
    videos: [
      {
        id: "v-1",
        eventId: "event-1",
        guestName: "Funmi Alao",
        url: "https://assets.mixkit.co/videos/preview/mixkit-african-woman-dancing-happily-at-a-celebration-40502-large.mp4",
        thumbnailUrl: "https://picsum.photos/seed/v1_thumb/400/250",
        duration: 15,
        likes: 14,
        createdAt: "2026-06-12T16:20:00Z"
      },
      {
        id: "v-2",
        eventId: "event-1",
        guestName: "Sola King",
        url: "https://assets.mixkit.co/videos/preview/mixkit-friends-toasting-at-an-outdoor-dinner-party-41808-large.mp4",
        thumbnailUrl: "https://picsum.photos/seed/v2_thumb/400/250",
        duration: 24,
        likes: 38,
        createdAt: "2026-06-12T17:45:00Z"
      }
    ],
    photobooks: [],
    highlights: []
  },
  {
    id: "event-2",
    code: "OWAMBE50",
    name: "Chief Alhaji's Majestic 50th Gold Jubilee",
    description: "An extraordinary golden owambe marked by grandeur, traditional talking drums, exquisite Jof rice feasts, and luxury networking.",
    date: "2026-06-14",
    type: EventType.OWAMBE,
    coverPhoto: "https://picsum.photos/seed/owambe_cover/1200/600",
    privacy: EventPrivacy.PUBLIC,
    status: EventStatus.ACTIVE,
    storageUsed: 78.4, // MB
    photos: [
      {
        id: "p-201",
        eventId: "event-2",
        guestName: "Yemi Shola",
        url: "https://picsum.photos/seed/gold1/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/gold1/400/400",
        likes: 45,
        createdAt: "2026-06-14T18:30:00Z",
        comments: []
      },
      {
        id: "p-202",
        eventId: "event-2",
        guestName: "Femi Badmus",
        url: "https://picsum.photos/seed/gold2/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/gold2/400/400",
        likes: 33,
        createdAt: "2026-06-14T18:45:00Z",
        comments: []
      },
      {
        id: "p-203",
        eventId: "event-2",
        guestName: "Nosa Osagie",
        url: "https://picsum.photos/seed/gold3/1000/1000",
        thumbnailUrl: "https://picsum.photos/seed/gold3/400/400",
        likes: 67,
        createdAt: "2026-06-14T19:10:00Z",
        comments: []
      }
    ],
    videos: [],
    photobooks: [],
    highlights: []
  }
];
