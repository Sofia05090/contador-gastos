"use client";

type Props = {
  balances: Record<string, number>;
};

export default function ResumenDeudas({
  balances,
}: Props) {
  const debtors = Object.entries(balances)
    .filter(([, value]) => value < 0)
    .map(([name, value]) => ({
      name,
      amount: Math.abs(value),
    }));

  const creditors = Object.entries(balances)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      amount: value,
    }));

  const settlements: string[] = [];

  debtors.forEach((debtor) => {
    creditors.forEach((creditor) => {
      if (debtor.amount > 0 && creditor.amount > 0) {
        const payment = Math.min(
          debtor.amount,
          creditor.amount
        );

        settlements.push(
          `${debtor.name} le debe $${payment.toFixed(
            0
          )} a ${creditor.name}`
        );

        debtor.amount -= payment;
        creditor.amount -= payment;
      }
    });
  });

  return (
    <div className="bg-zinc-900 p-4 rounded-2xl mt-6">
      <h2 className="text-xl font-semibold mb-4">
        🤝 Resumen de deudas
      </h2>

      {settlements.length === 0 ? (
        <p className="text-zinc-500">
          Todo está equilibrado 🎉
        </p>
      ) : (
        <div className="space-y-2">
          {settlements.map((text, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-3 rounded-xl"
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}