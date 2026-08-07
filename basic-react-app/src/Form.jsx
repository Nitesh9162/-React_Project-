function handleFormSubmit(){
   // event.preventDefault();
    console.log("form was submitted");
}

export default function Form(){
     <form>
        <input placeholder="write something"/>
        <button onClick={handleFormSubmit}>Submit</button>
        </form>
} 