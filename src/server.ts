import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE transactions (id INTEGER PRIMARY KEY, status TEXT, type TEXT, clientName TEXT, amount REAL)');
});

// Get all transactions
app.get('/transactions', (_, res: Response) => {
  db.all('SELECT * FROM transactions', (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Insert new transactions
app.post('/transactions', (req: Request, res: Response) => {
  const { transactions } = req.body;
  const stmt = db.prepare('INSERT INTO transactions (status, type, clientName, amount) VALUES (?, ?, ?, ?)');

  transactions.forEach((tx: { status: string, type: string, clientName: string, amount: number }) => {
    stmt.run(tx.status, tx.type, tx.clientName, tx.amount);
  });

  stmt.finalize();
  res.status(201).json({ message: 'Transactions added successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
