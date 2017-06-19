// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//     ENVIRONNEMENT DEFINITION
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var
width = window.innerWidth, height = window.innerHeight,
circle = { //Virtual circle settings
    ray: 150,
    x: width / 2,
    y: height / 2
},
settings = { //Web settings
    n_div: 7,
    n_lev: 4,
    flex: 5/7
},
LINE = {
    strokeColor: 'black',
    strokeWidth: 20,
    fillWidth: 10,
    fill: 'white'
};
SQUARE = {
    strokeColor: '#00',
    strokeWidth: 15,
    fill: 'rgb(255, 75, 75)'
}
settings.l_div = 2*Math.PI*circle.ray / settings.n_div;

var
points = new Array(settings.n_lev),
stroke_lines = [],
curve_lines = [];

for (k = 1; k <= settings.n_lev; k++) {
    points[k] = new Array(settings.n_div);
    for(i = 0; i < settings.n_div; i++) {
        var Angle = i * (settings.l_div / circle.ray);
        points[k][i] = {
            x: circle.x - (k / settings.n_lev) * circle.ray * Math.sin(Angle),
            y: circle.y - (k / settings.n_lev) * circle.ray * Math.cos(Angle),
            angle: Angle
        };
    }
}

var
stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
}),
layer = new Konva.Layer();


// %%%%%%%%%%%%%%%%%%%%%%%%%%
//     GRAPHIC FUNCTIONS
// %%%%%%%%%%%%%%%%%%%%%%%%%%

var rect = new Konva.Rect({
    x: circle.x - circle.ray * settings.flex,
    y: circle.y - circle.ray * settings.flex,
    width: 2*circle.ray * settings.flex,
    height: 2*circle.ray * settings.flex,
    fill: SQUARE.fill,
    stroke: SQUARE.strokeColor,
    strokeWidth: SQUARE.strokeWidth,
    shadowBlur : 40,
    opacity : 1
});
layer.add(rect);

stroke_lines.outer = [];
stroke_lines.inner = [];
curve_lines.outer = [];
curve_lines.inner = [];

for(var k = 1; k <= settings.n_lev; k++) { //Génération des interlignes (par niveau de toile)
    curve_lines.outer[k] = [];
    curve_lines.inner[k] = [];

    for(var i = 0; i < settings.n_div; i++) {
        var A = i * (settings.l_div / circle.ray);
        var curvePoint = {
            x: circle.x - settings.flex * (k / settings.n_lev) * circle.ray * Math.sin(A + (settings.l_div / circle.ray) / 2),
            y: circle.y - settings.flex * (k / settings.n_lev) * circle.ray * Math.cos(A + (settings.l_div / circle.ray) / 2)
        };
        if(k == settings.n_lev) {
            stroke_lines.outer[i] = new Konva.Line({
                points: [circle.x, circle.y, points[settings.n_lev][i].x, points[settings.n_lev][i].y],
                stroke: LINE.strokeColor,
                strokeWidth: LINE.strokeWidth,
                lineCap: 'round',
                lineJoin: 'round'
            });
            layer.add(stroke_lines.outer[i]);
        }

        curve_lines.outer[k][i] = new Konva.Line({
            points: [points[k][i].x, points[k][i].y,
                    curvePoint.x,curvePoint.y,
                    points[k][(i+1)%points[k].length].x, points[k][(i+1)%points[k].length].y],
            stroke: LINE.strokeColor,
            strokeWidth: LINE.strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
            tension : .5
        });
        layer.add(curve_lines.outer[k][i]);
    }
}

for(var k = 1; k <= settings.n_lev; k++) { //Génération des interlignes (par niveau de toile)
    console.log('test');
    for(var i = 0; i < settings.n_div; i++) {
        var A = i * (settings.l_div / circle.ray);
        var curvePoint = {
            x: circle.x - settings.flex * (k / settings.n_lev) * circle.ray * Math.sin(A + (settings.l_div / circle.ray) / 2),
            y: circle.y - settings.flex * (k / settings.n_lev) * circle.ray * Math.cos(A + (settings.l_div / circle.ray) / 2)
        };

        if(k == settings.n_lev) {
            stroke_lines.inner[i] = new Konva.Line({
                points: [circle.x, circle.y, points[settings.n_lev][i].x, points[settings.n_lev][i].y],
                stroke: LINE.fill,
                strokeWidth: LINE.fillWidth,
                lineCap: 'round',
                lineJoin: 'round'
            });
            layer.add(stroke_lines.inner[i]);
        }

        curve_lines.inner[k][i] = new Konva.Line({
            points: [points[k][i].x, points[k][i].y,
                    curvePoint.x,curvePoint.y,
                    points[k][(i+1)%points[k].length].x, points[k][(i+1)%points[k].length].y],
            stroke: LINE.fill,
            strokeWidth: LINE.fillWidth,
            lineCap: 'round',
            lineJoin: 'round',
            tension : .5
        });
        layer.add(curve_lines.inner[k][i]);
    }
}

stage.add(layer);

var period = 2000;
var anim = new Konva.Animation(function(frame) {
    var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
    rect.shadowBlur(scale*50);
    for (var i = 0; i < stroke_lines.inner.length; i++) {
        stroke_lines.inner[i].scaleY(scale);
        layer.draw();
    }
}, layer);
