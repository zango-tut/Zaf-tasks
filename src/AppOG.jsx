import { useState , useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [filter, seTfilter] = useState("All")
  const [firstR, setFirstR] = useState(true)
  useEffect(() => {
    let Localstrng = localStorage.getItem("TODO")
    if(Localstrng!==null){
      setTodos(JSON.parse(localStorage.getItem("TODO")))
    }
  }, [])
  

  const updateLOCL=()=>{
      localStorage.setItem("TODO",JSON.stringify(todos)) 
  }
  
  useEffect(() => {
    if (firstR) {
      setFirstR(false)
      console.log("this is first render")
      return;
    }
    updateLOCL()
  }, [todos])
  

  const handleChange =(e)=>{
    setTodo(e.target.value)
  }
  const handleAdd = ()=>{
    let uid = uuidv4()
    if(todo.trim()!==""){
      setTodos([...todos, {text:todo, isChecked: false , id:uid}])  // Make sure to use 'todos' consistently
      setTodo("")
    }
  }

  const handleCheck =(e)=>{
    let id = e.target.name
    setTodos(todos.map(item=>{
      if (item.id===id) {
        return {...item, isChecked : !item.isChecked }
      }
      return item
    }))
    }
    const handleEdit =(e)=>{
        let id = e.target.name
        setTodos(todos.map(item=>{
          if (item.id===id) {
            setTodo(item.text)
            return {...item, text:todo}
          }
          return item
        }))
    }
    const handleDelete =(e)=>{
      let id = e.target.name
      setTodos(todos.filter(item=>{
        if (item.id===id) {
          return (!todos.includes(item))
        }
        return item
      }))
    }

    const handleSection =(e)=>{
    seTfilter(e.target.name)
    } 
    const newtodo = todos.filter(item=>{ 
      if (filter=="Completed") {
        return item.isChecked
      }
      if (filter=="Remains") {
        return !item.isChecked
      }
      return item
     })
    
  return (  
    <>
      <div className="addTodo flex justify-center m-4 space-x-2 text-xl *:rounded-xl *:p-4">
        <input className='bg-gray-100 w-2/3  ' type="text" value={todo} onChange={handleChange} /><button onClick={handleAdd} className='bg-gray-400 px-3 rounded-sm'>Add</button>
      </div>
      <div className="Sections text-xl shadow-xl bg-gray-500 mx-1 p-2 rounded-2xl ">
        <ul className='flex *:cursor-pointer *:rounded-2xl justify-between *:hover:bg-gray-400 *:p-4 *:transition-all *:bg-gray-200 *:w-full *:mx-1 *:text-center'>
          <a name = "All" onClick={handleSection}>All</a>
          <a name = "Completed" onClick={handleSection}>Completed</a>
          <a name = "Remains" onClick={handleSection}>Remains</a>
        </ul>
      </div>
      <div className="Todos text-center">
        {newtodo.length>0?newtodo.map(items=>{ //Add a unic key
          return (<li key={items.id} className="Todo flex justify-between bg-gray-200 rounded-2xl m-3">
          <div className="text flex items-center">
            <input name={items.id} checked={items.isChecked} onChange={handleCheck} type="checkbox" />
            <h2 className={items.isChecked ? "line-through":""}>{items.text}</h2>
          </div>
          <div className="buttons space-x-3 flex *:bg-gray-300 *:px-2 *:p-1 *:rounded-xl *:cursor-pointer">
            <img name={items.id} onClick={handleEdit} src="svgs/edit.svg" alt="" />
            <img name={items.id} onClick={handleDelete} src="svgs/delete.svg" alt="" />
          </div>
        </li>
        )}):(
          <h1 className='font-bold text-gray-400 text-2xl mt-44'>Empty section</h1>
        )
        }

      </div>
    </>
  )
}

export default App
