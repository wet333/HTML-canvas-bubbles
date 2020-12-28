function init() {

    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let totalParticles = (canvas.width * canvas.height)/5000;
    let particlesArray = [];

    let mousePos = {
        x : undefined, y: undefined,
    };

    //MOUSE INTERACTIVITY-----------------------------------------------------------
    window.addEventListener("mousemove",(e)=>{
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    //CREACION DE LAS PARTICULAS---------------------------------------------------
    function createParticles(number) {
        for (let i = 0; i < totalParticles; i++) {
            particlesArray.push(new Particle);
        }
    }

    //RESIZING THE CANVAS-----------------------------------------------------------
    window.addEventListener("resize",()=>{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    //DISTANCIA ENTRE 2 PUNTOS------------------------------------------------------
    function dist2p(mx,my,p2x,p2y) {
        let dist = Math.sqrt( ((p2x-mx)**2) + ((p2y-my)**2) )
        return dist;
    }

    class Particle {
        constructor(x,y){
            this.baseSize = 5 + Math.random() * 10;
            this.maxSize = this.baseSize * 5;
            this.size = this.baseSize;
            this.velY = (10/this.size) * this.randomPN();
            this.velX = (10/this.size) * this.randomPN();
            this.fillColor = this.randomColor("warm","f0");
    
            //RANDOM SPAWN POINT
            //the offset is for prevent bubbles spawn in the borders and not bounce
            if (x === undefined) {
                this.x = (canvas.width*0.05) + (Math.random()*canvas.width*0.85) ;
            }else{
                this.x = x;
            }
            if (y === undefined) {
                this.y = (canvas.height*0.1) + (Math.random()*canvas.height*0.80) ;
            }else{
                this.y = y;
            }
        }
    
        //COLOR GENERATION
        randomColor(opc,opacity){
            
            let res = 0;
            const coldColours = ["#B3E5FC","#4DD0E1","#00ACC1","#03A9F4","#1976D2","#0D47A1","#64B5F6"];
            const warmColors = ["#C62828","#F44336","#FF5722","#FB8C00","#FFA000","#FBC02D","#FFEE58"];
    
            switch (opc) {
                case "rand":
                    res = (Math.random()*16777216).toString(16);
                    return "#"+res[0]+res[1]+res[2]+res[3]+res[4]+res[5]+opacity;
    
                case "cold":
                    return coldColours[parseInt(Math.random()*coldColours.length)] + opacity;
    
                case "warm":
                    return warmColors[parseInt(Math.random()*warmColors.length)] + opacity;
            
                default:
                    return "#f0f0f0";
            }
        }
    
        update(){
    
            if ( (this.y + this.size) > canvas.height || (this.y - this.size) < 0) {
                this.velY = -this.velY;
            }
            if ( (this.x - this.size) < 0 || (this.x + this.size) > canvas.width) {
                this.velX = -this.velX;
            }
            this.x += this.velX;
            this.y += this.velY;
    
            let distance = dist2p(mousePos.x,mousePos.y,this.x,this.y);
            const distanceDetection = 100;
    
            if( distance <= distanceDetection && this.size < this.maxSize ){
                this.size += 1;
            }else if(distance > distanceDetection && this.baseSize < this.size ){
                this.size -= 1;
            };
    
        }
    
        draw(){
            ctx.fillStyle = this.fillColor;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false);
            ctx.closePath();
            ctx.fill();
        }
    
        randomPN(){
            let num = Math.random() * 10;
            if(num < 5){
                return -1;
            }else{
                return 1;
            }
        }
    }
    
    function animationLoop() {
    
        ctx.fillStyle = "rgb(29 29 29 / 1.0)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
    
        particlesArray.forEach(part => {
            part.update();
            part.draw();
        });
    
        requestAnimationFrame(animationLoop);
    }

    createParticles(totalParticles);
    animationLoop();
}