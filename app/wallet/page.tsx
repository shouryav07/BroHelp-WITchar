"use client";

import { useEffect, useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
  note?: string;
  task?: { title: string };
  from?: { name: string };
  to?: { name: string };
};

export default function WalletPage() {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const res = await fetch("/api/wallet");
    const data = await res.json();

    const allTx = [
      ...(data.user.transactionsFrom || []),
      ...(data.user.transactionsTo || []),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setCredits(data.user.credits);
    setTransactions(allTx);
    setLoading(false);
  };

  const handleTopUp = async () => {
    if (!amount) return;

    await fetch("/api/wallet/topup", {
      method: "POST",
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });

    setAmount("");
    fetchWallet();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Balance Card */}
        <div className="rounded-2xl p-8 mb-10 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
          <div className="flex items-center gap-2 text-white/80 mb-3">
            <Wallet size={18} /> Available Balance
          </div>
          <h1 className="text-5xl font-extrabold">{credits}</h1>
          <p className="text-sm text-white/70 mt-2">credits</p>
        </div>

        {/* Top Up */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">Add Credits</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 outline-none"
            />
            <button
              onClick={handleTopUp}
              className="bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-6 py-2 font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

          {loading ? (
            <p className="text-white/40">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-white/40">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium">
                      {tx.reason.replace("_", " ")}
                    </p>
                    <p className="text-xs text-white/40">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.to ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.to ? "+" : "-"} {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}