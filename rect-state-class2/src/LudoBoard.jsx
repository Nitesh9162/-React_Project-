import { useState } from "react"

export default function ludoBoard(){
    let [moves,setMoves]=useState({Blue:0,Red:0,Yellow:0,Green:0})
    let[arr,setArr]=useState(["no moves"]);
    let updateBlue=()=>{
        console.log(`moves.Blue=${moves.Blue}`);
        setMoves((preMoves)=>{
            return{...preMoves,Blue: preMoves.Blue+1}
        });
         
    setArr((prevArr)=>
    {return[...prevArr,"Blue moves"]})
    console.log(arr);
    }
   
    
    return(
        <div>
            <p>Gamae Begin</p>
            <p>{arr}</p>
            <div className="board">
                <p>Blue Moves={moves.Blue}</p>
                <button style={{backgroundColor:"blue"}} onClick={updateBlue}>+1</button>

                <p>Red Moves</p>
                <button>+1</button>

                <p>Yellow Moves</p>
                <button>+1</button>

                <p>GreenMoves</p>
                <button>+1</button>

            </div>
        </div>
    )
}