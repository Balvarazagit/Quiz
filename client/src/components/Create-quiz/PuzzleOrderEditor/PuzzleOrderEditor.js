import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from 'react-toastify';
import './PuzzleOrderEditor.css';

function PuzzleOrderEditor({ qIndex, question, questions, tempOrders, setTempOrders,setQuestions  }) {

  return (
    <div className="puzzle-order-container">
      <label className="input-label">Arrange the options in correct order</label>

      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          const currentOrder = tempOrders[qIndex] || questions[qIndex].options;
          const items = Array.from(currentOrder);
          const [reordered] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reordered);

          setTempOrders({ ...tempOrders, [qIndex]: items });
        }}
      >
        <Droppable droppableId={`droppable-${qIndex}`}>
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="puzzle-draggable-list"
            >
              {(tempOrders[qIndex] || question.options).map((opt, idx) => (
                <Draggable key={`${qIndex}-${idx}-${opt}`} draggableId={`${qIndex}-${idx}-${opt}`} index={idx}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="puzzle-option"
                    >
                      {opt}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        onClick={() => {
          const updated = [...questions];
          updated[qIndex].correct = [...(tempOrders[qIndex] || updated[qIndex].options)];
          setQuestions(updated);
          toast.success("✅ Correct order set!");
        }}
        className="set-order-btn"
      >
        Set Current Order as Correct
      </button>

      {Array.isArray(question.correct) && question.correct.length > 0 && (
        <p className="correct-preview">
          Correct Order: {question.correct.join(" → ")}
        </p>
      )}
    </div>
  );
}

export default PuzzleOrderEditor;