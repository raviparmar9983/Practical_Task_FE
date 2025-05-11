"use client";

import { uploadGameData } from "@/services/quizService";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const operators = ["+", "-", "x", "/"];

const generateQuestion = (usedQuestionsSet) => {
  let a, b, op, key, result;

  while (true) {
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 10);
    op = operators[Math.floor(Math.random() * operators.length)];

    if (op === "/" && (b === 0 || a % b !== 0)) continue;
    if (op === "-" && a < b) continue;

    result = op === "+" ? a + b : op === "-" ? a - b : op === "x" ? a * b : a / b;
    key = `${a}${op}${b}`;

    if (!usedQuestionsSet.has(key)) {
      usedQuestionsSet.add(key);
      return { a, b, op, correctAnswer: result, key };
    }
  }
};

const generateChoices = (correct) => {
  const choices = new Set([correct]);
  while (choices.size < 4) {
    const fake = correct + Math.floor(Math.random() * 11) - 5;
    if (fake !== correct && fake >= 0) choices.add(fake);
  }
  return Array.from(choices).sort(() => 0.5 - Math.random());
};

export default function PlayGamePage() {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [timer, setTimer] = useState(30);
  const [results, setResults] = useState([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const usedQuestionsRef = useRef(new Set());
  const intervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (started && questionIndex < 10) {
      const newQ = generateQuestion(usedQuestionsRef.current);
      setQuestion(newQ);
      setChoices(generateChoices(newQ.correctAnswer));
      setTimer(30);
    }
  }, [questionIndex, started]);

  useEffect(() => {
    if (started && questionIndex < 10) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [question]);

  useEffect(() => {
    if (timer === 0) {
      handleAnswer(null, true);
    }
  }, [timer]);

  const handleAnswer = (choice, timeout = false) => {
    clearInterval(intervalRef.current);

    if (!question) return;

    const isCorrect = choice === question.correctAnswer;
    const answerRecord = {
      question: `${question.a} ${question.op} ${question.b}`,
      selectedAnswer: choice,
      correctAnswer: question.correctAnswer,
    };

    setResults((prev) => [...prev, answerRecord]);

    if (questionIndex < 9) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setStarted(false);
      setIsQuizFinished(true);
    }
  };

  const startGame = () => {
    usedQuestionsRef.current.clear();
    setStarted(true);
    setQuestionIndex(0);
    setResults([]);
    setIsQuizFinished(false);
  };

  useEffect(() => {
    const submitResults = async () => {
      if (isQuizFinished && results.length === 10) {
        try {
          await uploadGameData({ questions: results });
        } catch (err) {
          toast.error("Error submitting results:", err);
        }
      }
    };
    submitResults();
  }, [isQuizFinished, results]);

  const gotoDashboard = () => {
    router.push("/dashboard");
  };


  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4 text-center">
              {!started ? (
                <>
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <button className="btn btn-outline-primary" onClick={gotoDashboard}>
                      Dashboard
                    </button>
                    <button className="btn btn-success" onClick={startGame}>
                      Start Game
                    </button>
                  </div>
                  {isQuizFinished && (
                    <div className="mt-4">
                      <h2 className="mb-3">Results</h2>
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
                            {results.map((res, idx) => (
                              <tr key={idx} className={res.selectedAnswer === res.correctAnswer ? "table-success" : "table-danger"}>
                                <td>{res.question}</td>
                                <td>{res.correctAnswer}</td>
                                <td>{res.selectedAnswer ?? "Timeout"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                question && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Question {questionIndex + 1}/10</h5>
                      <div className="badge bg-danger fs-6">Time: {timer}s</div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center mb-5">
                      <div className="display-4 mx-3">{question.a}</div>
                      <div className="display-4 mx-3">{question.op}</div>
                      <div className="display-4 mx-3">{question.b}</div>
                      <div className="display-4 mx-3">=</div>
                      <div className="display-4 mx-3">?</div>
                    </div>

                    <div className="row g-3">
                      {choices.map((c, i) => (
                        <div key={i} className="col-6">
                          <button className="btn btn-outline-primary w-100 py-3 fs-4" onClick={() => handleAnswer(c)}>
                            {c}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
