import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./PuzzleComponent.css";

const ItemType = "OPTION";

const Option = ({ option, index, moveOption }) => {
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveOption(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`puzzle-option ${isDragging ? "dragging" : ""}`}
    >
      <div className="option-number">{index + 1}.</div>
      {option}
    </div>
  );
};

const PuzzleComponent = ({ options: initialOptions = [], correctAnswer = [], onAnswer, socket, pin, userId, name, timeLeft }) => {
  const [options, setOptions] = useState(initialOptions);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [arrangedOrder, setArrangedOrder] = useState(initialOptions);

  const moveOption = (fromIndex, toIndex) => {
    setOptions(prevOptions => {
      const updated = [...prevOptions];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      setArrangedOrder(updated);
      return updated;
    });
  };

  const handleSubmit = () => {
    const isAnswerCorrect = JSON.stringify(arrangedOrder) === JSON.stringify(correctAnswer);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }

    if (onAnswer) {
      onAnswer(isAnswerCorrect, arrangedOrder);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="puzzle-container">
        <h2 className="puzzle-title">Arrange the Options</h2>
        
        <div className="options-container">
          {options.length > 0 ? (
            options.map((option, index) => (
              <Option
                key={option}
                option={option}
                index={index}
                moveOption={moveOption}
              />
            ))
          ) : (
            <p className="no-options">No options available</p>
          )}
        </div>
        
        <div className="button-container">
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={isCorrect !== null}
          >
            Submit
          </button>
        </div>

        {/* {isCorrect !== null && (
          <div className={`result-feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {!timeLeft && (isCorrect ? (
              <p className="feedback-text">
                ✅ Correct! Score: {score}
              </p>
            ) : (
              <p className="feedback-text">
                ❌ Wrong! Score: {score}
              </p>
            ))}
          </div>
        )} */}
      </div>
    </DndProvider>
  );
};

export default PuzzleComponent;