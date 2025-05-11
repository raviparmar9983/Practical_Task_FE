"use client";
import { getGameData } from "@/services/quizService";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
export default function HistoryPage() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const router = useRouter();

  const loadGames = async (currentPage) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getGameData(currentPage);
      const { data, pagination } = res.data;

      setGames((prev) => {
        const combined = [...prev, ...data];
        const uniqueMap = new Map();
        for (const item of combined) {
          uniqueMap.set(item._id, item);
        }
        return Array.from(uniqueMap.values());
      });

      setHasMore(pagination.pageNum < pagination.totalPages);
      setPage(currentPage + 1);
    } catch (err) {
      toast.error("Failed to fetch game data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames(1); 
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          loadGames(page);
        }
      },
      { threshold: 1 }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => loader && observer.unobserve(loader);
  }, [hasMore, loading, page]);

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-primary"
        onClick={() => router.push("/dashboard")}
      >
        Dashboard
      </button>

      <h1 className="mb-4">Game History</h1>

      {games.map((game, idx) => (
        <div key={game._id || idx} className="mt-4">
          <h2 className="mb-3">
            Result #{idx + 1} — Score: {game.score}/{game.totalMarks}
          </h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Correct</th>
                  <th>Your Answer</th>
                </tr>
              </thead>
              <tbody>
                {game.questions.map((res) => (
                  <tr
                    key={res._id}
                    className={
                      res.selectedAnswer === res.correctAnswer
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <td>{res.question}</td>
                    <td>{res.correctAnswer}</td>
                    <td>{res.selectedAnswer ?? "Timeout"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div ref={loaderRef} className="text-center my-4">
        {loading && <p>Loading more...</p>}
        {!hasMore && <p>No more history to load.</p>}
      </div>
    </div>
  );
}
