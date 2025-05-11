"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handlePlayGame = () => {
    router.push("/play-game");
  };

  const handleShowHistory = () => {
    router.push("/history");
  };

  return (
    <div className="d-flex gap-2 m-3">
      <button className="btn btn-primary" onClick={handlePlayGame}>
        Play Game
      </button>
      <button className="btn btn-primary" onClick={handleShowHistory}>
        Show Previous Game
      </button>
    </div>
  );
}
