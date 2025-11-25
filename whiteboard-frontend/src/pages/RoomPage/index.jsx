import { useRef, useState } from "react";
import "./index.css"
import WhiteBoard from "../../components/whiteBoard";


const RoomPage = () => {

    const canvasRef=useRef(null);
    const ctxRef=useRef(null)

    const [tool,setTool]= useState("pencil");
    const [color,setColor]= useState("black");

    const[elements, setElements]= useState([]);
    const [history,setHistory]= useState([]);

    const handelClearCanvas =()=>{
      const canvas=canvasRef.current;
      const ctx= canvas.getContext("2d");
      ctx.fillRect="white";

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setElements([]);

    }

    const undo =()=>{
      setHistory((prevHistory)=>[...prevHistory,elements[elements.length -1]]);
      setElements((prevElements)=>
        prevElements.slice(0, prevElements.length - 1)
      );

    };

    const redo=()=>{
      setElements((prevElements)=>[...prevElements, history[history.length-1]]);

      setHistory((prevHistory)=>
      prevHistory.slice(0, prevHistory.length - 1));

    };


  return (
    <div className="row">
      <h1 className="text-center py-4" >WhiteBoard Sharing Room <span className="text-primary">[Users Online :0]</span></h1>
      <div className="col-md-10 mx-auto px-5 mt-4 mb-5 d-flex align-items-center justify-content-center">
        <div className="d-flex col-md-3 justify-content-between gap-1">
            <div className="d-flex gap-1 align-items-center">
                <label htmlFor="pencil" >pencil</label>
                <input 
                type="radio" 
                name="tool" 
                className="my-0" 
                id="pencil" 
                value="pencil" 
                checked={tool==="pencil"}
                onChange={(e)=>setTool(e.target.value)} 
                />
            </div>
            <div className="d-flex gap-1 align-items-center">
                <label htmlFor="line" className="my-0">line</label>
                <input 
                type="radio" 
                name="tool" 
                className="my-0" 
                id="line" 
                value="line"
                checked={tool==="line"} 
                onChange={(e)=>setTool(e.target.value)}
                />
            </div>
            <div className="d-flex gap-1 align-items-center">
                <label htmlFor="rect" className="my-0">Rectangle</label>
                <input 
                type="radio"
                name="tool"
                className="my-0"
                id="rect"
                value="rect"
                checked={tool==="rect"}
                onChange={(e)=>setTool(e.target.value)} 
                />
            </div>
            
            
            
        </div>
        <div className="col-md-3 mx-auto">
            <div className="align-items-center d-flex justify-content-center">
                <label htmlFor="color">Select Color:</label>
                <input 
                type="color"
                id="color"
                className="mt-1 ms-3"
                value={color}
                onChange={(e)=>setColor(e.target.value)}
                />
            </div>
        </div>
        <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary mt-1"
            disabled={elements.length === 0}
            onClick={()=>undo()}
            >
              UNDO
            </button>

            <button className="btn btn-outline-primary mt-1"
            disabled = {history.length < 1}
            onClick={()=>redo()}
            >
              REDO
            </button>
        </div>
        <div className="col-md-3">
            <button className="btn btn-danger" onClick={handelClearCanvas} >Clear Canvas</button>
        </div>
      </div>

      <div className="col-md-10 mx-auto mt-4 canvas-box">
        <WhiteBoard 
        canvasRef={canvasRef} 
        ctxRef={ctxRef} 
        elements={elements}
        setElements={setElements}
        color={color}
        tool={tool}
        />
      </div>
    </div>
  );
};

export default RoomPage;