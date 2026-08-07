function printHello(){
    console.log("hello!");
}
function printBye(){
    console.log("bye")
}
export default function Button(){
    return(
        <div>
            <button onClick={printHello}>Click me</button>
            <button onClick={printBye}>Click me</button>
        </div>
    )
}