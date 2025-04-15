// import userEvent from "@testing-library/user-event";
// import { useEffect, useState } from "react";
// import supabase from "./supabase";
// import "./style.css";

// const CATEGORIES = [
//   { name: "technology", color: "#3b82f6" },
//   { name: "science", color: "#16a34a" },
//   { name: "finance", color: "#ef4444" },
//   { name: "society", color: "#eab308" },
//   { name: "entertainment", color: "#db2777" },
//   { name: "health", color: "#14b8a6" },
//   { name: "history", color: "#f97316" },
//   { name: "news", color: "#8b5cf6" },
// ];

// const initialFacts = [
//   {
//     id: 1,
//     text: "React is being developed by Meta (formerly facebook)",
//     source: "https://opensource.fb.com/",
//     category: "technology",
//     votesInteresting: 24,
//     votesMindblowing: 9,
//     votesFalse: 4,
//     createdIn: 2021,
//   },
//   {
//     id: 2,
//     text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//     source:
//       "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//     category: "society",
//     votesInteresting: 11,
//     votesMindblowing: 2,
//     votesFalse: 0,
//     createdIn: 2019,
//   },
//   {
//     id: 3,
//     text: "Lisbon is the capital of Portugal",
//     source: "https://en.wikipedia.org/wiki/Lisbon",
//     category: "society",
//     votesInteresting: 8,
//     votesMindblowing: 3,
//     votesFalse: 1,
//     createdIn: 2015,
//   },
// ];

// function App() {
//   const [showForm, setShowForm] = useState(false);
//   const [facts, setFacts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState("all");

//   useEffect(
//     function () {
//       async function getFacts() {
//         setIsLoading(true);

//         let query = supabase.from("facts").select("*");

//         if (currentCategory !== "all")
//           query = query.eq("category", currentCategory);

//         query = query.order("votesInteresting", { ascending: false });

//         const { data: facts, error } = await query;
//         if (!error) setFacts(facts);
//         else alert("There was a problem getting data");
//         setIsLoading(false);
//       }
//       getFacts();
//     },
//     [currentCategory]
//   );
//   return (
//     <>
//       <Header showForm={showForm} setShowForm={setShowForm} />
//       {showForm && (
//         <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
//       )}
//       <main className="main">
//         <CategoryFilter setCurrentCategory={setCurrentCategory} />
//         {(isLoading && <Loader />) || (
//           <FactList facts={facts} setFacts={setFacts} />
//         )}
//       </main>
//     </>
//   );
// }

// function Loader() {
//   return <p className="message">Loading...</p>;
// }

// function Header({ showForm, setShowForm }) {
//   const appTitle = "Today I learned!";

//   return (
//     <header className="header">
//       <div className="logo">
//         <img src="logo.png" alt="Today I learned logo" />
//         <h1>{appTitle}</h1>
//       </div>
//       <button
//         className="btn btn-large btn-open"
//         onClick={() => setShowForm((showForm) => !showForm)}
//       >
//         {showForm ? "close" : "Share a fact"}
//       </button>
//     </header>
//   );
// }

// function isValidHttpUrl(string) {
//   let url;
//   try {
//     url = new URL(string);
//   } catch (_) {
//     return false;
//   }
//   return url.protocol === "http:" || url.protocol === "https:";
// }

// function NewFactForm({ setFacts, setShowForm }) {
//   const [text, setText] = useState("");
//   const [source, setSource] = useState("");
//   const [category, setCategory] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const textLength = text.length;

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!text || !isValidHttpUrl(source) || !category || textLength > 200)
//       return;

//     setIsUploading(true);
//     const { data: newFact, error } = await supabase
//       .from("facts")
//       .insert([{ text, source, category }])
//       .select();
//     setIsUploading(false);

//     if (!error) setFacts((facts) => [newFact[0], ...facts]);

//     setText("");
//     setSource("");
//     setCategory("");
//   }

