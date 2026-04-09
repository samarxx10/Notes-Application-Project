import { useState } from 'react'


const App = () => {
  const [title , setTitle] = useState('')
  const [details , setDetails] = useState('')

  const [task , setTask] = useState([])

  const submitHandler = (e)=>{
    e.preventDefault()
    
    const copyTask = [...task];

    copyTask.push({title,details})
    
    setTask(copyTask)
    console.log(task)
   

    setTitle('')
    setDetails('')
  }

  const deleteNotes = (idx)=>{
    const copyTask = [...task];
    
    copyTask.splice(idx,1)
    setTask(copyTask)
  }
  return (
    <div className='h-screen lg:flex  bg-black text-white '>
      <form onSubmit={(e)=>{
        submitHandler(e)
      }} className='flex gap-4 lg:w-1/2 flex-col items-start p-10'>
        <h1 className='text-xl font-bold'>Add Notes</h1>
        
       <input  
        type="text"
         placeholder='Enter nodes Heading'
         className='px-5 font-medium w-full py-2 border-2 outline-none rounded'
         value={title}
         onChange={(e)=>{
          setTitle(e.target.value)
         }}
         />
         
        <textarea 
        type="text" 
        placeholder='Write details' 
        className='px-5 font-medium h-32 w-full py-2 flex items-start flex-row border-2 outline-none rounded'
        value={details}
         onChange={(e)=>{
          setDetails(e.target.value)
         }}
        />

        <button className='bg-white active:scale-95 font-medium w-full px-5 py-2 outline-none rounded text-black '>Add Notes</button>
        
      </form>
      <div className=' lg:w-1/2 lg:border-l-2 p-10'>
        <h1 className='text-xl font-bold'>Your Notes</h1>
        <div className='flex flex-wrap items-start justify-start gap-5 h-[90%] overflow-auto mt-5'>
         {task.map(function(elem,idx){

          return <div key={idx} className=" flex justify-between flex-col items-start relative h-52 w-40 rounded-xl text-black bg-cover pt-9 pb-4 px-4 bg-[url('https://static.vecteezy.com/system/resources/previews/037/152/677/non_2x/sticky-note-paper-background-free-png.png')]">
            <div>
            <h3 className='leading-tight text-lg  font-bold'>{elem.title}</h3>
            <p className='mt-2 leading-tight font-semibold text-xs text-gray-600 '>{elem.details}</p>
            </div>
            <button onClick={() => {
               deleteNotes(idx)
            }} className='w-full bg-red-500 cursor-pointer active:scale-95 py-1 text-xs rounded-xl font-bold text-white'>Delete</button>
          </div>
        })}          
        </div>
      </div>
    </div>
  ) 
}

export default App

