import { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket }) => {
    const [img, setImg] = useState(null);

    useEffect(() => {
        socket.on("whiteBoardDataResponse", (data) => {
            setImg(data.imgURL);
        });

        return () => {
            socket.off("whiteBoardDataResponse");
        };
    }, [socket]);

    if (!user?.presenter) {
        return (
            <div className="border border-dark rounded-6 border-3 h-100 w-100">
                <img 
                    src={img} 
                    alt="WhiteBoard is shared by Presenter"
                    style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain"
                    }} 
                />
            </div>
        );
    }

    const [IsDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Make canvas responsive
        const resizeCanvas = () => {
            canvas.height = window.innerHeight * 0.7;
            canvas.width = window.innerWidth * 0.8;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2; // Fixed typo: was linWidth
            ctx.lineCap = "round";
            ctxRef.current = ctx;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = color;
        }
    }, [color]);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            const roughCanvas = rough.canvas(canvasRef.current);

            if (elements.length > 0) {
                ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }

            elements.forEach((element) => {
                if (element.type === "pencil") {
                    roughCanvas.linearPath(element.path, {
                        stroke: element.stroke,
                        strokeWidth: 5,
                        roughness: 0,
                    });
                } else if (element.type === "line") {
                    roughCanvas.draw(
                        roughGenerator.line(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.height,
                            {
                                stroke: element.stroke,
                                strokeWidth: 5,
                                roughness: 0,
                            }
                        )
                    );
                } else if (element.type === "rect") {
                    roughCanvas.draw(
                        roughGenerator.rectangle(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.height,
                            {
                                stroke: element.stroke,
                                strokeWidth: 5,
                                roughness: 0,
                            }
                        )
                    );
                }
            });

            const canvaImage = canvasRef.current.toDataURL();
            socket.emit("whiteBoardData", canvaImage);
        }
    }, [elements, socket]);

    const handelMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ]);
        } else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                }
            ]);
        } else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                }
            ]);
        }
        setIsDrawing(true);
    };

    const handelMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (IsDrawing) {
            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];

                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newPath
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handelMouseUp = (e) => {
        setIsDrawing(false);
    };

    return (
        <div
            onMouseDown={handelMouseDown}
            onMouseMove={handelMouseMove}
            onMouseUp={handelMouseUp}
            className="border border-dark rounded-6 border-3 h-100 w-100"
            style={{ overflow: 'hidden' }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default WhiteBoard;