//   return (
//     <form className="fact-form" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Share a fact with the world..."
//         value={text}
//         onChange={(e) =>
//           e.target.value.length <= 200 && setText(e.target.value)
//         }
//         disabled={isUploading}
//       />
//       <span>{200 - textLength}</span>
//       <input
//         type="text"
//         placeholder="Trustworthy source..."
//         value={source}
//         onChange={(e) => setSource(e.target.value)}
//         disabled={isUploading}
//       />
//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         disabled={isUploading}
//       >
//         <option value="">Choose category:</option>
//         {CATEGORIES.map((cat) => (
//           <option key={cat.name} value={cat.name}>
//             {cat.name[0].toUpperCase() + cat.name.slice(1)}
//           </option>
//         ))}
//       </select>
//       <button className="btn btn-large btn-post" disabled={isUploading}>
//         Post
//       </button>
//     </form>
//   );
// }

// function CategoryFilter({ setCurrentCategory }) {
//   return (
//     <aside>
//       <ul>
//         <li className="category">
//           <button
//             className="btn btn-all-categories"
//             onClick={() => setCurrentCategory("all")}
//           >
//             All
//           </button>
//         </li>
//         {CATEGORIES.map((cat) => (
//           <li key={cat.name} className="category">
//             <button
//               className="btn btn-category"
//               onClick={() => setCurrentCategory(cat.name)}
//               style={{ backgroundColor: cat.color }}
//             >
//               {cat.name}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }

// function FactList({ facts, setFacts }) {
//   if (facts.length === 0)
//     return (
//       <p className="message">
//         No facts for this category yet! Create the first one.
//       </p>
//     );

//   return (
//     <section>
//       <ul className="facts-list">
//         {facts.map((fact) => (
//           <Fact key={fact.id} fact={fact} setFacts={setFacts} />
//         ))}
//       </ul>
//       <p>There are {facts.length} facts in the database. Add your own!</p>
//     </section>
//   );
// }

// function Fact({ fact, setFacts }) {
//   const [isUpdating, setIsUpdating] = useState(false);
//   const isDisputed =
//     fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

//   async function handleVote(columnName) {
//     setIsUpdating(true);
//     const { data: updatedFact, error } = await supabase
//       .from("facts")
//       .update({ [columnName]: fact[columnName] + 1 })
//       .eq("id", fact.id)
//       .select();
//     setIsUpdating(false);

//     if (!error)
//       setFacts((facts) =>
//         facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
//       );
//   }

//   return (
//     <li className="fact">
//       <p>
//         {isDisputed && <span className="disputed">[⛔ DISPUTED]</span>}
//         {fact.text}
//         <a className="source" href={fact.source} target="_blank">
//           (Source)
//         </a>
//       </p>
//       <span
//         className="tag"
//         style={{
//           backgroundColor: `${
//             CATEGORIES.find((cat) => cat.name === fact.category)?.color ||
//             "#999"
//           }`,
//         }}
//       >
//         {fact.category}
//       </span>
//       <div className="vote-buttons">
//         <button
//           onClick={() => handleVote("votesInteresting")}
//           disabled={isUpdating}
//         >
//           {fact.votesInteresting} 👍
//         </button>
//         <button
//           onClick={() => handleVote("votesMindblowing")}
//           disabled={isUpdating}
//         >
//           {fact.votesMindblowing} 🤯
//         </button>
//         <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
//           {fact.votesFalse} ⛔
//         </button>
//       </div>
//     </li>
//   );
// }

// export default App;

