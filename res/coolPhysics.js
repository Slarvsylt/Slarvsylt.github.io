//import * as paper from "../paper/dist/paper-full.js";

function toDegrees (angle) {
    return angle * 180 / Math.PI;
}

function toRadians (angle) {
    return angle * Math.PI / 180;
}
// Only executed our code once the DOM is ready.
//window.onload = function() {
//    
//}


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
        this.physics();
        this.addObjects();
        this.initPaper();
        this.renderLoop();
        this.mouseEvents();
    }

    physics(){
        this.engine = Engine.create(),
        this.world = this.engine.world;

        this.engine.gravity.x = 0;
        this.engine.gravity.y = 0;

        // create a renderer
        this.render = Render.create({
            //element: document.body,
            canvas: document.getElementById('renderCanvas'),
            engine: this.engine,
            options: {
                wireframes: false,
                background: 'transparent',
                wireframeBackground: 'transparent'
            }
        });

        // run the renderer
        Render.run(this.render);

        // create runner
        this.runner = Runner.create();

        // run the engine
        Runner.run(this.runner, this.engine);
    }

    initPaper(){
        // Get a reference to the canvas object
        var canvas = document.getElementById('renderCanvas');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var path = new paper.Path();
        // Give the stroke a color
        path.strokeColor = 'black';
        var start = new paper.Point(100, 100);
        // Move to start and draw a line from there
        path.moveTo(start);
        // Note that the plus operator on Point objects does not work
        // in JavaScript. Instead, we need to call the add() function:
        path.lineTo(start.add([ 200, -50 ]));
        // Draw the view now:
        paper.view.draw();
    }

    renderLoop(){
        Body.translate(this.cursor,{
            x: this.mouse.x,
            y: this.mouse.y
        })
        window.requestAnimationFrame(this.renderLoop.bind(this));
    }

    addObjects(){
        this.mouse = Mouse.create(this.render.canvas);
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
        //console.log(mouseConstraint.body);
    
        
    
        // keep the mouse in sync with rendering
        this.render.mouse = this.mouse;

        this.cursor = Bodies.circle(200,300,30,{
            isStatic:false,
            label: "test",
            render:{
                visible: true
            }
        });
        var center = Bodies.circle(500,300,50,{
            isStatic:true
        });
    
        var circles = [];
        var anchors = [];
        var links = [];
        var radius = 20;
        var number = 39;
    
        for(let i = 0; i < number; i++){
            var x = radius*Math.cos(toDegrees(i)/360);
            var y = radius*Math.sin(toDegrees(i)/360);
    
            circles.push(
                Bodies.circle(
                    x*10+500,
                    y*10+300,
                    10,
                    {
                        density: 0.005,
                        restitution: 0
                    }
                )
            )
    
            anchors.push(
                Bodies.circle(
                    x*10+500,
                    y*10+300,
                    10,{
                        isStatic:true
                    }
                )
            )
        };
    
    
        for(let i = 0; i < number; i++){
            var x = radius*Math.cos(toDegrees(i));
            var y = radius*Math.sin(toDegrees(i));
            let next = circles[i+1]?circles[i+1]:circles[0]
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:anchors[i],
                    stiffness:0.01
                })
            );
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:next,
                    stiffness:0.9
                })
            );
            links.push(
                Constraint.create({
                    bodyA:circles[i],
                    bodyB:center,
                    stiffness:0.01
                })
            );
        };
        Composite.add(this.world, this.mouseConstraint);
        Composite.add(this.world,circles);
        //Composite.add(engine.world,anchors);
        Composite.add(this.world,links);
        Composite.add(this.world,this.cursor)
    }

    mouseEvents(){
        this.render.canvas.addEventListener('mousemove', (event) => 
        {
            //console.log(render.canvas)
            this.mouse.x = event.clientX - this.cursor.position.x;
            this.mouse.y = event.clientY - this.cursor.position.y;
            console.log("Mouse: "+ this.mouse.position.x)
        });
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