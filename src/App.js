import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

// 💡 CATEGORIES CONSTANT
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

// ✅ MAIN APP COMPONENT
function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [selectedFact, setSelectedFact] = useState(null);
  const [keyword, setKeyword] = useState(""); // 🔍 NEW: Search keyword

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);
      let query = supabase.from("facts").select("*");
      if (currentCategory !== "all") query = query.eq("category", currentCategory);
      query = query.order("votesInteresting", { ascending: false });

      const { data, error } = await query;
      if (!error) setFacts(data);
      else alert("There was a problem getting data");
      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory]);

  const filteredFacts = facts.filter((fact) =>
    fact.text.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />}

      {/* 🔍 NEW: Search Input */}
      <Search keyword={keyword} setKeyword={setKeyword} />

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={filteredFacts} setFacts={setFacts} setSelectedFact={setSelectedFact} />
        )}
      </main>
    </>
  );
}

// 🆕 🔍 SEARCH COMPONENT
function Search({ keyword, setKeyword }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search facts..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

// 🧩 HEADER COMPONENT
function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I learned logo" />
        <h1>Today I learned!</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={() => setShowForm((s) => !s)}>
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

// 🧩 LOADER COMPONENT
function Loader() {
  return <p className="message">Loading...</p>;
}

// 🧩 NEW FACT FORM COMPONENT
function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }


  async function handleSubmit(e) {
    e.preventDefault();
    if (!text || !isValidHttpUrl(source) || !category || textLength > 200) return;

    setIsUploading(true);
    const { data, error } = await supabase.from("facts").insert([{ text, source, category }]).select();
    setIsUploading(false);

    if (!error) setFacts((facts) => [data[0], ...facts]);
    setText("");
    setSource("");
    setCategory("");
    setShowForm(false);
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact..."
        value={text}
        onChange={(e) => e.target.value.length <= 200 && setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={isUploading}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      <button className="btn btn-large btn-post" disabled={isUploading}>Post</button>
    </form>
  );
}

// 🧩 CATEGORY FILTER COMPONENT
function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>All</button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// 🧩 FACT LIST COMPONENT
function FactList({ facts, setFacts, setSelectedFact }) {
  if (facts.length === 0) return <p className="message">No facts for this category yet!</p>;
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} onClick={() => setSelectedFact(fact)} />
        ))}
      </ul>
    </section>
  );
}

// 🧩 SINGLE FACT COMPONENT
function Fact({ fact, setFacts, onClick }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(fact.text);
  const [editSource, setEditSource] = useState(fact.source);

  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(column) {
    setIsUpdating(true);
    const { data, error } = await supabase
      .from("facts")
      .update({ [column]: fact[column] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error) setFacts((facts) => facts.map((f) => (f.id === fact.id ? data[0] : f)));
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete?")) return;
    const { error } = await supabase.from("facts").delete().eq("id", fact.id);
    if (!error) setFacts((facts) => facts.filter((f) => f.id !== fact.id));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from("facts")
      .update({ text: editText, source: editSource })
      .eq("id", fact.id)
      .select();

    if (!error) {
      setFacts((facts) => facts.map((f) => (f.id === fact.id ? data[0] : f)));
      setIsEditing(false);
    }
  }

  return (
    <li className="fact" onClick={onClick}>
      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} required />
          <input type="text" value={editSource} onChange={(e) => setEditSource(e.target.value)} required />
          <div className="edit-delete-buttons">
            <button className="btn" type="submit">💾 Save</button>
            <button className="btn" type="button" onClick={() => setIsEditing(false)}>❌ Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="fact-content">
            <p className="fact-text">
              {isDisputed && <span className="disputed">[⛔ DISPUTED]</span>}
              {fact.text}
              <a className="source" href={fact.source} target="_blank" rel="noreferrer">(Source)</a>
            </p>
            <div className="fact-meta">
              <span className="tag" style={{ backgroundColor: CATEGORIES.find((c) => c.name === fact.category)?.color || "#999" }}>
                {fact.category}
              </span>
            </div>
          </div>

          <div className="fact-actions">
            <div className="vote-buttons">
              <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>{fact.votesInteresting} 👍</button>
              <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>{fact.votesMindblowing} 🤯</button>
              <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>{fact.votesFalse} ⛔</button>
            </div>
            <div className="edit-delete-buttons">
              <button className="btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
              <button className="btn" onClick={handleDelete}>❌ Delete</button>
            </div>
          </div>
        </>
      )}
    </li>
  );
}


export default App;
