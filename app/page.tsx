"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Expense = {
  id: number;
  payer: string;
  amount: number;
  participants: string[];
};

export default function HomePage() {
  const [people, setPeople] = useState("Juan,Ana,Pedro");
  const [payer, setPayer] = useState("Juan");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState<string[]>([
    "Juan",
    "Ana",
    "Pedro",
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const peopleList = useMemo(
    () =>
      people
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    [people]
  );

  const addExpense = () => {
    if (!payer || !amount || participants.length === 0) return;

    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        payer,
        amount: Number(amount),
        participants,
      },
    ]);

    setAmount("");
  };

  const balances = useMemo(() => {
    const result: Record<string, number> = {};

    peopleList.forEach((person) => {
      result[person] = 0;
    });

    expenses.forEach((expense) => {
      const split = expense.amount / expense.participants.length;

      result[expense.payer] += expense.amount;

      expense.participants.forEach((person) => {
        result[person] -= split;
      });
    });

    return result;
  }, [expenses, peopleList]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">

        {/* LOGO + TÍTULO */}
        <div className="flex flex-col items-center justify-center gap-4">

          <Image
            src="/logo.png"
            alt="Gastos Compartidos"
            width={180}
            height={180}
            priority
          />

          <h1 className="text-3xl font-bold text-center">
            💸 Gastos Compartidos
          </h1>

        </div>

        {/* PERSONAS */}
        <div className="card">
          <label className="block text-sm mb-2 text-zinc-400">
            Personas (separadas por coma)
          </label>

          <input
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="input"
          />
        </div>

        {/* FORMULARIO */}
        <div className="card space-y-4">

          {/* Quién pagó */}
          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Quién pagó
            </label>

            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="input"
            >
              {peopleList.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Cuánto
            </label>

            <input
              type="number"
              placeholder="50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
            />
          </div>

          {/* Participantes */}
          <div>
            <label className="block text-sm mb-2 text-zinc-400">
              Quiénes participaron
            </label>

            <div className="flex flex-wrap gap-2">
              {peopleList.map((person) => {
                const active = participants.includes(person);

                return (
                  <button
                    key={person}
                    onClick={() => {
                      if (active) {
                        setParticipants((prev) =>
                          prev.filter((p) => p !== person)
                        );
                      } else {
                        setParticipants((prev) => [...prev, person]);
                      }
                    }}
                    className={`chip ${active ? "chip-active" : ""}`}
                  >
                    {person}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTÓN */}
          <button onClick={addExpense} className="btn btn-primary">
            Agregar gasto
          </button>
        </div>

        {/* GASTOS */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📋 Gastos</h2>

          {expenses.length === 0 && (
            <p className="text-zinc-500">No hay gastos todavía.</p>
          )}

          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-zinc-800/40 p-3 rounded-xl">
                <p>
                  <span className="font-semibold">{expense.payer}</span> pagó{" "}
                  <span className="text-green-400">
                    ${expense.amount.toLocaleString()}
                  </span>
                </p>

                <p className="text-sm text-zinc-400 mt-1">
                  Participaron: {expense.participants.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BALANCE */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">🧾 Balance</h2>

          <div className="space-y-2">
            {Object.entries(balances).map(([person, balance]) => (
              <div
                key={person}
                className="flex justify-between items-center bg-zinc-800/40 p-3 rounded-xl"
              >
                <span>{person}</span>

                <span
                  className={
                    balance >= 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {balance >= 0 ? "+" : ""}
                  ${balance.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}