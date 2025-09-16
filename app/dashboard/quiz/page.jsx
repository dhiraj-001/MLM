"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/services/api"
import ProtectedRoute from "@/components/protected-route"
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Award, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  RefreshCw,
  RotateCw,
  Timer,
  DollarSign
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function QuizPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const [timerActive, setTimerActive] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [alreadySubmittedToday, setAlreadySubmittedToday] = useState(false)
  const [todayResults, setTodayResults] = useState(null)
  const [userData, setUserData] = useState(null)
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  
  // Get user profile data to check balance
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return
      
      try {
        const profileData = await userService.getProfile(token)
        setUserData(profileData.user)
        
        // Check if user has minimum required balance
        if (profileData.user?.balance < 30) {
          setInsufficientBalance(true)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }
    
    fetchUserData()
  }, [token])
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }
  
  // Timer effect
  useEffect(() => {
    let interval
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerActive) {
      // Auto-submit when time runs out
      handleSubmitQuiz()
    }
    
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])
  
  // Fetch quiz questions
  const fetchQuizQuestions = async () => {
    setLoading(true)
    try {
      if (userData?.balance < 30) {
        setInsufficientBalance(true)
        setLoading(false)
        return
      }
      
      const response = await userService.getQuizQuestions(token)
      console.log("Quiz data:", response)
      
      if (response.completed) {
        // User already completed today's quiz
        setAlreadySubmittedToday(true)
        setTodayResults(response.results)
      } else if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions)
      } else {
        setError("No questions available for today's quiz.")
      }
    } catch (err) {
      console.error("Failed to fetch quiz questions:", err)
      if (err.message?.includes("insufficient balance")) {
        setInsufficientBalance(true)
      } else {
        setError(err.message || "Failed to load quiz. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch on component mount
  useEffect(() => {
    if (token) {
      fetchQuizQuestions()
    }
  }, [token, userData])
  
  // Start the quiz
  const startQuiz = () => {
    if (userData?.balance < 30) {
      setInsufficientBalance(true)
      return
    }
    
    setQuizStarted(true)
    setTimerActive(true)
    // Initialize empty answers object
    const initialAnswers = {}
    questions.forEach((q, index) => {
      initialAnswers[index] = null
    })
    setAnswers(initialAnswers)
  }
  
  // Handle answer selection
  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }
  
  // Move to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }
  
  // Move to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }
  
  // Submit quiz answers
  const handleSubmitQuiz = async () => {
    setTimerActive(false)
    setSubmitting(true)
    
    try {
      // Format answers for submission - convert from object to array
      const formattedAnswers = Object.values(answers)
      
      const response = await userService.submitQuiz(formattedAnswers, token)
      console.log("Quiz submission response:", response)
      
      setQuizResults(response)
      setQuizCompleted(true)
    } catch (err) {
      console.error("Failed to submit quiz:", err)
      setError(err.message || "Failed to submit quiz. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }
  
  // Check if all questions are answered
  const allQuestionsAnswered = () => {
    return questions.length > 0 && 
      Object.keys(answers).length === questions.length && 
      !Object.values(answers).includes(null)
  }
  
  const currentQuestion = questions[currentQuestionIndex]
  const progressPercentage = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/dashboard" 
              className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Daily Quiz Challenge</h1>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading today's quiz...</p>
            </div>
          ) : insufficientBalance ? (
            // Insufficient balance message
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16 mr-4">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse blur-md"></div>
                    <div className="relative bg-background rounded-full w-full h-full flex items-center justify-center border-2 border-amber-500">
                      <DollarSign className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Minimum Balance Required</h2>
                    <p className="text-muted-foreground">You need at least $30 balance to participate in the quiz</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-muted/30 rounded-lg p-6 mb-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Your Current Balance</h3>
                  <div className="text-3xl font-bold text-amber-500 mb-2">
                    ${userData?.balance?.toFixed(2) || "0.00"}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-2 w-full max-w-md bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-300 ease-out"
                        style={{ width: `${Math.min((userData?.balance / 30) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs whitespace-nowrap">$30 min</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-center">
                    Please deposit at least ${(30 - (userData?.balance || 0)).toFixed(2)} more to participate in the daily quiz challenge and earn rewards.
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <Link href="/dashboard/deposit">
                      <button className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                        Deposit Funds
                      </button>
                    </Link>
                    
                    <Link href="/dashboard">
                      <button className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors">
                        Return to Dashboard
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Quiz</h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
              <button 
                onClick={fetchQuizQuestions}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : alreadySubmittedToday ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16 mr-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-md"></div>
                    <div className="relative bg-background rounded-full w-full h-full flex items-center justify-center border-2 border-primary">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Quiz Already Completed</h2>
                    <p className="text-muted-foreground">You've already completed today's quiz challenge</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Your Score</h3>
                    <div className="text-3xl font-bold text-primary">
                      {todayResults?.score || 0}/{todayResults?.total || 5}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Correct answers</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Reward Earned</h3>
                    <div className="text-3xl font-bold text-green-500">
                      ${todayResults?.reward?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2% of your balance</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Accuracy</h3>
                    <div className="text-3xl font-bold">
                      {todayResults?.score 
                        ? Math.round((todayResults.score / todayResults.total) * 100) 
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Answer accuracy</p>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/dashboard">
                    <button className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                      Return to Dashboard
                    </button>
                  </Link>
                </div>
                
                <div className="text-center mt-6 text-muted-foreground text-sm">
                  <p>Come back tomorrow for a new quiz challenge!</p>
                </div>
              </div>
            </motion.div>
          ) : quizCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16 mr-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-md"></div>
                    <div className="relative bg-background rounded-full w-full h-full flex items-center justify-center border-2 border-primary">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Quiz Completed!</h2>
                    <p className="text-muted-foreground">Great job on completing today's challenge</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Your Score</h3>
                    <div className="text-3xl font-bold text-primary">
                      {quizResults?.score || 0}/{questions.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Correct answers</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Reward Earned</h3>
                    <div className="text-3xl font-bold text-green-500">
                      ${quizResults?.reward?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2% of your balance</p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-1">Accuracy</h3>
                    <div className="text-3xl font-bold">
                      {quizResults?.score 
                        ? Math.round((quizResults.score / questions.length) * 100) 
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Answer accuracy</p>
                  </div>
                </div>
                
                {quizResults?.newBalance && (
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-1">Updated Balance</h3>
                      <div className="text-2xl font-bold text-primary">
                        ${quizResults.newBalance.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-center mt-6">
                  <Link href="/dashboard">
                    <button className="px-6 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                      Return to Dashboard
                    </button>
                  </Link>
                </div>
                
                <div className="text-center mt-6 text-muted-foreground text-sm">
                  <p>You've completed today's quiz. Come back tomorrow for a new challenge!</p>
                </div>
              </div>
            </motion.div>
          ) : !quizStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
            >   
              <div className="p-6 md:p-8 border-b border-border/30 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="relative w-20 h-20 mx-auto md:mx-0 md:mr-6 mb-4 md:mb-0">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-md"></div>
                    <div className="relative bg-background rounded-full w-full h-full flex items-center justify-center border-2 border-primary">
                      <HelpCircle className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">Daily Knowledge Quiz</h2>
                    <p className="text-muted-foreground">Test your knowledge and earn rewards</p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-medium">
                      Minimum $30 balance required to participate
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-7">
                    Your current balance: ${userData?.balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Quiz Rules</h3>
                  <ul className="space-y-3 ml-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Today's quiz contains {questions.length} multiple-choice questions</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>You have 3 minutes to complete the quiz</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Earn up to $5 in rewards based on your score</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>You can only take the quiz once per day</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={startQuiz}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center"
                  >
                    Start Quiz <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : ( 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-lg border border-border/50 shadow-sm overflow-hidden"
            >
              {/* Quiz Header */}
              <div className="p-4 border-b border-border/30 flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <div className="mt-1 w-[200px] h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Timer className="h-4 w-4 text-primary" />
                  <span className={`font-mono font-medium ${timeLeft < 30 ? 'text-red-500' : ''}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              {/* Question */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h2>
                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(currentQuestionIndex, index)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        answers[currentQuestionIndex] === index
                          ? "border-primary bg-primary/5 hover:bg-primary/10"
                          : "border-border/40 hover:border-primary/30 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                          answers[currentQuestionIndex] === index
                            ? "bg-primary text-white"
                            : "bg-muted/70 text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-md border border-border/40 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={goToNextQuestion}
                      className="px-4 py-2 bg-primary/90 text-white rounded-md hover:bg-primary transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting || !allQuestionsAnswered()}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitting ? (
                        <>
                          <RotateCw className="animate-spin mr-2 h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Quiz"
                      )}
                    </button>
                  )}
                </div>
                {/* Question Navigation Pills */}
                <div className="mt-8 flex flex-wrap gap-2 justify-center">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        idx === currentQuestionIndex
                          ? "bg-primary text-white"
                          : answers[idx] !== undefined && answers[idx] !== null
                            ? "bg-primary/20 text-primary"
                            : "bg-muted/70 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
