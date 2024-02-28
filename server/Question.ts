interface Question {
  uuid: `${string}-${string}-${string}-${string}-${string}`
  question: string
  answers: string[]
  correctAnswer: string
  image: string
  creationDate: Date
}
