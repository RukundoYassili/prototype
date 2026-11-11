export type CommunityPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  position: string;
  illustrative: boolean;
};

// Add photographs here to extend both the homepage grid and the photo viewer.
// Only publish outreach photographs with permission from the people pictured.
export const communityPhotos: CommunityPhoto[] = [
  {
    id: "conversation",
    src: "/images/mental-health-group.webp",
    alt: "A small group sitting together and listening during a conversation",
    title: "Making room for conversation",
    category: "Listening & understanding",
    position: "50% 42%",
    illustrative: true,
  },
  {
    id: "connection",
    src: "/images/mental-health-connection.webp",
    alt: "A group joining hands in a shared gesture of connection",
    title: "Stronger through connection",
    category: "Togetherness & belonging",
    position: "50% 44%",
    illustrative: true,
  },
  {
    id: "listening",
    src: "/images/mental-health-listening.webp",
    alt: "Two people having an attentive conversation in a calm, welcoming room",
    title: "Every conversation matters",
    category: "Care & compassion",
    position: "50% 38%",
    illustrative: true,
  },
];
