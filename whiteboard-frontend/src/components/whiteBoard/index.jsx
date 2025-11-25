import { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator= rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool, color }) => {


    const[IsDrawing,setIsDrawing] = useState(false)

    useEffect(()=>{
        const canvas= canvasRef.current;
        const ctx= canvas.getContext("2d");
        
        canvas.height=window.innerHeight;
        canvas.width=window.innerWidth;
        ctx.strokeStyle=color;
        ctx.linWidth=2;
        ctx.lineCap="round";
        ctxRef.current= ctx;
    },[]);

    useEffect(()=>{
        ctxRef.current.strokeStyle=color;
    },[color]);

    useLayoutEffect(()=>{
        const roughCanvas= rough.canvas(canvasRef.current);

        if(elements.length>0){
            ctxRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element)=>{
            if(element.type==="pencil"){
            roughCanvas.linearPath(element.path,
                {
                    stroke:element.stroke,
                    storkeWidth: 5,
                    roughness: 0,
                });
        }
        else if(element.type==="line"){
            roughCanvas.draw(
            roughGenerator.line(
                element.offsetX, 
                element.offsetY, 
                element.width, 
                element.height,
                {
                    stroke:element.stroke,
                    storkeWidth: 5,
                    roughness:0,
                }
            ));
        }
        else if(element.type==="rect"){
            roughCanvas.draw(
            roughGenerator.rectangle(
                element.offsetX, 
                element.offsetY, 
                element.width, 
                element.height,
                {
                    stroke:element.stroke,
                    storkeWidth: 5,
                    roughness:0,
                }
            ));
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
                stroke:color,
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
                    stroke:color,
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
                    stroke:color,
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