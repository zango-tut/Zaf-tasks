import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState("All")
  const [firstR, setFirstR] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  useEffect(() => {
    const savedTodos = localStorage.getItem("TODO")
    if(savedTodos !== null){
      setTodos(JSON.parse(savedTodos))
    }
  }, [])
  
  const updateLocalStorage = () => {
    localStorage.setItem("TODO", JSON.stringify(todos)) 
  }
  
  useEffect(() => {
    if (firstR) {
      setFirstR(false)
      return
    }
    updateLocalStorage()
  }, [todos])
  
  const handleChange = (e) => {
    setTodo(e.target.value)
  }
  
  const handleAdd = () => {
    if(todo.trim() !== ""){
      if(editingId) {
        // Update existing todo
        setTodos(todos.map(item => 
          item.id === editingId ? {...item, text: todo} : item
        ))
        setEditingId(null)
      } else {
        // Add new todo
        setTodos([...todos, {
          text: todo,
          isChecked: false,
          id: uuidv4()
        }])
      }
      setTodo("")
    }
  }

  const handleCheck = (e) => {
    const id = e.target.name
    setTodos(todos.map(item => 
      item.id === id ? {...item, isChecked: !item.isChecked} : item
    ))
  }
  
  const handleEdit = (e) => {
    const id = e.currentTarget.name
    const todoToEdit = todos.find(item => item.id === id)
    setTodo(todoToEdit.text)
    setEditingId(id)
  }
  
  const handleDelete = (e) => {
    const id = e.currentTarget.name
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleSection = (e) => {
    setFilter(e.currentTarget.name)
  } 
  
  const filteredTodos = todos.filter(item => { 
    if (filter === "Completed") return item.isChecked
    if (filter === "Remains") return !item.isChecked
    return true
  })
    
  return (  
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-4 md:p-8">
          {/* Add/Edit Todo Section */}
          <div className="flex flex-col space-y-2 mb-6">
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-base"
              type="text" 
              value={todo} 
              onChange={handleChange} 
              placeholder={editingId ? "Edit your task..." : "Add a new task..."}
            />
            <button 
              onClick={handleAdd} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-base"
            >
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
          
          {/* Filter Sections - Mobile responsive */}
          <div className="mb-6 bg-gray-100 rounded-xl p-1">
            <div className="grid grid-cols-3 gap-1">
              <button 
                name="All" 
                onClick={handleSection}
                className={`py-2 px-1 text-sm md:text-base md:py-3 rounded-lg transition ${filter === "All" ? 'bg-gray-600 text-white' : 'bg-white hover:bg-gray-200'}`}
              >
                All
              </button>
              <button 
                name="Completed" 
                onClick={handleSection}
                className={`py-2 px-1 text-sm md:text-base md:py-3 rounded-lg transition ${filter === "Completed" ? 'bg-gray-600 text-white' : 'bg-white hover:bg-gray-200'}`}
              >
                Completed
              </button>
              <button 
                name="Remains" 
                onClick={handleSection}
                className={`py-2 px-1 text-sm md:text-base md:py-3 rounded-lg transition ${filter === "Remains" ? 'bg-gray-600 text-white' : 'bg-white hover:bg-gray-200'}`}
              >
                Remains
              </button>
            </div>
          </div>
          
          {/* Todos List */}
          <div className="space-y-2">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center space-x-3 flex-grow min-w-0">
                    <input 
                      name={item.id} 
                      checked={item.isChecked} 
                      onChange={handleCheck} 
                      type="checkbox" 
                      className="h-5 w-5 min-h-5 min-w-5 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    <span className={`truncate ${item.isChecked ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {item.text}
                    </span>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button 
                      name={item.id} 
                      onClick={handleEdit}
                      className="p-1 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
                      aria-label="Edit task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      name={item.id} 
                      onClick={handleDelete}
                      className="p-1 md:p-2 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-full transition"
                      aria-label="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 md:py-10">
                <h1 className="text-xl md:text-2xl font-bold text-gray-400">No tasks found</h1>
                <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">
                  {filter === "All" ? "Add your first task to get started" : 
                   filter === "Completed" ? "No completed tasks yet" : "All tasks are completed!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App