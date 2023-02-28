//import * as paper from "../paper/dist/paper-full.js";

function toDegrees (angle) {
    return angle * 180 / Math.PI;
}

function toRadians (angle) {
    return angle * Math.PI / 180;
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

class Sketch{
    constructor(){
        
        this.time = 0;
        this.mouse = {
            x:300,y:300
        };
        this.width = 0;
        this.height = 0;
        this.physics();
        //this.initPaper();
        this.addObjects();
        this.mouseEvents();
        this.renderLoop();
    }

    physics(){
        this.engine = Engine.create(),
        this.world = this.engine.world;

        this.engine.gravity.x = 0;
        this.engine.gravity.y = 0;

        // create a renderer
        this.render = Render.create({
            element: document.body,
            canvas: document.getElementById('renderCanvas'),
            engine: this.engine,
            options: {
                wireframes: false,
                background: 'transparent',
                wireframeBackground: 'transparent'
            }
        });
        this.width = this.render.canvas.width;
        this.height = this.render.canvas.height;
        // run the renderer
        Render.run(this.render);

        // create runner
        this.runner = Runner.create();

        // run the engine
        Runner.run(this.runner, this.engine);
    }

    initPaper(){
        // Get a reference to the canvas object
        var canvas = document.getElementById('paperCanvas');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var myCircle = new paper.Path.Circle(new paper.Point(100, 70), 50);
        myCircle.fillColor = 'black';
        // Draw the view now:
        paper.view.draw();
    }

    addCircle(radius, points, posX, posY){
        var center = Bodies.circle(500,300,50,{
            isStatic:true
        });
    
        var circles = [];
        var anchors = [];
        var links = [];

        var step = toDegrees(points)/360;
    
        for(let i = 0; i < points; i++){
            var x = radius*Math.cos(i/step);
            var y = radius*Math.sin(i/step);
    
            circles.push(
                Bodies.circle(
                    x*10+posX,
                    y*10+posY,
                    10,
                    {
                        density: 0.05,
                        restitution: 0.8
                    }
                )
            )
    
            anchors.push(
                Bodies.circle(
                    x*10+posX,
                    y*10+posY,
                    10,{
                        isStatic:true
                    }
                )
            )
        };
    
    
        for(let i = 0; i < points; i++){
            let next = circles[i+1]?circles[i+1]:circles[0]
            let nextnext = circles[(i+2)%points];
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:anchors[i],
                    stiffness:0.01,
                    damping: 0.1
                })
            );
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:next,
                    stiffness:0.8
                })
            );
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:nextnext,
                    stiffness:0.4
                })
            );
        };

        Composite.add(this.world,circles);
        Composite.add(this.world,links);
        return {posX,posY}
    }

    addObjects(){
        this.cursor = Bodies.circle(200,300,35,{
            isStatic:false,
            label: "test",
            restitution: 0.1,
            slop: 0.01,
            mass: 10000,
            render:{
                visible: true
            }
        });
        var center = Bodies.circle(500,300,50,{
            isStatic:true
        });

        var smallCircleCenter;
        var bigCircleCenter;
        
        bigCircleCenter = this.addCircle(20,30,500,300);

        smallCircleCenter = this.addCircle(14,20,200,500);
        
        /*this.mouse = Mouse.create(this.render.canvas);
        this.mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            //body: cursor,
            constraint: {
                // allow bodies on mouse to rotate
                stiffness: 0.1,
                angularStiffness: 0.1,
                render: {
                    visible: false
                }
            }
        });
            
        Composite.add(this.world, this.mouseConstraint);
        this.render.mouse = this.mouse;*/

        Composite.add(this.world,this.cursor)
    }

    mouseEvents(){
        this.render.canvas.addEventListener('mousemove', (event) => 
        {
            //console.log(event)
            //this.mouse.x = event.clientX - this.cursor.positionPrev.x;
            //this.mouse.y = event.clientY - this.cursor.positionPrev.y;
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
            console.log("Before move: ", this.mouse);
            //console.log("MouseX: "+ this.mouse.position.x + " Y: " + this.mouse.position.y)
            //console.log("ClientX: "+ event.clientX + " Y: " + event.clientY)
            //console.log("CursorX: "+ this.cursor.position.x + " Y: " + this.cursor.position.y)
        });
    }

    renderLoop(){
        this.time += 0.05;
        Body.setPosition(this.cursor,{
            x: this.mouse.x,
            y: this.mouse.y
        });
        console.log("After move: ", this.mouse);
        window.requestAnimationFrame(this.renderLoop.bind(this));
        //console.log(this.mouse);
    }
}
let sketch = new Sketch();

onclick = (event) => {console.log(sketch.mouseConstraint)};
//onmousemove = (event) => {//console.log(event.clientX)
 //                           mouse.x = event.clientX - cursor.positionPrev.x;
  //                          mouse.y = event.clientY - cursor.positionPrev.y;
   //                         console.log("Mouse: "+ mouse.position.x)
    //                        renderLoop();};

//renderLoop()