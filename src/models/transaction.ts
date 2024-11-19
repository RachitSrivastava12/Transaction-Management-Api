export interface Transaction {
    id: number;
    user_id: number;
    amount: number;
    currency: string;
    type: "deposit" | "withdrawal";
    created_at: Date;
  }
  