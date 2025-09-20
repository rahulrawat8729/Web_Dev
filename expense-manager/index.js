const http = require("http");
const fs = require("fs");
const url = require("url");

const DATA_FILE = "expenses.json";

// Utility: Read expenses
function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// Utility: Write expenses
function writeExpenses(expenses) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

// Create Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // 🔎 Debug log
  console.log("Request received:", req.method, pathname, query);

  res.setHeader("Content-Type", "application/json");

  // ✅ Root route → welcome message
  if (req.method === "GET" && pathname === "/") {
    res.end(JSON.stringify({
      message: "Welcome to Expense Manager API!",
      routes: {
        view: "/expenses",
        add: "/add?title=Food&amount=200",
        delete: "/delete?id=YOUR_ID"
      }
    }, null, 2));
  }

  // GET /expenses → list all expenses
  else if (req.method === "GET" && pathname === "/expenses") {
    const expenses = readExpenses();
    res.end(JSON.stringify(expenses));
  }

  // GET /add?title=Food&amount=100
  else if (req.method === "GET" && pathname === "/add") {
    const expenses = readExpenses();
    const newExpense = {
      id: Date.now(),
      title: query.title || "Untitled",
      amount: Number(query.amount) || 0,
    };
    expenses.push(newExpense);
    writeExpenses(expenses);
    res.end(JSON.stringify({ message: "Expense added", data: newExpense }));
  }

  // GET /delete?id=123
  else if (req.method === "GET" && pathname === "/delete") {
    const expenses = readExpenses();
    const filtered = expenses.filter((e) => e.id != query.id);
    writeExpenses(filtered);
    res.end(JSON.stringify({ message: "Expense deleted", id: query.id }));
  }

  // Fallback
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

// Start server
server.listen(5000, () => {
  console.log("Server running at http://localhost:5000/");
});
