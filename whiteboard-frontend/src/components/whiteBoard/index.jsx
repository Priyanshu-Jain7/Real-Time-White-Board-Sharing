import { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator= rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool }) => {


    const[IsDrawing,setIsDrawing] = useState(false)

    useEffect(()=>{
        const canvas= canvasRef.current;
        const ctx= canvas.getContext("2d");
        ctxRef.current= ctx;
        canvas.height=window.innerHeight*2;
        canvas.width=window.innerWidth*2;

    },[]);

    useLayoutEffect(()=>{
        const roughCanvas= rough.canvas(canvasRef.current);

        if(elements.length>0){
            ctxRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element)=>{
            if(element.type==="pencil"){
            roughCanvas.linearPath(element.path);
        }
        else if(element.type==="line"){
            roughCanvas.draw(
            roughGenerator.line(
                element.offsetX, 
                element.offsetY, 
                element.width, 
                element.height));
        }
        else if(element.type==="rect"){
            roughCanvas.draw(
            roughGenerator.rectangle(
                element.offsetX, 
                element.offsetY, 
                element.width, 
                element.height));
        }
        
        
        });
    },[elements])

    const handelMouseDown = (e)=>{
        const {offsetX, offsetY}= e.nativeEvent;

        if(tool==="pencil"){
            setElements((prevElements)=>[
             ...prevElements,
            { type: "pencil",
                offsetX,
                offsetY,
                path : [[offsetX,offsetY]],
                storke:"#000000ff",
            },
            ]);
        }
        else if(tool==="line"){
            setElements((prevElements)=>[
                ...prevElements, 
                {
                    type:"line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    storke:"black",
                }
            ])
        }
        else if(tool==="rect"){
            setElements((prevElements)=>[
                ...prevElements, 
                {
                    type:"rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    storke:"black",
                }
            ])
        }
        setIsDrawing(true);
    };


    const handelMouseMove = (e)=>{

        const {offsetX, offsetY}= e.nativeEvent;

        if(IsDrawing)
            {
            if(tool==="pencil")
            {
                const {path} = elements[elements.length -1];
                const newPath = [...path, [offsetX,offsetY]];

            setElements((prevElements)=>
                prevElements.map((ele,index)=>
                    {
                    if(index === elements.length-1){
                        return {
                            ...ele,
                            path: newPath
                        }
                    } else{
                        return ele;
                    }
                })
            );
            }
            else if(tool==="line"){
                setElements((prevElements)=>
                prevElements.map((ele,index)=>{
                    if(index===elements.length -1){
                        return {

                            ...ele,
                            width: offsetX,
                            height: offsetY,
                        };
                    }else{
                        return ele;
                    }
                }));
            }

            else if(tool==="rect"){
                setElements((prevElements)=>
                prevElements.map((ele,index)=>{
                    if(index===elements.length -1){
                        return {

                            ...ele,
                            width: offsetX - ele.offsetX,
                            height: offsetY - ele.offsetY,
                        };
                    }else{
                        return ele;
                    }
                }));
            }
        }        
    };

    const handelMouseUp = (e)=>{
        setIsDrawing(false);
    };

  return (    
    <div 
    onMouseDown={handelMouseDown}
    onMouseMove={handelMouseMove}
    onMouseUp={handelMouseUp}
    className="border border-dark rounded-6 border-3 h-100 w-100">
        
        <canvas ref={canvasRef} />
    </div>
    
    
  );
};

export default WhiteBoard;