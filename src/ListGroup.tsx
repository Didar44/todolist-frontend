import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

interface Props{
  items:string[];
  heading:string;
  onSelecteditem:(item:string)=>void;
}


function ListGroup(props:Props) {
  let items = ["New york", "Tokyo", "Moscow", "Astana"];
  
 const [select,setselectedindex] = useState(-1);
 

  return (
    <Fragment>
      <h1>List of cities</h1>
      
      <ul className="list-group">
        {items.map((item,index) => (
          <li
            className={select ===index ? 'list-group-item active' : 'list-group-item'}
            key={item}
            onClick={()=>{setselectedindex(index);}}
          >
            {item}
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
export default ListGroup;
