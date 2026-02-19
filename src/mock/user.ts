export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
}

export const mockUser: User = {
  id: "user1",
  name: "John Trader",
  email: "john@example.com",
  image: null,
  createdAt: new Date("2024-01-01"),
};
