export interface Novel {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  cover: string;
  description: string;
  tags: string[];
  status: "ongoing" | "completed" | "hiatus";
  views: number;
  likes: number;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  order: number;
  publishedAt: string;
}

export const MOCK_NOVELS: Novel[] = [
  {
    id: "1",
    title: "The Shadow of the Wind",
    authorId: "101",
    authorName: "Carlos Ruiz Zafón",
    cover: "https://picsum.photos/seed/shadow/300/450",
    description: "A mystery set in post-war Barcelona, involving a young boy and a forgotten book.",
    tags: ["Mystery", "Historical", "Thriller"],
    status: "completed",
    views: 12500,
    likes: 3400,
    updatedAt: "2023-10-15",
  },
  {
    id: "2",
    title: "Cyberpunk: Neon City",
    authorId: "102",
    authorName: "Alice Chen",
    cover: "https://picsum.photos/seed/cyber/300/450",
    description: "In a world ruled by corporations, one hacker fights to reclaim her identity.",
    tags: ["Sci-Fi", "Cyberpunk", "Action"],
    status: "ongoing",
    views: 8900,
    likes: 1200,
    updatedAt: "2023-11-02",
  },
  {
    id: "3",
    title: "The Last Alchemist",
    authorId: "103",
    authorName: "John Doe",
    cover: "https://picsum.photos/seed/magic/300/450",
    description: "Magic is dying. One apprentice holds the key to saving it.",
    tags: ["Fantasy", "Magic", "Adventure"],
    status: "ongoing",
    views: 5600,
    likes: 890,
    updatedAt: "2023-11-05",
  },
  {
    id: "4",
    title: "Silent Echoes",
    authorId: "104",
    authorName: "Jane Smith",
    cover: "https://picsum.photos/seed/echo/300/450",
    description: "A psychological horror story about a house that remembers everything.",
    tags: ["Horror", "Psychological", "Thriller"],
    status: "completed",
    views: 15000,
    likes: 4500,
    updatedAt: "2023-09-20",
  },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "c1",
    novelId: "1",
    title: "Chapter 1: The Cemetery of Forgotten Books",
    content: `
      <p>I still remember the day my father took me to the Cemetery of Forgotten Books for the first time. It was the early summer of 1945, and we walked through the streets of a Barcelona trapped beneath ashen skies as the sun poured liquid copper onto the Rambla de Santa Mónica.</p>
      <p>"Daniel, what you'll see today is a place of mystery, a sanctuary," my father whispered. "Every book, every volume you see here, has a soul. The soul of the person who wrote it and of those who read it and lived and dreamed with it. Every time a book changes hands, every time someone runs his eyes down its pages, its spirit grows and strengthens."</p>
      <p>We turned onto a small street, hidden away from the main thoroughfares, where the shadows seemed to linger longer than anywhere else. An old wooden door stood before us, carved with symbols I didn't understand. My father knocked three times.</p>
      <p>The door creaked open, revealing a vast labyrinth of shelves that spiraled up into the darkness, filled with books of all shapes and sizes. The smell of old paper and dust was intoxicating.</p>
      <p>"Welcome, Daniel," a voice echoed from the shadows. An old man stepped forward, his eyes twinkling with a secret knowledge. "Choose a book. But remember, the book you choose will adopt you."</p>
    `,
    order: 1,
    publishedAt: "2023-10-01",
  },
  {
    id: "c2",
    novelId: "1",
    title: "Chapter 2: The Face in the Crowd",
    content: `
      <p>Days turned into weeks, and the book I had chosen, "The Shadow of the Wind" by Julian Carax, became my obsession. I read it cover to cover, lost in its world of intrigue and romance. But as I delved deeper, I realized that the author's life was as mysterious as his stories.</p>
      <p>One evening, as I walked home from school, I felt a pair of eyes watching me. I turned around, but the street was empty. A chill ran down my spine. Was it just my imagination, or was someone following me?</p>
      <p>I quickened my pace, clutching the book to my chest. The shadows seemed to stretch and twist, taking on sinister shapes. I reached my front door and fumbled with the key, my heart pounding in my chest.</p>
      <p>Just as I slipped inside, I saw him. A man in a dark trench coat, standing under the flickering streetlamp. His face was hidden in shadow, but I could feel his gaze burning into me.</p>
    `,
    order: 2,
    publishedAt: "2023-10-05",
  },
];
