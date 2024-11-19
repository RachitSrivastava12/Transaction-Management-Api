export interface User {
    id: number;
    email: string;
    password: string;
    balance: Record<string, number>; // e.g., { BTC: 1.5, ETH: 2 }
  }
  