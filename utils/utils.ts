const quizzes = new Map<string, Quiz>()

export class RoomSettings {
  maxPlayers = 100
  questionCount = 10
  questionTimer = 30000
  questionPoints = 1000

  questionPointsDecayEnabled = true
  questionPointsDecayDelay = 1000
  questionPointsDecayMinimumPoints = 500

  constructor(settings?: Partial<RoomSettings>) {
    Object.assign(this, settings)
  }
}

export class Question {
  /**
   * The question to ask the players.
   */
  private readonly _question: string

  /**
   * The correct answer.
   */
  private readonly _correct: string

  /**
   * The wrong answers.
   */
  private readonly _incorrect: string[]

  /**
   * An optional image url to display with the question.
   */
  private readonly _image?: string

  constructor(question: string, correct: string, incorrect: string[], image?: string) {
    this._question = question
    this._correct = correct
    this._incorrect = incorrect
    this._image = image
  }

  get question() {
    return this._question
  }

  get image() {
    return this._image
  }

  /**
   * Check if the given answer is correct.
   */
  isCorrect(answer: string) {
    return this._correct === answer
  }

  /**
   * Shuffle the answers, so the correct answer is not always in the same position.
   */
  shuffledAnswers() {
    const answers = [this._correct, ...this._incorrect]
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[answers[i], answers[j]] = [answers[j], answers[i]]
    }
    return answers
  }

  /**
   * Get the correct answer.
   */
  correctAnswer() {
    return this._correct
  }
}

export interface QuizOptions {
  questionCount: number
}

export class Quiz {
  protected _questions: Question[]
  _quizOptions: QuizOptions

  constructor(questions: Question[], quizOptions?: QuizOptions) {
    this._questions = questions
    this._quizOptions = quizOptions || {
      questionCount: 10,
    }
  }

  get questions() {
    return this._questions
  }
}

export interface Answer {
  question: string
  answer: string
  image?: string
}

export class GenerativeQuiz extends Quiz {
  _allAnswers: Answer[]
  _filter: (answers: Answer[]) => Answer[]

  constructor(
    allAnswers: Answer[],
    filter: (answers: Answer[]) => Answer[],
    quizOptions?: QuizOptions,
  ) {
    super([], quizOptions)
    this._allAnswers = allAnswers
    this._filter = filter
    this.generateQuestions()
  }

  private generateQuestions() {
    const generatedQuestions: Question[] = []
    const answers = this._filter(this._allAnswers)
    for (let i = 0; i < this._quizOptions.questionCount; i++) {
      const correct = answers[Math.floor(Math.random() * answers.length)]
      const wrong = Array.from({ length: 3 }, () => {
        let answer = answers[Math.floor(Math.random() * answers.length)]
        while (answer === correct) {
          answer = answers[Math.floor(Math.random() * answers.length)]
        }
        return answer
      })
      generatedQuestions.push(
        new Question(
          correct.question,
          correct.answer,
          wrong.map((a) => a.answer),
          correct.image,
        ),
      )
    }
    this._questions = generatedQuestions
  }
}

export function getQuiz(name: string) {
  return quizzes.get(name)
}

export function addQuiz(name: string, quiz: Quiz) {
  quizzes.set(name, quiz)
}

export function removeQuiz(name: string) {
  quizzes.delete(name)
}
