import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './Components/FlashcardList';
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
    .then(res => {
      setCategories(res.data.trivia_categories)
    })
  },[])

  const decodeString = string => {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = string
    return textArea.value
  }

  const handleSubmit = e => {
    e.preventDefault()
    axios.get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)), 
          answer
        ]

        return {
          id:`${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer,
          options: options.sort(() => Math.random() - 0.5)
        }
      }))
    })
  }

  const renderForm = () => (
    <form className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
          {categories.map(category => <option key={category.id} value={category.id}>{category.name} </option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="amount">Number of Questions</label>
        <input type="number" id="amount" min="1" step="1" defaultValue={5} ref={amountEl}/>
      </div>
      <div className="form-group">
        <button className="button">Generate</button>
      </div>
    </form>
  )

  return (
    <>
      {renderForm()}
      <div className="container">
        <FlashcardList flashcards={flashcards}/>
      </div>
    </>
  );
} 

export default App;