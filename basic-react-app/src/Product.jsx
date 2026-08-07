import "./Product.css";
import Price from "./Price";
function Product({title,idx}){
    let oldPrices=["12,495","11,900","1,599","599"];
    let newPrices=["8,999","9,199","899","278"];
    let Description=[
        ["8,000 DPI","Nice product"],
        ["intutive surface","designed by apple"],
        ["designed for ipad Pro","very best thing"],
        ["wireless","i love this product"],
    ];
    return(
        <div className="Product">
            <h4>{title}</h4>
            <p>{Description[idx][0]}</p>
            <p>{Description[idx][1]}</p>
            <Price oldPrice={oldPrices[idx]} newPrice={newPrices[idx]}/>
        </div>
    );
}
export default Product;