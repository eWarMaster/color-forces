# Color Forces

## Description
Color Forces is a JavaScript project that demonstrates the interaction between colored cells based on attraction and repulsion forces. Each cell has a specific color and is influenced by attraction and repulsion forces from other cells with different colors.

## Features
- Random generation of colored cells on a canvas.
- Calculation of attraction and repulsion forces between cells based on color.
- Smooth animation demonstrating the movement and interaction of cells.

## Usage
To use this project, simply open the `index.html` file in a web browser. The animation will start automatically.

## How It Works
1. **CellColor Class**: Defines the properties and behavior of each cell, including its position, color, velocity, acceleration, and attraction/repulsion settings.
2. **Setting Attraction and Repulsion Rules**: Determines which colors attract and repel each other, and assigns attraction and repulsion indices to each cell.
3. **Drawing and Moving Cells**: Draws each cell on the canvas and updates their positions based on the applied forces.
4. **Animation**: Utilizes the `requestAnimationFrame` method to create a smooth animation loop.

## Technologies Used
- JavaScript
- HTML Canvas

## Credits
This project was created by Adriano Sousa
