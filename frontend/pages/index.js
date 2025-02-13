import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);

  // Récupération des livres depuis l'API
  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Erreur lors du chargement :", err));
  }, []);

  // Fonction pour supprimer un livre
  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setBooks(books.filter((book) => book.id !== id)); // Met à jour l'affichage
    } else {
      console.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h1>Liste des Livres</h1>
      <a href="/add" style={{ display: "block", marginBottom: "20px" }}>
        Ajouter un Livre
      </a>
      <ul>
        {books.length === 0 ? (
          <p>Aucun livre disponible.</p>
        ) : (
          books.map((book) => (
            <li key={book.id}>
              <a href={`/book/${book.id}`} style={{ marginRight: "10px" }}>
                {book.title} - {book.author} ({book.year})
              </a>
              <button onClick={() => handleDelete(book.id)}>Supprimer</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}