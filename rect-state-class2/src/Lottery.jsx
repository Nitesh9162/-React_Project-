import { useState } from "react";
import{genTicket,sum}from "./helper";
//import"./Lottery.css";
import Ticket from "./Ticket";
export default function Lottery({n=3,winningSum=15}) {
    let[ticket,setTicket]=useState(genTicket(n));
    let isWinning=sum(ticket)==winningSum;
    let buyTicket=()=>{
        setTicket(genTicket(n))
    }
    return( 
        <div>
            <h1>Lottery Game</h1>
            <Ticket ticket={ticket}/>
           {/* <div className="Ticket">
                <span>{ticket[0]}</span>
                <span>{ticket[1]}</span>
                <span>{ticket[2]}</span>
                <span>{ticket[3]}</span>
            </div>*/}
            <button onClick={buyTicket}> buy a  ticket</button>
            <h3>{isWinning && "congrates"}</h3>
        </div>
    )
}