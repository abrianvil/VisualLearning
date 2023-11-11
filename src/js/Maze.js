import * as THREE from 'three';

class Maze {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];

        // Initialize all cells with walls
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < columns; c++) {
                row.push({
                    x: c,
                    y: r,
                    visited: false,
                    walls: { north: true, east: true, south: true, west: true }
                });
            }
            this.grid.push(row);
        }
    }

    // generate() {
    //     let current = this.grid[0][0]; // Start from top-left cell
    //     current.visited = true;
    //     this.stack.push(current);

    //     while (this.stack.length > 0) {
    //         let next = this.chooseNextCell(current);
    //         if (next) {
    //             next.visited = true;
    //             this.removeWalls(current, next);
    //             this.stack.push(current);
    //             current = next;
    //         } else {
    //             current = this.stack.pop();
    //         }
    //     }
    // }

    generate() {
        let current = this.grid[0][0];
        current.visited = true;
        this.stack.push(current);
    
        while (this.stack.length > 0) {
            let next = this.chooseNextCell(current);
            if (next) {
                next.visited = true;
                this.removeWalls(current, next);
                this.stack.push(current); // Push the current cell onto the stack
                current = next;
            } else {
                // No unvisited neighbors, so backtrack
                current = this.stack.pop();
            }
    
            // Introduce some randomness to occasionally not backtrack all the way
            if (Math.random() < 0.1) {
                this.stack.pop();
            }
        }
    }
    

    chooseNextCell(cell) {
        let neighbors = [];
        let x = cell.x;
        let y = cell.y;

        // Get the valid neighbors
        let directions = [
            ['north', x, y - 1],
            ['south', x, y + 1],
            ['east', x + 1, y],
            ['west', x - 1, y]
        ];

        for (let [direction, newX, newY] of directions) {
            if (
                newX >= 0 && newX < this.columns &&
                newY >= 0 && newY < this.rows &&
                !this.grid[newY][newX].visited
            ) {
                neighbors.push(this.grid[newY][newX]);
            }
        }

        if (neighbors.length > 0) {
            // Choose a random neighbor
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            return next;
        } else {
            return undefined;
        }
    }

    removeWalls(current, next) {
        let x = current.x - next.x;
        let y = current.y - next.y;

        if (x === 1) {
            next.walls['east'] = false;
            current.walls['west'] = false;
        } else if (x === -1) {
            next.walls['west'] = false;
            current.walls['east'] = false;
        }

        if (y === 1) {
            next.walls['south'] = false;
            current.walls['north'] = false;
        } else if (y === -1) {
            next.walls['north'] = false;
            current.walls['south'] = false;
        }
    }

    draw(scene) {
        const wallGeometry = new THREE.BoxGeometry(0.1, 1, 1);
        let wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8FBC8F });
        const floorGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
        const debugMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // Red color for debugging
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                const cell = this.grid[r][c];
                let wallMaterialToUse = wallMaterial;
                
                const wallCount= Object.values(cell.walls).filter(isWall => isWall).length;

                if (wallCount === 3) {
                console.log(wallCount);
                    wallMaterialToUse = debugMaterial;
                }
    
                // Draw the east wall if it exists and is not the northern boundary
                if (cell.walls['east']) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterialToUse);
                    wall.position.set(c + 0.5, 0, -r);
                    wall.rotation.y = Math.PI / 2;
                    scene.add(wall);
                }
    
                // Draw the south wall if it exists
                if (cell.walls['south']) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterialToUse);
                    wall.position.set(c, 0, -r - 0.5);
                    scene.add(wall);
                }
    
                // Draw the west wall for the first cell in a row
                if (cell.walls['west'] && c === 0) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterialToUse);
                    wall.position.set(c - 0.5, 0, -r);
                    wall.rotation.y = Math.PI / 2;
                    scene.add(wall);
                }
    
                // Draw the north wall for the first row
                if (cell.walls['north'] && r === 0) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterialToUse);
                    wall.position.set(c, 0, -0.5);
                    scene.add(wall);
                }
    
                // Draw the floor for every cell
                const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.position.set(c, -0.45, -r); // Slightly lower the floor to avoid z-fighting
                scene.add(floor);
            }
        }
    }
    
}


export default Maze;
