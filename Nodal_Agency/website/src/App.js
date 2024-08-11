import './App.css'
import './components/display.css'
import { useEffect, useState } from 'react'
import Person from './components/display'
import axios from 'axios'
import diary from './services/postman'

// import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([

  ]) 
  const hook = () => {
    diary.GetAll()
    .then(person => setPersons(person))
  }
  useEffect(hook,[])
  const [newurl, setnewurl] = useState('')
  const [newimgURL, setnewimgurl] = useState('')
  const [newcomment,setnewcomment] = useState('')
  const [show,setshow] = useState('')
  const AddData = (event) => {
    event.preventDefault()
    const personobject = {
      url : newurl,
      imgurl : newimgURL,
      comment : newcomment
    }
    {(persons.filter(function(person) {return person.url === newurl}).length  > 0) ? (alert(personobject.url + " already exists")) : axios.post('http://192.168.234.96:3001/persons',personobject).then(respond=>{setPersons(persons.concat(respond.data))})
    setnewurl("")
    setnewimgurl("")
    setnewcomment("")}
  }
  const handleurlchange = (event) => {
    console.log(event.target.value)
    setnewurl(event.target.value)
    
  }
  const handleimgurlchange = (event) => {
    console.log(event.target.value)
  
    setnewimgurl(event.target.value)
  }
  const handlecommentchange = (event) => {
    console.log(event.target.value)
  
    setnewcomment(event.target.value)
  }
  const handlefilterchange = (event) => {
    setshow(event.target.value)
  }
  // const Delete = (id,name) => {
  //   if (window.confirm("Do you reall wanna delete  " +name))
  //     console.log("person to be deleted :" + id)
  //     const url = "http://localhost:3001/persons/" + id
  //     axios.delete(url)
  //     .then(
  //     axios.get('http://localhost:3001/persons')
  //     .then(response=>{
  //       console.log("promise fulfilled")
  //       setPersons(response.data)
  //     }
  //     )
  //     )
  // }
  // const personstoshow = persons.filter(function(person) {return person.comment.includes(show)})
  const personstoshow = persons.filter((person) => person.comment && person.comment.includes(show));

  console.log(personstoshow)
 
  // return (
  //   <div id="app-container">
  //     <h2 className="heading">Add url</h2>
  //     <form onSubmit={AddData}>
  //       <table>
  //         <tbody>
  //           <tr>
  //             <td className="subheading">url:</td>
  //             <td>
  //               <input value={newurl} onChange={handleurlchange} />
  //             </td>
  //           </tr>
  //           <tr>
  //             <td className="subheading">imgurl:</td>
  //             <td>
  //               <input value={newimgURL} onChange={handleimgurlchange} />
  //             </td>
  //           </tr>
  //           <tr>
  //             <td className="subheading">comment:</td>
  //             <td>
  //               <input value={newcomment} onChange={handlecommentchange} />
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //       <div id='add'>
  //         <button type="submit">Submit</button>
  //       </div>
  //     </form>
  //     <h2 className="heading">Filter</h2>
  //     <form>
  //       <div className="subheading">
  //         filter images shown with class : <input value={show} onChange={handlefilterchange} />
  //       </div>
  //     </form>
  //     <h2 className="database-heading">DATABASE</h2>
  //     {personstoshow.map((x) => (
  //       <Person key={x.id} persons={x} />
  //     ))}
  //   </div>
  // );
  return (
    <div id="app-container">
      <h2 className="heading">Add url</h2>
      <form onSubmit={AddData}>
        <table className="person-table"> {/* Add the 'person-table' class to the table */}
          <tbody>
            <tr>
              <td className="subheading">url:</td>
              <td>
                <input value={newurl} onChange={handleurlchange} />
              </td>
            </tr>
            <tr>
              <td className="subheading">imgurl:</td>
              <td>
                <input value={newimgURL} onChange={handleimgurlchange} />
              </td>
            </tr>
            <tr>
              <td className="subheading">comment:</td>
              <td>
                <input value={newcomment} onChange={handlecommentchange} />
              </td>
            </tr>
          </tbody>
        </table>
        <div id='add'>
          <button type="submit">Submit</button>
        </div>
      </form>
      <h2 className="heading">Filter</h2>
      <form>
        <div className="subheading" id='filter'>
          Filter images shown by class : <input value={show} onChange={handlefilterchange} />
        </div>
      </form>
      <h2 className="database-heading">DATABASE</h2>
      {personstoshow.map((x) => (
        <Person key={x.id} persons={x} />
      ))}
    </div>
  );
}

export default App
