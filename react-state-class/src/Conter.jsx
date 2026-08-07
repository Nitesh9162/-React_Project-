import { useState } from "react";

export default function counter(){
    let [count,setCount]=useState(0);
    console.log("component was rendered");
    console.log(`count=${count}`);
    let incCount=()=>{
        setCount(count+1);
        console.log(`inside incCount, count=${count}`);
    }
    return(
        <div>
            <h3>count={count}</h3>
            <button onClick={incCount}>submit</button>
        </div>
    )
}