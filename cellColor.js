class CellColor {
    // static availableColors = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#800080", "#FFA500", "#FFC0CB", "#A52A2A", "#808080", "#00FFFF", "#40E0D0", "#EE82EE", "#FF6347", "#4B0082", "#FFD700", "#C0C0C0", "#00FF7F", "#DDA0DD", "#000080", "#FF4500", "#008000", "#DC143C", "#FFA07A", "#E6E6FA"];
    static availableColors = ["yellow","blue","red","green","gold"];

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocityX = Math.random() * 2 - 1; // Velocidade inicial aleatória
        this.velocityY = Math.random() * 2 - 1;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.attractionColor = null;
        this.attractionIndex = 0;
        this.repulsionColor = null;
        this.repulsionIndex = 0;

        this.attractionRepulsionForces = {};

        for (const otherColor of CellColor.availableColors) {
            if (otherColor !== this.color) {
                // Atribui índices aleatórios (positivos para atração, negativos para repulsão)
                this.attractionRepulsionForces[otherColor] = Math.random() * 2 - 1;
            }
        }
    }

    // aqui cada uma tem apenas um fã e um hater
    static setAttractionRepulsionRules(cells) {
        const colorFamilies = {};

        for (const cell of cells) {
            if (!(cell.color in colorFamilies)) {
                colorFamilies[cell.color] = {
                    attractionColor: null,
                    repulsionColor: null,
                    attractionIndex: 0,
                    repulsionIndex: 0,
                };
            }
        }

        const colors = Object.keys(colorFamilies);

        for (const color of colors) {
            const availableColors = colors.filter(c => c !== color);

            // Verifica se a cor já tem uma atração, se não, atribui uma aleatória
            if (colorFamilies[color].attractionColor === null) {
                const attractionColor = availableColors[Math.floor(Math.random() * (colors.length - 1))];
                colorFamilies[color].attractionColor = attractionColor;
            }

            // Remove a cor de atração da lista de cores disponíveis
            const attractionIndex = availableColors.indexOf(colorFamilies[color].attractionColor);
            availableColors.splice(attractionIndex, 1);

            // Atribui a cor restante como cor de repulsão
            colorFamilies[color].repulsionColor = availableColors[0];

            // Atribui índices
            colorFamilies[color].attractionIndex = Math.random() * 0.5 + 0.5; // Entre 0.5 e 1.0
            colorFamilies[color].repulsionIndex = Math.random() * 0.5 + 0.5; // Entre 0.5 e 1.0
        }

        for (const cell of cells) {
            const { attractionColor, repulsionColor, attractionIndex, repulsionIndex } = colorFamilies[cell.color];
            cell.attractionColor = attractionColor;
            cell.repulsionColor = repulsionColor;
            cell.attractionIndex = attractionIndex;
            cell.repulsionIndex = repulsionIndex;
        }
        console.table(colorFamilies)
    }

    // Aqui uma mesma cor pode ser odiada ou adorada por varias outras
    static setAttractionRepulsionRules_(cells) {
        const colorFamilies = {};

        for (const cell of cells) {
            if (!(cell.color in colorFamilies)) {
                colorFamilies[cell.color] = {
                    attractionColor: null,
                    repulsionColor: null,
                    attractionIndex: 0,
                    repulsionIndex: 0,
                };
            }
        }

        const colors = Object.keys(colorFamilies);

        for (const color of colors) {
            const availableColors = colors.filter(c => c !== color);
            //const availableColors = colors;
            const attractionColor = availableColors[Math.floor(Math.random() * (colors.length - 1))];
            const repulsionColor = availableColors.filter(c => c !== attractionColor)[0];

            colorFamilies[color].attractionColor = attractionColor;
            colorFamilies[color].repulsionColor = repulsionColor;
            colorFamilies[color].attractionIndex = Math.random() * 0.5 + 0.5; // Entre 0.5 e 1.0
            colorFamilies[color].repulsionIndex = Math.random() * 0.5 + 0.5; // Entre 0.5 e 1.0
        }

        for (const cell of cells) {
            const { attractionColor, repulsionColor, attractionIndex, repulsionIndex } = colorFamilies[cell.color];
            cell.attractionColor = attractionColor;
            cell.repulsionColor = repulsionColor;
            cell.attractionIndex = attractionIndexr;
            cell.repulsionIndex = repulsionIndex;
        }

        console.table(colorFamilies)

    }

    draw(ctx) {
        // Desenha a célula como um pequeno círculo na tela
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    _draw(ctx) {
        const triangleSize = 24; // Tamanho do triângulo
        const baseWidth = 2; // Largura da base

        // Calcula os pontos do triângulo alongado
        const angle = Math.atan2(this.velocityY, this.velocityX);

        const x1 = this.x + triangleSize * Math.cos(angle);
        const y1 = this.y + triangleSize * Math.sin(angle);

        const x2 = this.x + baseWidth * Math.cos(angle - (Math.PI / 2));
        const y2 = this.y + baseWidth * Math.sin(angle - (Math.PI / 2));

        const x3 = this.x + baseWidth * Math.cos(angle + (Math.PI / 2));
        const y3 = this.y + baseWidth * Math.sin(angle + (Math.PI / 2));

        // Desenha o triângulo alongado
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        // Preenche o triângulo com a cor da célula
        ctx.fillStyle = this.color;
        ctx.fill();
        //this._draw(ctx)
    }

    applyForces(cells) {
        // Aplica forças de atração e repulsão com base na tabela
        for (const otherCell of cells) {
            if (otherCell !== this) {
                const distanceX = otherCell.x - this.x;
                const distanceY = otherCell.y - this.y;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                if (distance < 50) { // Raio de interação
                    if (otherCell.color === this.attractionColor) {
                        // Aplica força de atração
                        this.accelerationX += (distanceX / distance) * this.attractionIndex;
                        this.accelerationY += (distanceY / distance) * this.attractionIndex;
                    } else if (otherCell.color === this.repulsionColor) {
                        // Aplica força de repulsão
                        this.accelerationX -= (distanceX / distance) * this.repulsionIndex;
                        this.accelerationY -= (distanceY / distance) * this.repulsionIndex;
                    }
                }
            }
        }
    }

    move() {
        // Atualiza a velocidade com base na aceleração e move a célula
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Verifica se a célula saiu da tela e a faz aparecer na margem oposta
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        if (this.x < 0) {
            this.x = canvasWidth;
            //this.velocityX = -this.velocityX
        } else if (this.x > canvasWidth) {
            this.x = 0;
            //this.velocityX = -this.velocityX
        }

        if (this.y < 0) {
            this.y = canvasHeight;
            //this.velocityY = -this.velocityY
        } else if (this.y > canvasHeight) {
            //this.velocityY = -this.velocityY
            this.y = 0;
        }

        // Limita a velocidade máxima
        const maxSpeed = 2;
        const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        if (speed > maxSpeed) {
            this.velocityX = (this.velocityX / speed) * maxSpeed;
            this.velocityY = (this.velocityY / speed) * maxSpeed;
        }

        // Zera a aceleração após o movimento
        this.accelerationX = 0;
        this.accelerationY = 0;
    }
}

// Criação de células aleatórias
const numCells = 4000;
const cells = [];

for (let i = 0; i < numCells; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const color = CellColor.availableColors[Math.floor(Math.random() * CellColor.availableColors.length)];

    const cell = new CellColor(x, y, color);
    cells.push(cell);
}

CellColor.setAttractionRepulsionRules(cells);

// Função de animação
function animate() {
    
    const canvas = document.getElementById("colorCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Limpa o canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha e move cada célula
    for (const cell of cells) {
        cell.draw(ctx);
        cell.applyForces(cells);
        cell.move();
    }

    // Chama a próxima animação
    requestAnimationFrame(animate);
}



animate()
