import { jsPDF } from "jspdf";

const currency = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export function receiptNumber(transactionId) {
  const digits = String(transactionId).replace(/[^0-9]/g, "");
  return `MP-${digits.slice(-9).padStart(9, "0")}`;
}

const TYPE_LABEL = {
  deposit: "Deposit",
  buy: "Buy",
  transfer: "Transfer",
  rebalance: "Rebalance",
  withdrawal: "Withdrawal",
};

export function downloadReceiptPdf(transaction, profile) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 56;
  let y = 64;

  const accent = [177, 18, 38];
  const dark = [23, 23, 23];
  const gray = [110, 110, 110];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...dark);
  doc.text("PROJECT SOVEREIGN PEAK", marginX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text("Institutional Retirement & Digital Asset Platform", marginX, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...accent);
  doc.text("OFFICIAL RECEIPT", 539, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(receiptNumber(transaction.id), 539, y + 14, { align: "right" });

  y += 24;
  doc.setDrawColor(177, 18, 38);
  doc.setLineWidth(1.2);
  doc.line(marginX, y, 539, y);
  doc.setLineWidth(0.5);

  y += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text("BILLED TO", marginX, y);
  doc.text("RECEIPT DATE", 320, y);

  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text(profile.name || "Investor", marginX, y);
  doc.text(transaction.date, 320, y);

  y += 15;
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(profile.email || "—", marginX, y);

  const statusColor =
    transaction.status === "completed" ? [16, 145, 91] : transaction.status === "pending" ? [180, 130, 20] : [180, 40, 40];
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...statusColor);
  doc.text((transaction.status || "completed").toUpperCase(), 320, y);

  y += 34;
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(248, 248, 248);
  doc.rect(marginX, y, 539 - marginX, 26, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text("DESCRIPTION", marginX + 12, y + 17);
  doc.text("DETAIL", 539 - 12, y + 17, { align: "right" });

  y += 26;
  const rows = [["Description", transaction.label || TYPE_LABEL[transaction.type] || transaction.type]];
  rows.push(["Type", TYPE_LABEL[transaction.type] ?? transaction.type]);
  if (transaction.symbol) rows.push(["Asset", transaction.symbol]);
  rows.push(["Date", transaction.date]);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  rows.forEach(([label, value], i) => {
    const rowY = y + 24 * i + 17;
    if (i % 2 === 1) {
      doc.setFillColor(252, 252, 252);
      doc.rect(marginX, y + 24 * i, 539 - marginX, 24, "F");
    }
    doc.setTextColor(...gray);
    doc.text(label, marginX + 12, rowY);
    doc.setTextColor(...dark);
    doc.text(String(value), 539 - 12, rowY, { align: "right" });
  });

  y += 24 * rows.length + 20;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, y, 539, y);

  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...dark);
  doc.text("Total Amount", marginX, y);

  const positive = transaction.amount > 0;
  doc.setFontSize(18);
  doc.setTextColor(...(positive ? [16, 145, 91] : dark));
  doc.text(`${positive ? "+" : ""}${currency(transaction.amount)}`, 539, y, { align: "right" });

  y += 60;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(marginX, y, 539, y);

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text("Sovereign Peak Capital LLC", marginX, y);

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "This is an official transaction record. Please retain for your records.",
    marginX,
    y
  );

  doc.save(`${receiptNumber(transaction.id)}.pdf`);
}
