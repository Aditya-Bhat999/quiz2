# AI Quiz - PowerPoint Style Web Application

A modern, web-based quiz application that automatically progresses through questions with a countdown timer, designed to mimic PowerPoint-style presentations.

## Features

- **10 AI-related questions** extracted from the quiz.txt file
- **10-second countdown timer** for each question
- **Automatic slide progression** - no manual navigation required
- **Shuffled answer options** - different order each time for variety
- **Comprehensive score tracking** with detailed results
- **10 marks per question** - total possible score of 100
- **Modern, responsive design** with smooth animations
- **Multiple choice format** with visual feedback
- **Mobile-friendly** responsive layout

## How It Works

1. **Welcome Screen**: Click "Start Quiz" to begin
2. **Question Slides**: Each slide displays a question with 4 shuffled answer options
3. **Timer**: 10-second countdown timer in the top-right corner
4. **Auto-progression**: Slides automatically advance when timer reaches zero
5. **Answer Selection**: Click any answer to see immediate feedback
6. **Score Tracking**: Correct answers earn 10 marks each
7. **Completion**: Quiz ends after all 10 questions with detailed score card

## Score Card Features

The final score card displays:
- **Total Score**: Out of 100 (10 marks per question)
- **Percentage**: Overall performance percentage
- **Correct Answers**: Number of right attempts
- **Wrong Answers**: Number of incorrect attempts
- **Total Questions**: Always 10
- **Marks per Question**: Always 10

## File Structure

- `index.html` - Main HTML structure with all quiz slides
- `styles.css` - Modern CSS styling with animations, responsive design, and score card styles
- `script.js` - JavaScript logic for quiz functionality, timer management, option shuffling, and score tracking
- `quiz.txt` - Source file containing the original quiz questions and answers

## Technical Implementation

- **Pure HTML/CSS/JavaScript** - No external dependencies
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Animations** for smooth slide transitions
- **Timer Management** using setInterval with cleanup
- **Fisher-Yates Algorithm** for shuffling answer options
- **Score Tracking** with real-time updates
- **Event Handling** for user interactions

## Usage

1. Open `index.html` in any modern web browser
2. Click "Start Quiz" to begin
3. Answer questions or wait for auto-progression
4. Each correct answer earns 10 marks
5. Complete all 10 questions
6. View detailed score card
7. Click "Take Quiz Again" to restart with new shuffled options

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Customization

The quiz data is stored in the `quizData` array in `script.js`. To modify questions:
1. Edit the `quizData` array
2. Ensure each question object has: `question`, `answers`, `correctAnswer`, and `timer` properties
3. The `correctAnswer` should be the 0-based index of the correct answer
4. The `timer` should always be set to 10 for consistency

## Features in Detail

- **Option Shuffling**: Answer choices are randomly shuffled for each quiz attempt
- **Timer Animation**: Timer changes color and pulses when time is running low (≤5 seconds)
- **Slide Transitions**: Smooth fade-in/fade-out animations between slides
- **Answer Feedback**: Visual indicators for correct/incorrect answers
- **Score Calculation**: Real-time score tracking with 10 marks per correct answer
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Accessibility**: Clear visual hierarchy and readable typography
- **No Answer Handling**: Questions left unanswered are marked as incorrect 