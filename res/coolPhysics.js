//import * as paper from "../paper/dist/paper-full.js";

function toDegrees (angle) {
    return angle * 180 / Math.PI;
}

function toRadians (angle) {
    return angle * Math.PI / 180;
}

var canvas = document.getElementById('renderCanvas');
paper.setup(canvas);

var path = new paper.Path.Circle(new paper.Point(80, 50), 30);
path.strokeColor = 'black';
// Draw the view now:
paper.view.draw();


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
    Bodies = Matter.Bodies;


// create an engine
var engine = Engine.create(),
    world = engine.world;

engine.gravity.x = 0;
engine.gravity.y = 0;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false
    }
});


    // add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
var cursor = Bodies.circle(300,300,50,{
    isStatic:false
});
mouseConstraint.body = cursor;

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

var particleOptions = { 
    friction: 0.05,
    frictionStatic: 0.1,
    render: { visible: true } 
};

// create two boxes and a ground
var boxA = Bodies.rectangle(150, 400, 80, 80, {
    render:{
        sprite:{
            texture:'../pics/jeppeFace.jpg',
            yScale: 0.27,
            xScale: 0.27
        }
    }
});
var boxB = Bodies.rectangle(100, 400, 80, 80, {
    render:{
        sprite:{
            texture:'../pics/yokoFace.jpg',
            yScale: 0.27,
            xScale: 0.27
        }
    }
});
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
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

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, 
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);
Composite.add(engine.world,circles);
//Composite.add(engine.world,anchors);
Composite.add(engine.world,links);
Composite.add(engine.world,cursor)

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);