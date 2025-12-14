import './App.css'
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  // ✅ FIX 1: balance calculation here
  const balance = transactions.reduce((sum, t) => sum + t.price, 0);

  function addNewTransaction(e) {
    e.preventDefault();

    const price = Number(name.split(' ')[0]);
    const cleanName = name.substring(name.indexOf(' ') + 1);

    fetch(`${import.meta.env.VITE_API_URL}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        datetime,
        description,
        price
      })
    })
      .then(res => res.json())
      .then(() => {
        setName('');
        setDatetime('');
        setDescription('');

        // ✅ FIX 2: fetch AFTER save
        return fetch(`${import.meta.env.VITE_API_URL}/transactions`);
      })
      .then(res => res.json())
      .then(data => setTransactions(data));
  }

  return (
    <main>
      <h1>
        <span className="money plus">₹</span>
        {balance}
        <span className="decimal">.00</span>
      </h1>

      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="+500 from dad"
          />
          <input
            type="datetime-local"
            value={datetime}
            required
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
          />
        </div>

        <button type="submit">Add new transaction</button>
      </form>

      <div className="transactions">
        {transactions.map(t => (
          <div className="transaction" key={t._id}>
            <div className="left">
              <div className="name">{t.name}</div>
              <div className="description">{t.description}</div>
            </div>
            <div className="right">
              <div className={`price ${t.price < 0 ? 'red' : 'green'}`}>
                {t.price < 0 ? '-₹' : '+₹'}{Math.abs(t.price)}
              </div>
              <div className="datetime">{t.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
