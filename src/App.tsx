import { useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Sun, Shield, Eye, Stethoscope, RotateCcw, MessageCircle, Sparkles } from 'lucide-react'

// Types
interface Question {
  step: number
  criterion: string
  title: string
  options: {
    img: string
    label: string
    correct: boolean
  }[]
  explanation: string
}

// Questions data with 2 images for each criterion (including B)
const QUESTIONS: Question[] = [
  {
    step: 1,
    criterion: 'A',
    title: 'Critère A — Asymétrie',
    options: [
      { img: '/critereA-suspect.jpg', label: '', correct: true },
      { img: '/critereA-sain.jpg', label: '', correct: false },
    ],
    explanation: 'La lésion suspecte présente une forme asymétrique — les deux moitiés sont différentes. Un grain de beauté sain est symétrique avec des moitiés similaires.'
  },
  {
    step: 2,
    criterion: 'B',
    title: 'Critère B — Bordure',
    options: [
      { img: '/critereB-suspect.jpg', label: '', correct: true },
      { img: '/critereB-sain.jpg', label: '', correct: false },
    ],
    explanation: 'Les bords de la lésion suspecte ne sont pas réguliers — contours irréguliers, dentelés, en zigzag ou flous. Un grain sain a des bords nets et réguliers.'
  },
  {
    step: 3,
    criterion: 'C',
    title: 'Critère C — Couleur',
    options: [
      { img: '/critereC-suspect.jpg', label: '', correct: false },
      { img: '/critereC-sain.jpg', label: '', correct: true },
      
    ],
    explanation: 'La lésion suspecte présente plusieurs couleurs (brun clair, foncé, noir, rouge) avec répartition irrégulière. Un grain sain a une couleur uniforme.'
  },
  {
    step: 4,
    criterion: 'D',
    title: 'Critère D — Diamètre',
    options: [
     
      { img: '/critereD-sain.jpg', label: 'Diamètre < 6mm', correct: false },
       { img: '/critereD-suspect.jpg', label: 'Diamètre > 6mm', correct: true },
    ],
    explanation: 'Une lésion suspecte dépasse souvent 6mm de diamètre. Un grain de beauté sain est généralement plus petit et stable dans le temps.'
  },
  {
    step: 5,
    criterion: 'E',
    title: 'Critère E — Évolution',
    options: [
      { img: '/critereE-suspect.jpg', label: 'Après 2 ans', correct: true },
      { img: '/critereE-sain.jpg', label: 'Après 2 ans', correct: false },
    ],
    explanation: 'Tout changement dans le temps (taille, forme, couleur, épaisseur) est suspect. Consultez un dermatologue en cas de doute !'
  },
]

// Navigation Component
function Navigation({ activePage, setActivePage }: { activePage: string; setActivePage: (page: string) => void }) {
  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'conclusion', label: 'Résultats' },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent">MelanoCheck</span>
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activePage === item.id
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

