function tileToCanvasPos(pathpoint) {
    return {
        x: pathpoint.x * tileSize,
        y: pathpoint.y * tileSize,
    }
}
class AGENT {
    constructor(start, end, speedTilesMS = 1, id = null) {
        this.start = start
        this.end = end
        this.speed = speedTilesMS
        this.path = this.nav()
        this.currentSegment = 0
        this.path_impossible = false
        this.progress = 0
        this.done = false
        this.id = id
        if(this.nav() == null || undefined) {
            this.path_impossible = true
        }
        if(!this.path_impossible) {
            this.position = tileToCanvasPos(this.path[0])
            people.push(this)
        }
    }

    nav() {
        try {
            let start = this.start
            //new notif('start: ' + `${this.start.x},${this.start.y}`)
            let end = this.end
            //new notif('end: ' + `${this.end.x},${this.end.y}`)
            let grid = world.grid
            const rows = world.grid.length;
            const cols = world.grid[0].length;
            const queue = [{ x: this.start.x, y: this.start.y, path: [{ x: this.start.x, y: this.start.x }] }];
            //new notif('Queue: ' + JSON.stringify(queue))
            const visited = new Set();
            const pathKey = (x, y) => `${x},${y}`;

            visited.add(pathKey(start.x, start.y));

            while (queue.length > 0) {
                const { x, y, path } = queue.shift();

                if (x === end.x && y === end.y) {
                    //copyTextToClipboard(JSON.stringify(path))
                    //new notif(path)
                    return path;
                }

                const neighbors = [
                { dx: 0, dy: 1 }, // Down
                { dx: 0, dy: -1 }, // Up
                { dx: 1, dy: 0 }, // Right
                { dx: -1, dy: 0 } // Left
                ];

                for (const { dx, dy } of neighbors) {
                const nextX = x + dx;
                const nextY = y + dy;

                // Check for valid boundaries
                if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows) {
                    // Retrieve the tile and check the constraint
                    const tile = grid[nextY][nextX];
                    if (tile && tile.id === 1 && !visited.has(pathKey(nextX, nextY))) {
                    visited.add(pathKey(nextX, nextY));
                    const newPath = [...path, { x: nextX, y: nextY }];
                    queue.push({ x: nextX, y: nextY, path: newPath });
                    }
                }
                }
            }

            return null; // No path found
        } catch (error) {
            new notif('AGENT.nav() 1831: ' + error.stack)
        }
    }

    update() {
    if (this.currentSegment >= this.path.length - 1) {
        this.done = true
        //const index = people.findIndex(this)
        //people.splice(index, 1)
        return;
    }
    

    const start = tileToCanvasPos(this.path[this.currentSegment]);
    const end = tileToCanvasPos(this.path[this.currentSegment + 1]);

    // Calculate vector
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const moveX = (dx / distance) * this.speed;
    const moveY = (dy / distance) * this.speed;

    this.position.x += moveX;
    this.position.y += moveY;

    this.progress += this.speed / distance;

    if (this.progress >= 1) {
      this.currentSegment++;
      this.progress = 0;
      this.position = { ...end };
    }

  }

  draw() {
    if(!this.done) {
        ctx.fillStyle = "blue"; // person or "red" for car
        ctx.beginPath();
        ctx.arc(this.position.x + tileSize / 2, this.position.y + tileSize / 2, 4, 0, Math.PI * 2);
        //ctx.fillRect((this.position.x + world.offsetX) * tileSize, (this.position.y + world.offsetY) * tileSize, tileSize, tileSize)
        ctx.fill();
    }
  }

    
}
