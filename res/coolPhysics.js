// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create(),
    world = engine.world;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false
    }
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80, {
    render:{
        sprite:{
            texture:'../pics/jeppeFace.jpg',
            yScale: 0.27,
            xScale: 0.27
        }
    }
});
var boxB = Bodies.rectangle(450, 50, 80, 80, {
    render:{
        sprite:{
            texture:'../pics/yokoFace.jpg',
            yScale: 0.27,
            xScale: 0.27
        }
    }
});
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);