// Nurse Bubble Component - BD style
function NurseBubble({ message, type = 'info' }: { message: string; type?: 'info' | 'success' | 'error' }) {
  const bubbleColors = {
    info: 'bg-white border-teal-200',
    success: 'bg-green-50 border-green-300',
    error: 'bg-red-50 border-red-300'
  }

  return (
    <div className="flex items-end gap-3">
      <div className="relative flex-shrink-0">
        <img
          src="/nurse-cartoon.png"
          alt="Infirmière"
          className="w-24 h-32 object-contain drop-shadow-lg"
        />
      </div>
      <div className={`relative ${bubbleColors[type]} border-2 rounded-2xl rounded-bl-sm p-4 shadow-lg max-w-md`}>
        <div className="absolute -left-3 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-inherit border-b-8 border-b-transparent"></div>
        <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

// Home Component
function Home({ onStartQuiz, progress }: { onStartQuiz: () => void; progress: number }) {
  const [introOpen, setIntroOpen] = useState(true)

  const abcdeItems = [
    { letter: 'A', word: 'Asymétrie', color: 'from-rose-400 to-rose-500' },
    { letter: 'B', word: 'Bordure', color: 'from-orange-400 to-orange-500' },
    { letter: 'C', word: 'Couleur', color: 'from-amber-400 to-amber-500' },
    { letter: 'D', word: 'Diamètre', color: 'from-emerald-400 to-emerald-500' },
    { letter: 'E', word: 'Évolution', color: 'from-teal-400 to-teal-500' },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-teal-50 via-white to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 text-sm font-medium">Formation interactive</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Détection précoce<br />du mélanome
              </h1>
              <p className="text-white/85 text-lg mb-6">Apprenez la règle ABCDE pour identifier les signes d'alerte</p>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 inline-block">
                <p className="text-sm text-white/80 mb-2">Progression du quiz</p>
                <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-110"></div>
              <img
                src="/nurse-cartoon.png"
                alt="Infirmière"
                className="relative w-48 h-64 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-xl border-0">
          <button
            onClick={() => setIntroOpen(!introOpen)}
            className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 transition-all"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">À propos de ce jeu</h2>
            </div>
            {introOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
          </button>
          
          {introOpen && (
            <CardContent className="px-6 py-6 bg-white">
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <NurseBubble message="Bienvenue ! Je suis là pour vous aider à apprendre la détection précoce du mélanome. C'est un cancer de la peau très grave, surtout à un stade avancé." />
                
                <div className="ml-28 mt-4 space-y-3">
                  <p>
                    Ce jeu éducatif vise à former les infirmiers sur les signes qui permettent 
                    de détecter précocement le mélanome, un cancer qui touche les mélanocytes 
                    (cellules productrices de pigments).
                  </p>
                  <p>
                    L'apparition d'une nouvelle lésion cutanée ou la modification d'un grain 
                    de beauté connu peuvent alerter sur la présence d'un mélanome.
                  </p>
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-gray-800 mb-4 text-center">La règle ABCDE</p>
                  <div className="grid grid-cols-5 gap-3">
                    {abcdeItems.map((item) => (
                      <div key={item.letter} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center text-white shadow-lg transform hover:scale-105 transition-transform`}>
                        <div className="text-3xl font-bold">{item.letter}</div>
                        <div className="text-xs font-medium mt-1">{item.word}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Start Button Area */}
        <div className="mt-8">
          <Card className="p-6 shadow-xl border-teal-100">
            <NurseBubble message="Prêt à tester vos connaissances ? Vous allez choisir entre deux images à chaque étape. Bonne chance !" />
            
            <div className="mt-6 text-center">
              <Button
                onClick={onStartQuiz}
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-12 py-6 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Commencer le quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Quiz Component
function Quiz({
  currentQ,
  setCurrentQ,
  score,
  setScore,
  onFinish,
}: {
  currentQ: number
  setCurrentQ: (q: number) => void
  score: number
  setScore: (s: number) => void
  onFinish: () => void
}) {
  const [answered, setAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const q = QUESTIONS[currentQ]

  const handleSelect = (idx: number) => {
    if (answered) return
    
    setSelectedOption(idx)
    setAnswered(true)
    
    if (q.options[idx].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
      setAnswered(false)
      setSelectedOption(null)
    } else {
      onFinish()
    }
  }

  const progress = ((currentQ) / QUESTIONS.length) * 100
  const isCorrect = selectedOption !== null && q.options[selectedOption].correct

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-teal-50 to-white pb-8">
      {/* Quiz Header */}
      <div className="bg-white shadow-sm border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Étape {currentQ + 1} / {QUESTIONS.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{q.title}</h2>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
              q.criterion === 'A' ? 'bg-gradient-to-br from-rose-400 to-rose-500' :
              q.criterion === 'B' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
              q.criterion === 'C' ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
              q.criterion === 'D' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' :
              'bg-gradient-to-br from-teal-400 to-teal-500'
            }`}>
              {q.criterion}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-teal-100" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6 text-lg font-medium">Quelle image représente un mélanome suspect ?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {q.options.map((opt, idx) => {
            const isSelected = selectedOption === idx
            const isCorrectOption = opt.correct
            const showCorrect = answered && isCorrectOption
            const showWrong = answered && isSelected && !isCorrectOption

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`group relative bg-white rounded-3xl overflow-hidden border-4 transition-all duration-300 text-left shadow-lg ${
                  showCorrect
                    ? 'border-green-400 ring-4 ring-green-200'
                    : showWrong
                    ? 'border-red-400 ring-4 ring-red-200'
                    : isSelected
                    ? 'border-teal-400 ring-4 ring-teal-200'
                    : 'border-transparent hover:border-teal-300 hover:shadow-xl'
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={opt.img}
                    alt={opt.label}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Result Badge */}
                  {showCorrect && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <CheckCircle className="w-5 h-5" /> Correct
                    </div>
                  )}
                  {showWrong && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <XCircle className="w-5 h-5" /> Incorrect
                    </div>
                  )}
                </div>
                
                {opt.label && (
                  <div className="p-5">
                    <p className={`text-base font-semibold text-center ${
                      showCorrect ? 'text-green-600' : showWrong ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {opt.label}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation Panel with Nurse */}
        {answered && (
          <div className="mt-8">
            <Card className={`overflow-hidden shadow-xl ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
              <div className={`p-6 ${isCorrect ? 'bg-gradient-to-r from-green-50 to-white' : 'bg-gradient-to-r from-red-50 to-white'}`}>
                <NurseBubble 
                  message={q.explanation} 
                  type={isCorrect ? 'success' : 'error'}
                />
              </div>
            </Card>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-12 py-5 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              {currentQ < QUESTIONS.length - 1 ? 'Question suivante →' : 'Voir les résultats 🎉'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Conclusion Component
function Conclusion({ score, total, onReplay }: { score: number; total: number; onReplay: () => void }) {
  const stars = score >= 5 ? '★★★★★' : score >= 4 ? '★★★★☆' : score >= 3 ? '★★★☆☆' : score >= 2 ? '★★☆☆☆' : '★☆☆☆☆'
  const percentage = (score / total) * 100
  
  const getMessage = () => {
    if (score === 5) return "Excellent ! Vous êtes un expert de la détection du mélanome !"
    if (score >= 4) return "Très bien ! Vous avez une bonne connaissance des signes d'alerte."
    if (score >= 3) return "Pas mal ! Continuez à vous entraîner pour perfectionner vos connaissances."
    return "Continuez à apprendre ! La détection précoce sauve des vies."
  }

  const preventionItems = [
    { icon: Sun, text: 'Éviter l\'exposition aux heures les plus intenses (10h-16h)' },
    { icon: Shield, text: 'Porter des vêtements protecteurs (chapeau, lunettes de soleil)' },
    { icon: Eye, text: 'Appliquer une crème solaire à large spectre SPF 50+' },
    { icon: Stethoscope, text: 'Pratiquer l\'auto-surveillance avec la règle ABCDE' },
    { icon: CheckCircle, text: 'Consulter régulièrement un dermatologue' },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-teal-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Score Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 rounded-3xl p-8 text-white text-center mb-6 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold mb-2">Félicitations !</h2>
            <div className="text-5xl mb-4">{stars}</div>
            <div className="text-6xl font-bold mb-2">{score}/{total}</div>
            <p className="text-white/80 text-lg">bonnes réponses</p>
            
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <p className="text-white font-medium">{percentage}% de réussite</p>
            </div>
          </div>
        </div>

        {/* Nurse Message */}
        <Card className="mb-6 shadow-xl border-teal-100">
          <CardContent className="p-6">
            <NurseBubble message={getMessage()} type="success" />
          </CardContent>
        </Card>

        {/* Treatment Section */}
        <Card className="mb-4 shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Traitement du mélanome</h3>
          </div>
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Devant la suspicion d'un mélanome, il faut adresser le patient à un dermatologue 
              qui réalisera un examen clinique complet avec un dermatoscope.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Le traitement repose sur la chirurgie et, selon le stade, les thérapies ciblées et l'immunothérapie.
            </p>
          </CardContent>
        </Card>

        {/* Prevention Section */}
        <Card className="mb-6 shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Prévention</h3>
          </div>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {preventionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="leading-relaxed pt-2">{item.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Thank You Section */}
        <Card className="mb-6 shadow-lg border-teal-100">
          <CardContent className="p-6">
            <NurseBubble message="Merci d'avoir joué ! Vous êtes maintenant mieux équipé pour identifier les signes du mélanome. Partagez vos connaissances, ça peut sauver des vies !" />
          </CardContent>
        </Card>

        {/* Replay Button */}
        <Button
          onClick={onReplay}
          className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-5 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-5 h-5" />
          Rejouer
        </Button>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [activePage, setActivePage] = useState('home')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)

  const handleStartQuiz = () => {
    setCurrentQ(0)
    setScore(0)
    setActivePage('quiz')
  }

  const handleFinish = () => {
    setActivePage('conclusion')
  }

  const handleReplay = () => {
    setCurrentQ(0)
    setScore(0)
    setActivePage('home')
  }

  const progress = ((currentQ) / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      
      {activePage === 'home' && (
        <Home onStartQuiz={handleStartQuiz} progress={progress} />
      )}
      
      {activePage === 'quiz' && (
        <Quiz
          currentQ={currentQ}
          setCurrentQ={setCurrentQ}
          score={score}
          setScore={setScore}
          onFinish={handleFinish}
        />
      )}
      
      {activePage === 'conclusion' && (
        <Conclusion
          score={score}
          total={QUESTIONS.length}
          onReplay={handleReplay}
        />
      )}
    </div>
  )
}

export default App
