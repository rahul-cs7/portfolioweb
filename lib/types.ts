export type Project = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  longDescription: string;
  year: string;
  category: string;
  status: string;
  difficulty: string;
  stack: string[];
  features: string[];
  challenge: string;
  solution: string;
  accent: "violet" | "cyan" | "amber";
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
  images: string[];
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: string;
};

export type Skill = {
  id: string;
  name: string;
  type: string;
  level: number;
};