// App.jsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import supabase from "./supabase";
import "./style.css";

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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [selectedFact, setSelectedFact] = useState(null);

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");
      if (currentCategory !== "all") query = query.eq("category", currentCategory);
      query = query.order("votesInteresting", { ascending: false });

      const { data: facts, error } = await query;
      if (!error) setFacts(facts);
      else alert("There was a problem getting data");
      setIsLoading(false);
    }

    getFacts();
  }, [currentCategory]);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm && <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} setSelectedFact={setSelectedFact} />
        )}
      </main>
      {selectedFact && (
        <FactPopup fact={selectedFact} setFacts={setFacts} onClose={() => setSelectedFact(null)} />
      )}
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I learned logo" />
        <h1>Today I learned!</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text || !isValidHttpUrl(source) || !category || textLength > 200) return;

    setIsUploading(true);
    const { data: newFact, error } = await supabase.from("facts").insert([{ text, source, category }]).select();
    setIsUploading(false);

    if (!error) setFacts((facts) => [newFact[0], ...facts]);
    setText("");
    setSource("");
    setCategory("");
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Share a fact..." value={text} onChange={(e) => e.target.value.length <= 200 && setText(e.target.value)} disabled={isUploading} />
      <span>{200 - textLength}</span>
      <input type="text" placeholder="Source..." value={source} onChange={(e) => setSource(e.target.value)} disabled={isUploading} />
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

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>All</button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button className="btn btn-category" onClick={() => setCurrentCategory(cat.name)} style={{ backgroundColor: cat.color }}>
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

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

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(fact.text);
  const [editSource, setEditSource] = useState(fact.source);

  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("facts").delete().eq("id", fact.id);
    if (!error) setFacts((facts) => facts.filter((f) => f.id !== fact.id));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ text: editText, source: editSource })
      .eq("id", fact.id)
      .select();

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
      setIsEditing(false);
    }
  }

  return (
    <li className="fact">
      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            required
          />
          <input
            type="text"
            value={editSource}
            onChange={(e) => setEditSource(e.target.value)}
            required
          />
          <button className="btn" type="submit">Save</button>
          <button className="btn" type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>
            {isDisputed && <span className="disputed">[⛔ DISPUTED]</span>}
            {fact.text}
            <a className="source" href={fact.source} target="_blank" rel="noreferrer">
              (Source)
            </a>
          </p>
          <span
            className="tag"
            style={{
              backgroundColor: `${
                CATEGORIES.find((cat) => cat.name === fact.category)?.color ||
                "#999"
              }`,
            }}
          >
            {fact.category}
          </span>
          <div className="vote-buttons">
            <button
              onClick={() => handleVote("votesInteresting")}
              disabled={isUpdating}
            >
              {fact.votesInteresting} 👍
            </button>
            <button
              onClick={() => handleVote("votesMindblowing")}
              disabled={isUpdating}
            >
              {fact.votesMindblowing} 🤯
            </button>
            <button
              onClick={() => handleVote("votesFalse")}
              disabled={isUpdating}
            >
              {fact.votesFalse} ⛔
            </button>
          </div>
          <div className="edit-delete-buttons">
            <button className="btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
            <button className="btn" onClick={handleDelete}>
              ❌ Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

function FactPopup({ fact, setFacts, onClose }) {
  const [text, setText] = useState(fact.text);
  const [source, setSource] = useState(fact.source);
  const [category, setCategory] = useState(fact.category);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    const { data: updated, error } = await supabase.from("facts").update({ text, source, category }).eq("id", fact.id).select();
    setIsSaving(false);
    if (!error) {
      setFacts((facts) => facts.map((f) => (f.id === fact.id ? updated[0] : f)));
      onClose();
    }
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="text-xl font-bold">Edit Fact</Dialog.Title>
            <button onClick={onClose}><XMarkIcon className="h-6 w-6 text-gray-500 hover:text-black" /></button>
          </div>
          <div className="space-y-4">
            <input type="text" className="w-full rounded border p-2" value={text} onChange={(e) => setText(e.target.value)} />
            <input type="text" className="w-full rounded border p-2" value={source} onChange={(e) => setSource(e.target.value)} />
            <select className="w-full rounded border p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button className="btn border border-gray-300 px-4 py-2 rounded" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button className="btn bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave} disabled={isSaving}>Save</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default App;
