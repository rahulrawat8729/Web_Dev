import React, { useEffect, useMemo, useState } from "react";

// ==========================
// Finance Management App (JSX-only)
// - Pure React (no backend, no CSS files, no external libs)
// - Inline styles only
// - Persists to localStorage
// ==========================

// ----- Small style system (inline) -----
const ui = {
  page: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    background: '#0b1324',
    color: '#e6e9f2',
    minHeight: '100vh',
    padding: '24px',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  heading: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  sub: { opacity: 0.7, marginBottom: 20 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 16,
  },
  card: {
    gridColumn: 'span 12',
    background: 'linear-gradient(180deg, #111a35, #0e1730)',
    border: '1px solid #1d2a52',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  },
  cardSm: { gridColumn: 'span 12' },
  // responsive helpers will be set inline via style overrides
  label: { fontSize: 13, opacity: 0.9, marginBottom: 6 },
  input: {
    width: '100%',
    background: '#0a1022',
    color: '#e6e9f2',
    border: '1px solid #223061',
    borderRadius: 10,
    padding: '10px 12px',
    outline: 'none',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  btn: {
    background: '#2d6cdf',
    border: 'none',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnGhost: {
    background: 'transparent',
    border: '1px solid #2d6cdf',
    color: '#cde0ff',
    padding: '9px 13px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  pill: (bg) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    background: bg,
  }),
  kpi: { fontSize: 22, fontWeight: 800 },
  muted: { opacity: 0.8 },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
};

// ----- helpers -----
const fmtCurrency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const todayStr = () => new Date().toISOString().slice(0, 10);
const id = () => Math.random().toString(36).slice(2, 9);

const DEFAULTS = {
  categories: [
    'Salary', 'Freelance', 'Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other'
  ],
};

// ----- Chart (simple SVG bar chart, no libraries) -----
function BarChart({ data, height = 160 }) {
  const width = 420;
  const padding = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = (width - padding * 2) / data.length;

  return (
    <svg width={width} height={height} style={{ width: '100%', maxWidth: 560, display: 'block' }}>
      {/* axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2a3b73" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2a3b73" />

      {data.map((d, i) => {
        const h = ((d.value / max) * (height - padding * 2)) || 0;
        const x = padding + i * barW + 6;
        const y = height - padding - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW - 12} height={h} rx={8} fill="#2d6cdf" />
            <text x={x + (barW - 12) / 2} y={height - padding + 14} fontSize={11} textAnchor="middle" fill="#a9b8e8">
              {d.label}
            </text>
            <text x={x + (barW - 12) / 2} y={y - 6} fontSize={11} textAnchor="middle" fill="#d9e2ff">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ----- Summary cards -----
function Summary({ transactions }) {
  const { income, expense, balance } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Build per-category totals for chart (top 6)
  const perCat = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      const key = t.category || 'Uncategorized';
      const prev = map.get(key) || 0;
      map.set(key, prev + t.amount * (t.type === 'expense' ? 1 : 0)); // chart expenses only
    });
    return Array.from(map, ([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  return (
    <div style={{ ...ui.grid }}>
      <div style={{ ...ui.card, gridColumn: 'span 4' }}>
        <div style={{ ...ui.muted, marginBottom: 6 }}>Total Income</div>
        <div style={ui.kpi}>{fmtCurrency(income)}</div>
        <div style={{ marginTop: 10 }}>{/* green pill */}<span style={ui.pill('rgba(12, 186, 120, 0.2)')}>+ inflow</span></div>
      </div>
      <div style={{ ...ui.card, gridColumn: 'span 4' }}>
        <div style={{ ...ui.muted, marginBottom: 6 }}>Total Expense</div>
        <div style={ui.kpi}>{fmtCurrency(expense)}</div>
        <div style={{ marginTop: 10 }}><span style={ui.pill('rgba(242, 79, 112, 0.2)')}>- outflow</span></div>
      </div>
      <div style={{ ...ui.card, gridColumn: 'span 4' }}>
        <div style={{ ...ui.muted, marginBottom: 6 }}>Balance</div>
        <div style={ui.kpi}>{fmtCurrency(balance)}</div>
        <div style={{ marginTop: 10 }}><span style={ui.pill('rgba(45, 108, 223, 0.2)')}>available</span></div>
      </div>

      <div style={{ ...ui.card, gridColumn: 'span 12' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>Top Expense Categories</div>
          <div style={ui.muted}>Shows sum of expenses by category</div>
        </div>
        {perCat.length ? (
          <BarChart data={perCat.map(d => ({ label: short(d.label), value: Math.round(d.value) }))} />
        ) : (
          <div style={ui.muted}>No expense data yet.</div>
        )}
      </div>
    </div>
  );
}

// shorten long labels for chart
function short(label) {
  return label.length > 8 ? label.slice(0, 8) + '…' : label;
}

// ----- Add/Edit Transaction Form -----
function TransactionForm({ onSubmit, editing, onCancel, categories }) {
  const [type, setType] = useState(editing?.type || 'expense');
  const [amount, setAmount] = useState(editing?.amount?.toString() || '');
  const [text, setText] = useState(editing?.text || '');
  const [category, setCategory] = useState(editing?.category || categories[0]);
  const [date, setDate] = useState(editing?.date || todayStr());

  useEffect(() => {
    
    if (editing) {
      setType(editing.type);
      setAmount(editing.amount.toString());
      setText(editing.text || '');
      setCategory(editing.category || categories[0]);
      setDate(editing.date || todayStr());
    }
  }, [editing, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) return alert('Enter a valid positive amount');
    if (!text.trim()) return alert('Please enter a note/description');

    const payload = {
      id: editing?.id || id(),
      type,
      amount: amt,
      text: text.trim(),
      category,
      date,
      createdAt: editing?.createdAt || Date.now(),
    };
    onSubmit(payload);

    if (!editing) {
      // Clear on add
      setAmount('');
      setText('');
      setCategory(categories[0]);
      setType('expense');
      setDate(todayStr());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <div style={ui.row}>
        <div>
          <div style={ui.label}>Type</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setType('income')} style={{ ...ui.btnGhost, borderColor: type === 'income' ? '#0cba78' : '#2d6cdf' }}>Income</button>
            <button type="button" onClick={() => setType('expense')} style={{ ...ui.btnGhost, borderColor: type === 'expense' ? '#f24f70' : '#2d6cdf' }}>Expense</button>
          </div>
        </div>
        <div>
          <div style={ui.label}>Amount (INR)</div>
          <input style={ui.input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" />
        </div>
      </div>
      <div style={ui.row}>
        <div>
          <div style={ui.label}>Category</div>
          <select style={ui.input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={ui.label}>Date</div>
          <input style={ui.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div>
        <div style={ui.label}>Note / Description</div>
        <input style={ui.input} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Grocery shopping" />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {editing && (
          <button type="button" onClick={onCancel} style={ui.btnGhost}>Cancel</button>
        )}
        <button type="submit" style={ui.btn}>{editing ? 'Update' : 'Add Transaction'}</button>
      </div>
    </form>
  );
}

// ----- Transaction List -----
function TransactionList({ items, onEdit, onDelete, filter, setFilter, categories }) {
  const filtered = useMemo(() => {
    return items.filter(t => {
      const byType = filter.type === 'all' || t.type === filter.type;
      const byCat = !filter.category || t.category === filter.category;
      const byQuery = !filter.q || t.text.toLowerCase().includes(filter.q.toLowerCase());
      return byType && byCat && byQuery;
    });
  }, [items, filter]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select style={ui.input} value={filter.type} onChange={(e) => setFilter(v => ({ ...v, type: e.target.value }))}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={ui.input} value={filter.category} onChange={(e) => setFilter(v => ({ ...v, category: e.target.value }))}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input style={{ ...ui.input, maxWidth: 240 }} placeholder="Search notes…" value={filter.q} onChange={(e) => setFilter(v => ({ ...v, q: e.target.value }))} />
      </div>

      {/* Table */}
      <table style={ui.table}>
        <thead>
          <tr style={{ color: '#a9b8e8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            <th style={{ textAlign: 'left', padding: '0 12px' }}>Date</th>
            <th style={{ textAlign: 'left', padding: '0 12px' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '0 12px' }}>Category</th>
            <th style={{ textAlign: 'left', padding: '0 12px' }}>Note</th>
            <th style={{ textAlign: 'right', padding: '0 12px' }}>Amount</th>
            <th style={{ textAlign: 'right', padding: '0 12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} style={{ background: '#0e1730', border: '1px solid #1d2a52' }}>
              <td style={{ padding: '10px 12px', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>{t.date}</td>
              <td style={{ padding: '10px 12px' }}>
                <span style={ui.pill(t.type === 'income' ? 'rgba(12, 186, 120, 0.2)' : 'rgba(242, 79, 112, 0.2)')}>{t.type}</span>
              </td>
              <td style={{ padding: '10px 12px' }}>{t.category}</td>
              <td style={{ padding: '10px 12px', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{t.type === 'expense' ? '-' : '+'}{fmtCurrency(t.amount)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <button onClick={() => onEdit(t)} style={{ ...ui.btnGhost, marginRight: 6 }}>Edit</button>
                <button onClick={() => onDelete(t.id)} style={{ ...ui.btnGhost, borderColor: '#f24f70', color: '#ffd8e1' }}>Delete</button>
              </td>
            </tr>
          ))}
          {!filtered.length && (
            <tr>
              <td colSpan={6} style={{ padding: '14px 12px', color: '#a9b8e8' }}>No transactions match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ----- Root App -----
export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const raw = localStorage.getItem('fm.transactions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', category: '', q: '' });

  const categories = DEFAULTS.categories;

  useEffect(() => {
    localStorage.setItem('fm.transactions', JSON.stringify(transactions));
  }, [transactions]);

  const upsert = (payload) => {
    setTransactions((prev) => {
      const i = prev.findIndex((t) => t.id === payload.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = payload;
        return next.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      }
      return [...prev, payload].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    });
    setEditing(null);
  };

  const remove = (id) => {
    if (!confirm('Delete this transaction?')) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Seed demo data button
  const seed = () => {
    const sample = [
      { id: id(), type: 'income', amount: 25000, text: 'Salary', category: 'Salary', date: todayStr(), createdAt: Date.now() - 50000 },
      { id: id(), type: 'expense', amount: 1200, text: 'Groceries', category: 'Food', date: todayStr(), createdAt: Date.now() - 40000 },
      { id: id(), type: 'expense', amount: 600, text: 'Bus pass', category: 'Transport', date: todayStr(), createdAt: Date.now() - 30000 },
      { id: id(), type: 'expense', amount: 3500, text: 'Electricity bill', category: 'Bills', date: todayStr(), createdAt: Date.now() - 20000 },
      { id: id(), type: 'income', amount: 3000, text: 'Part-time', category: 'Freelance', date: todayStr(), createdAt: Date.now() - 10000 },
    ];
    setTransactions(sample);
  };

  return (
    <div style={ui.page}>
      <div style={ui.container}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={ui.heading}>Finance Manager</div>
            <div style={ui.sub}>Track income & expenses — React only, JSX-only, no backend.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={seed} style={ui.btnGhost}>Load demo</button>
            <button onClick={() => { localStorage.removeItem('fm.transactions'); setTransactions([]); }} style={ui.btnGhost}>Clear data</button>
          </div>
        </div>

        <div style={ui.grid}>
          {/* Left: form */}
          <div style={{ ...ui.card, gridColumn: 'span 5' }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{editing ? 'Edit Transaction' : 'Add Transaction'}</div>
            <TransactionForm
              onSubmit={upsert}
              editing={editing}
              onCancel={() => setEditing(null)}
              categories={categories}
            />
          </div>

          {/* Right: summary */}
          <div style={{ ...ui.card, gridColumn: 'span 7' }}>
            <Summary transactions={transactions} />
          </div>

          {/* Full width: list */}
          <div style={{ ...ui.card, gridColumn: 'span 12' }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Transactions</div>
            <TransactionList
              items={transactions}
              onEdit={setEditing}
              onDelete={remove}
              filter={filter}
              setFilter={setFilter}
              categories={categories}
            />
          </div>
        </div>

        {/* footer */}
        <div style={{ textAlign: 'center', marginTop: 18, opacity: 0.6, fontSize: 12 }}>
          Built with React — stored in localStorage — no external libraries.
        </div>
      </div>

      {/* Small responsive tweak */}
      <style>{`
        @media (max-width: 920px) {
          /* Stack cards: 12 cols on small screens */
          div[style*="grid-template-columns: repeat(12)"] > div[style*="grid-column: span 5"],
          div[style*="grid-template-columns: repeat(12)"] > div[style*="grid-column: span 7"],
          div[style*="grid-template-columns: repeat(12)"] > div[style*="grid-column: span 4"] {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
