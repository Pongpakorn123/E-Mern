import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true, // Optional: Adds an index for better query performance
  },
  questions: [
    {
      question: { type: String, required: true },
      options: {
        type: [String], // Allow flexible number of options
        validate: [arrayLimit, '{PATH} must have at least 2 options'], // Ensure at least 2 options
        required: true,
      },
      correctOption: { type: String, required: true }, // Correct answer
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

// Validation function to ensure there are at least 2 options
function arrayLimit(val) {
  return val.length >= 2;
}

export default mongoose.model('Quiz', quizSchema);
