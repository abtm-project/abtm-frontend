// src/components/Quiz.jsx
// Basic Quiz component for knowledge testing (Phase 2)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Quiz = () => {
  const { quizId } = useParams();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Load quiz details
      const quizResponse = await api.get(`/quizzes/${quizId}`);
      setQuiz(quizResponse.data);

      // Load questions
      const questionsResponse = await api.get(`/quizzes/${quizId}/questions`);
      setQuestions(questionsResponse.data);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.warning(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        userId: user.id,
        answers: answers
      });

      setResult(response.data);
      toast.success(`Quiz completed! Score: ${response.data.percentage.toFixed(1)}%`);
      setSubmitting(false);
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return <div className="text-center py-12 text-gray-600">Quiz not found</div>;
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          
          <div className={`text-6xl font-bold mb-4 ${
            result.percentage >= 70 ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.percentage.toFixed(1)}%
          </div>

          <div className="text-gray-600 mb-6">
            Score: {result.score} / {result.totalPoints} points
          </div>

          {result.percentage >= 70 ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              ✅ Congratulations! You passed the quiz.
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              📚 Keep studying! You can retake this quiz.
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600 mb-4">{quiz.description}</p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">📝 {questions.length} questions</span>
          <span>✅ Passing score: {quiz.passingScore}%</span>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{question.questionText}</p>
                <p className="text-sm text-gray-500 mt-1">({question.points} points)</p>
              </div>
            </div>

            <div className="ml-11 space-y-2">
              {question.questionType === 'MULTIPLE_CHOICE' && (
                <>
                  {question.optionA && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="A"
                        checked={answers[question.id] === 'A'}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>A) {question.optionA}</span>
                    </label>
                  )}
                  {question.optionB && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="B"
                        checked={answers[question.id] === 'B'}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>B) {question.optionB}</span>
                    </label>
                  )}
                  {question.optionC && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="C"
                        checked={answers[question.id] === 'C'}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>C) {question.optionC}</span>
                    </label>
                  )}
                  {question.optionD && (
                    <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value="D"
                        checked={answers[question.id] === 'D'}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>D) {question.optionD}</span>
                    </label>
                  )}
                </>
              )}

              {question.questionType === 'TRUE_FALSE' && (
                <>
                  <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="TRUE"
                      checked={answers[question.id] === 'TRUE'}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mr-3"
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="FALSE"
                      checked={answers[question.id] === 'FALSE'}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mr-3"
                    />
                    <span>False</span>
                  </label>
                </>
              )}

              {question.questionType === 'SHORT_ANSWER' && (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {questions.length}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length !== questions.length}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'} ✅
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
