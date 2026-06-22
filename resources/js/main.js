import { texturesAtlas } from "./textures.js"
import { id_vals, tile_types } from "./tiles.js"
import { version } from "./global.js"
import { notif } from "./notifications.js"
try {

new notif(`MetroMaker ${version}`, 'purple')

//@ts-nocheck
function random(min, max) {
    return Math.random() * (max - min) + min
}

document.getElementById('version-disp').textContent = `Version: ${version}`;

// Setup canvas and world
const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');
let tileSize = 20;
canvas.width = 57 * tileSize;
canvas.height = 38 * tileSize;
let dayTime = -15 //-30 -> 30
let dayIncreasing = true;
let paused = true;
let disableMoneyNegativeCheck = false
ctx.imageSmoothingEnabled = false;
let loading = false;
const people  = []

let mode = 'road'; // default mode
let road_mode = 'regular' // default mode

const keybinds = {
    up: 'w',
    down: 's',
    left: 'a',
    right: 'd',
    in: 'q',
    out: 'e',
}

const city_vals = {
    demand: 0,
    maintainence: 0,
    tax: 0,
    population: 0,
    population_max: 0,
    jobs: 0,
    power: 0,
    money: 20,
    happiness: 0,
    water: 0,
    points: 0,
    milestonesReached: new Set(),
    unhappy: [],
    city_policies: {
        ads: false,
        energy_lessenation: false,
        water_lessenation: false,
    }
}

const tile_counts = {
    grass: 0,
    road: 0,
    house: 0,
    shop: 0,
    water: 0,
    power: 0,
    water_collecter: 0,
}

const sourcesTiles = {
    in: [],
    out: [],
}

//simulate these variables, they will be overwritten once main.js loads
function habitabitabality() {
    city_vals.happiness = 0
    if(city_vals.population == 0) {
        city_vals.happiness == 0
        return;
    }
    // Stff to take into acount: jobs 4, demand vs housing 1, lack of power 5, 9, lots of shops 2, lack of water, 3
    if(city_vals.jobs >= city_vals.population && city_vals.population !== 0) {
        city_vals.happiness += 4
    }
    if(city_vals.demand >= city_vals.population_max) {
        city_vals.happiness -= 1
    }
    if(city_vals.power <= 0) {
        city_vals.happiness -= 5 
    }
    if(tile_counts.shop <= 0) {
        city_vals.happiness -= 2
    }
    if(city_vals.water <= 0) {
        city_vals.happiness -= 2
    }
    if(city_vals.jobs >= city_vals.population) {
        city_vals.happiness += 2
    }
    if(city_vals.demand <= city_vals.population_max) {
        city_vals.happiness += 2
    }
    if(city_vals.city_policies.water_lessenation) {
        city_vals.happiness -= 1
    }
    if(tile_counts.police >= 1) {
        city_vals.happiness += 3
    }
}
function habitabitabality_info_String() {
    let info = []
    if(city_vals.population == 0) {
        info[1] = 'Not Enough Population to give happiness info yet!'
        return info
    }
    //h.o.t.t.o.g.o.you.can.take.me.hot.to.go.h.o.t.t.o.g.o.you.can.take.me.HOOOOTTTT.TO.GOOOOO = ':3'
    // Stff to take into acount: jobs 4, demand vs housing 1, lack of power 5, 9, lots of shops 2, lack of water, 3
    if(city_vals.jobs >= city_vals.population && city_vals.population !== 0) {
        info[1] = 'Lots Of Jobs: +4 \n'
    }
    if(city_vals.demand >= city_vals.population_max) {
        info[2] = 'Not Enough houses to meet with demand: -1 \n'
    }
    if(city_vals.power <= 0) {
        info[3] = 'Not Enough Power: -5 \n'
    }
    if(tile_counts.shop <= 0) {
        info[4] = 'Not Enough Shops: -2 \n'
    }
    if(city_vals.water <= 0) {
        info[5] = 'Not Enough Water: -2 \n'
    }
    if(city_vals.demand <= city_vals.population_max) {
        info[6] = 'Housing Meets Up with Demand: +2 \n'
    }
    if(city_vals.city_policies.water_lessenation) {
        info[7] = 'Citizens are annoyed with the constant water awareness ads that keep popping up >:('
    }
    if(tile_counts.police >= 1) {
        info[8] = 'Citizens Like Police, They Feel Secure!'
    }
    return info
}

    function calculate_demand() {
        //Factors to consider: housing, happiness, jobs
        // If people cant find jobs, they dont move to ${town}
        if(city_vals.population_max === 0) return 0;
        let demand = Math.round(Math.abs(city_vals.population_max - (city_vals.happiness + city_vals.jobs)))
        if(city_vals.city_policies.ads) {
            demand += 20
        }
        return demand
    }

    function calculate_actual_population() {
        //Factors to consider: demand, happiness, housing, jobs

        let actual_population = (city_vals.jobs * (city_vals.demand / 10))

        if(actual_population > city_vals.population_max) actual_population = city_vals.population_max

        //Returns percentage rounded
        return Math.round(Math.abs(actual_population))
    }

const milestones = [
    {population: NaN, pts: null},
    {population: 10, pts: 20},
    {population: 50, pts: 45},
    {population: 100, pts: 50},
    {population: 400, pts: 100},
    {population: 1000, pts: 105},
    {population: 2000, pts: 200},
]

// World grid setup
function create2darray(rows, cols, fill) {
    let array = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ ...fill})));
    return array
}

const world = {
    rows: 50,
    cols: 70,
    grid: create2darray(51, 71, tile_types.grass),
    unlockable_grids: {
        top: '',
        left: '',
        right: '',
        down: '',
    },
    offsetX: 0,
    offsetY: 0,
};

function idtoname(id) {
    return id_vals[id].name
}

function generateLakes(chance = 0.005, growthChance = 0.2, iterations = 3) {
    try {
        // Step 1: Seed a few random water tiles
        for (let y = 0; y < world.rows; y++) {
            for (let x = 0; x < world.cols; x++) {
                if (Math.random() < chance) {
                    world.grid[y][x] = { ...tile_types.water };
                }
            }
        }

    function getAdjacentWaterCount(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 && nx < world.cols &&
                    ny >= 0 && ny < world.rows &&
                    world.grid[ny][nx].id === tile_types.water.id
                ) {
                    count++;
                }
            }
        }
        return count;
    }


        // Step 2: Grow lakes based on adjacent water tiles
        for (let i = 0; i < iterations; i++) {
            const newGrid = world.grid.map((row, y) =>
                row.map((cell, x) => {
                    const neighbors = getAdjacentWaterCount(x, y);
                    if (cell.id === tile_types.grass.id && neighbors > 0) {
                        const growProbability = 1 - Math.pow(1 - growthChance, neighbors);
                        if (Math.random() < growProbability) {
                            return { ...tile_types.water };
                        }
                    }
                    return cell;
                })
            );
            world.grid = newGrid;
        }
    } catch(err) {
        new notif(err)
    }
}

const _regular = document.getElementById('regular_road')
const _easy = document.getElementById('easy_road')

_regular.addEventListener('click', () => {
    _regular.classList.add('active')
    _easy.classList.remove('active')
    road_mode = 'regular'
})
_easy.addEventListener('click', () => {
    _regular.classList.remove('active')
    _easy.classList.add('active')
    road_mode = 'easy'
})

//#region 
function road(x, y) {
    //oh god, ts is about to be hard!!!
    var up,down,left,right = false;
    if(world.grid[y + 1][x].id == 1 && !up) {
        up = true
    }
    if(world.grid[y - 1][x].id == 1 && !down) {
        down = true
    }
    if(world.grid[y][x + 1].id == 1 && !right) {
        right = true
    }
    if(world.grid[y][x - 1].id == 1 && !left) {
        left = true
    }

    if(up && down && right && left) {
        world.grid[y][x].texture = texturesAtlas.road.quad_intersection
    }
    if(up && down && !right && !left) { 
        world.grid[y][x].texture = texturesAtlas.road.vertical
    }
    if(!up && !down && right && left) {
        world.grid[y][x].texture = texturesAtlas.road.horizontal
    }
    if(!up && down && !right && !left) {
        world.grid[y][x].texture = texturesAtlas.road.dead_end_vertical_down
    }
    if(up && !down && !right && !left) {
        world.grid[y][x].texture = texturesAtlas.road.dead_end_vertical_up
    }
    if(!up && !down && !right && left) {
        world.grid[y][x].texture = texturesAtlas.road.dead_end_horizontal_left
    }
    if(!up && !down && right && !left) {
        world.grid[y][x].texture = texturesAtlas.road.dead_end_horizontal_right
    }
    if(up && !down && left && right) {
        world.grid[y][x].texture = texturesAtlas.road.T_intersection.down
    }
    if(!up && down && left && right) {
        world.grid[y][x].texture = texturesAtlas.road.T_intersection.up
    }
    if(up && down && !left && right) {
        world.grid[y][x].texture = texturesAtlas.road.T_intersection.right
    }
    if(up && down && left && !right) {
        world.grid[y][x].texture = texturesAtlas.road.T_intersection.left
    }
    if(!up && !down && !left && !right) {
        world.grid[y][x].texture = texturesAtlas.road.isolated
    }
    if(up && left && !down && !right) {
        world.grid[y][x].texture = texturesAtlas.road.corners.one
    }
    if(up && !left && !down && right) {
        world.grid[y][x].texture = texturesAtlas.road.corners.four
    }
    if(!up && left && down && !right) {
        world.grid[y][x].texture = texturesAtlas.road.corners.two
    }
    if(!up && !left && down && right) {
        world.grid[y][x].texture = texturesAtlas.road.corners.three
    }
}
//#endregion

function mark(x, y, type) {
    const image = new Image()
    image.src = textures.marker[type]
    ctx.drawImage(image, x, y+0.2)
}
const lights = () => {
    return dayTime < -3
}

// Drawing function
function drawWorld() {
    try {
        Object.keys(tile_counts).forEach(key => {
            tile_counts[key] = 0;
        });
        city_vals.tax = 0
        city_vals.population = 0
        city_vals.population_max = 0
        city_vals.maintainence = 0
        city_vals.jobs = 0
        city_vals.power = 0
        city_vals.water = 0
        for (let y = 0; y < world.rows; y++) {
            for (let x = 0; x < world.cols; x++) {
                city_vals.population_max += id_vals[world.grid[y][x].id].population_max
                city_vals.population = calculate_actual_population()
                city_vals.tax += id_vals[world.grid[y][x].id].tax
                city_vals.maintainence += id_vals[world.grid[y][x].id].maintainence
                city_vals.jobs += id_vals[world.grid[y][x].id].jobs
                city_vals.power -= id_vals[world.grid[y][x].id].power_taken
                city_vals.power += id_vals[world.grid[y][x].id].power_provided
                city_vals.water -= id_vals[world.grid[y][x].id].water_taken
                city_vals.water += id_vals[world.grid[y][x].id].water_provided
                city_vals.demand = calculate_demand()
                /*
                if(world.grid[y][x].id === 2 || world.grid[y][x].id === 7 || world.grid[y][x].id === 11) {
                    if(detectIDat(x,y, 4, 21).length !== 0) {
                        city_vals.unhappy = detectIDat(x,y, 4, 21)
                    }
                }
                */
                if(city_vals.population == 0) {
                    city_vals.tax = 0
                }
                if(people.length !== 0) {
                    for(const person of people) {
                        if(!person.path_impossible) {
                            person.update()
                            person.draw()
                        } else {
                            continue;
                        }
                    }
                }

                if(city_vals.money <= 0 && !disableMoneyNegativeCheck) {
                    paused = true
                    let choice = prompt(`Your Money Has Fallen into the negatives?, 
                    would you like a boost ($10)?
                    or would you like to restart?
                    or would you like to just watch things burn?
                    Enter B for boost, or R to restart, or EXIT to watch your city fall like ancient rome`)
                    if(choice == 'B') {
                        city_vals.money = 10
                    }
                    if(choice == 'R') {
                        let really = confirm() 
                        if(really) {
                            location.reload()
                            disableMoneyNegativeCheck = true
                        }
                    }
                    if(choice == 'EXIT') {
                        disableMoneyNegativeCheck = true
                        return;
                    }
                }

                //Draw
                //Texture Test
                if(texturesAtlas[id_vals[world.grid[y][x].id].name] && world.grid[y][x].id !== 1) {
                    let texture = new Image()
                    texture.src = texturesAtlas[id_vals[world.grid[y][x].id].name]
                    ctx.drawImage(texture, (x + world.offsetX) * tileSize, (y + world.offsetY) * tileSize, tileSize, tileSize)
                } else if(id_vals[world.grid[y][x].id].name === 'road') {
                    road(x , y)
                    let texture = new Image()
                    texture.src = world.grid[y][x].texture
                    ctx.drawImage(texture, (x + world.offsetX) * tileSize, (y + world.offsetY) * tileSize, tileSize, tileSize)
                } else if(world.grid[y][x].id >= 22 && world.grid[y][x].id <= 25) {
                    //Manage Source Tiles
                    let id = world.grid[y][x].id
                    let tex
                    if(id == 22) {
                        tex = texturesAtlas.road.source.top
                    }
                    if(id == 23) {
                        tex = texturesAtlas.road.source.bottom
                    }
                    if(id == 24) {
                        tex = texturesAtlas.road.source.left
                    }
                    if(id == 25) {
                        tex = texturesAtlas.road.source.right
                    }
                    let texture = new Image()
                    texture.src = tex
                    ctx.drawImage(texture, (x + world.offsetX) * tileSize, (y + world.offsetY) * tileSize, tileSize, tileSize)
                } else {
                    ctx.fillStyle = world.grid[y][x].color;
                    ctx.fillRect((x + world.offsetX) * tileSize, (y + world.offsetY) * tileSize, tileSize, tileSize)
                }

                tile_counts[idtoname(world.grid[y][x].id)] += 1
                

                //if(city_vals.power <= 0) {
                    //  if(world.grid[y][x].id == 5 || world.grid[y][x].id ==  9 || world.grid[y][x].id ==  13) {
                    //    mark(x,y, 'no_power')
                    //}
                //}
                if(!loading) {
                    points()
                }
            }
            habitabitabality()
        }
        if(city_vals.city_policies.ads || city_vals.city_policies.water_lessenation || city_vals.city_policies.energy_lessenation) {
            let ß = 0
            if(city_vals.city_policies.ads) ß += 20
            if(city_vals.city_policies.water_lessenation) ß += 2
            if(city_vals.city_policies.energy_lessenation) ß += 5
            city_vals.maintainence += ß
            document.getElementById('expense').textContent = city_vals.maintainence
        }
        if(city_vals.city_policies.water_lessenation) {
            city_vals.water += 4
        }
        if(city_vals.city_policies.energy_lessenation) {
            city_vals.power += 5
        }
        // Map dayTime (-60 to 60) to brightness (0.2 to 1)
        const t = (dayTime + 60) / 120; // normalize to 0-1
        const brightness = 0.2 + t * 0.8; // range from 0.2 (night) to 1 (day)

        // Create a semi-transparent black overlay to simulate darkness
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Lights
        for (let y = 0; y < world.rows; y++) {
            for (let x = 0; x < world.cols; x++) {
                if(world.grid[y][x].id !== 0 && world.grid[y][x].id !== 4 && world.grid[y][x].id !== 17 && lights()) {
                    ctx.fillStyle = 'rgba(247, 239, 4, 0.2)'
                    ctx.beginPath()
                    //ctx.arc()
                    ctx.arc((x + 0.5 + world.offsetX) * tileSize, (y + 0.5 + world.offsetY) * tileSize, tileSize - 8, 0, Math.PI * 2)
                    ctx.fill()
                }
            }
        }

        //then update displays
        //city-pop, city-income, expense, city-jobs,
        document.getElementById('city-pop').textContent = city_vals.population_max
        document.getElementById('city-actual-population').textContent = city_vals.population
        document.getElementById('city-income').textContent = city_vals.tax
        document.getElementById('expense').textContent = city_vals.maintainence
        document.getElementById('city-jobs').textContent = city_vals.jobs
        document.getElementById('city-power').textContent = city_vals.power
        document.getElementById('city-money').textContent = city_vals.money
        document.getElementById('city-happiness').textContent = city_vals.happiness
        document.getElementById('city-water').textContent = city_vals.water
        document.getElementById('city-demand').textContent = city_vals.demand
        document.getElementById('citizen happiness display').textContent = habitabitabality_info_String()
        document.getElementById('city-points').textContent = city_vals.points
        document.getElementById('offset').textContent = `(${world.offsetX},${world.offsetY})`
        
        document.getElementById('mode-label').textContent = mode
    } catch(err) {
        alert(`drawWorld:1007: ${err.stack}`)
    }
}

function isAdjacentto(x,y,tile_id) {
    if(world.grid[y + 1][x].id == tile_id) {
        return true
    }
    if(world.grid[y - 1][x].id == tile_id) {
        return true
    }
    if(world.grid[y][x + 1].id == tile_id) {
        return true
    }
    if(world.grid[y][x - 1].id == tile_id) {
        return true
    } 
    else {
        return false;
    }
}

// Initial draw
//Base Chance, Chance if next to other water tile, iterations
//0.003, 0.05, 10 makes nice ponds
generateLakes(0.003, 0.05, 10)
drawWorld();

//drawhorizhighway(10)

function connect(start, end, tile_to_fill) {
    //Start at, End at
    const grid_x = []
    const grid_y = []
    let grid_xy = []
    let i_x = start.x
    let i_y = start.y
    while (i_x !== end.x + 1) {
        grid_x.push(i_x)
        i_x++;
    }
    while(i_y !== end.y + 1) {
        grid_y.push(i_y)
        i_y++;
    }
    
    try {
        //Fill With
        //grid_xy = grid_x.map((element, index) => {
        //    return [element, grid_y[index]];
        //});

        //new notif(JSON.stringify(grid_xy,null,2))
        //Top row is x ([0])
        //Bottom Row is Y ([1])
        grid_x.forEach((element, index) => {
            world.grid[start.y][element] = tile_types.road
        })
        grid_y.forEach((element, index) => {
            world.grid[element][start.x + grid_x.length - 1] = tile_types.road
        })
        
    } catch(Err) {
        new notif(Err.stack)
    }
}

// Button logic
const toolButtons = ['demolish', 'road', 'house', 'shop', 'power', 'water_collecter', 'house_med', 'shop_med', 'power_med', 'water_collecter_med', 'house_high', 'shop_high', 'power_high', 'water_collecter_high', 'police', 'research_hall', 'test', 'office', 'office_med', 'office_high', 'industrial'];
toolButtons.forEach(tool => {
    const btn = document.getElementById(tool);
    btn.addEventListener('click', () => {
        mode = tool;
        // Highlight selected button
        toolButtons.forEach(t => document.getElementById(t).classList.remove('active'));
        btn.classList.add('active');
    });
});

// Click interaction
let clicks = 0
let pos1 = {}
let pos2 = {}

canvas.addEventListener('contextmenu', (e) => {
    if(Object.keys(pos1).length != 0 && Object.keys(pos2).length != 0) {
        //Right Click Cancels
        e.preventDefault()
        world.grid[pos2.y][pos2.x].color = world.grid[pos2.y][pos2.x].backup
        world.grid[pos1.y][pos1.x].color = world.grid[pos1.y][pos1.x].backup
        new notif('Cancelled')
        pos1 = {}
        pos2 = {}
        clicks = 0
        return;
    }
})
canvas.addEventListener('click', (e) => {
    try {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const canvasX = (e.clientX - rect.left) * scaleX;
        const canvasY = (e.clientY - rect.top) * scaleY;

        const gridX = Math.floor(canvasX / tileSize) - world.offsetX
        const gridY = Math.floor(canvasY / tileSize) - world.offsetY
        if(mode == 'test') {
            new notif(`(${gridX},${gridY})`)
            return;
        }
        if(mode == 'road' && road_mode == 'easy') {
            if(clicks == 0) {
                //First Click
                pos1.x = gridX
                pos1.y = gridY
                //Highlight pos1
                world.grid[pos1.y][pos1.x].backup = world.grid[pos1.y][pos1.x].color
                world.grid[pos1.y][pos1.x].color = 'cyan'
                clicks += 1
                return;
            }
            if(clicks == 1) {
                pos2.x = gridX
                pos2.y = gridY
                //Highligh pos2
                world.grid[pos2.y][pos2.x].backup = world.grid[pos2.y][pos2.x].color
                world.grid[pos2.y][pos2.x].color = 'cyan'
                clicks += 1
                new notif('Click To Confirm Road, Double Click or Right Click to cancel build')
                return;
            }
            
            if(clicks >= 2) {
                // new notif('pos2 < pos1')
                //connect(pos2, pos1, 0)
                //pos2 = {}
                //pos1 = {}
                //clicks = 0
                //return;
                const distSq1 = (pos1.x * pos1.x) + (pos1.y * pos1.y);
                const distSq2 = (pos2.x * pos2.x) + (pos2.y * pos2.y);

                if(distSq1 > distSq2) {
                    connect(pos2, pos1, 0)
                    pos2 = {}
                    pos1 = {}
                    clicks = 0
                    return;
                }
                if(distSq2 > distSq1) {
                    connect(pos1, pos2, 0)
                    pos2 = {}
                    pos1 = {}
                    clicks = 0
                    return;
                } 
                else {
                    pos2 = {}
                    pos1 = {}
                    clicks = 0
                    return;
                }
                
            }
        
            
        } else if(gridX < world.cols && gridY < world.rows && world.grid[gridY][gridX] !== tile_types[mode]) {
            if(mode === 'demolish') {
                    city_vals.money += id_vals[world.grid[gridY][gridX].id].price
                    if(world.grid[gridY][gridX].previous_state == null || undefined) { 
                        world.grid[gridY][gridX] = {...tile_types.grass}
                    } else {
                        world.grid[gridY][gridX] = world.grid[gridY][gridX].previous_state
                    }
            }
            if(tile_types[mode].unlocked && mode !== 'demolish') {
                const previous_state = world.grid[gridY][gridX]
                if(mode.includes('water_collecter')) {
                    if(isAdjacentto(gridX,gridY,1) && isAdjacentto(gridX,gridY,4)) {
                        city_vals.money -= id_vals[tile_types[mode].id].price
                        world.grid[gridY][gridX] = {...tile_types[mode]}
                        world.grid[gridY][gridX].previous_state = previous_state
                    } else {
                        new notif('Must be Placed Next To Water AND Road')
                        return;
                    }
                }
                if(mode !== 'demolish' && !mode.includes('water_collecter') && id_vals[tile_types[mode].id].requiresRoad) {
                    if(isAdjacentto(gridX, gridY, 1)) {world.grid[gridY][gridX] = {...tile_types[mode]}; city_vals.money -= id_vals[tile_types[mode].id].price
                    } else new notif('Must be placed next to road')
                } else if(mode !== 'demolish') {
                    if(mode == 'road' && (gridY >= world.rows - 1 || gridY <= 0) && (gridX >= world.cols - 1 && gridX <= 0) ) {
                    
                    }
                    city_vals.money -= id_vals[tile_types[mode].id].price
                    world.grid[gridY][gridX] = {...tile_types[mode]}
                    world.grid[gridY][gridX].previous_state = previous_state
                }
            } else {
                if(mode === 'demolish') {
                    return;
                } else {
                    new notif('You must unlock that before you can place it')
                }
            }
        } else {
            return;
        }

    } catch (err) {
        if(road_mode === 'easy' && mode === 'road') {
            world.grid[pos2.y][pos2.x].color = world.grid[pos2.y][pos2.x].backup
            world.grid[pos1.y][pos1.x].color = world.grid[pos1.y][pos1.x].backup
            pos1 = {}
            pos2 = {}
            clicks = 0
            new notif('Error Drawing Road, Please Try to Draw Road in a different way')
            return;
        } else {
            alert(err + ': ' + err.stack)
            return;
        }
    }
});

function highlighttile(x,y) {
    world.grid[x][y].color = 'white'
}

const updateLoop = []

setInterval(() => {
    drawWorld()
    updateLoop.forEach((func) => func())
}, 20); //Update grid every 0.02s

function detectIDat(x, y, minDistance, searchID) {
    const conflicts = []

    if(Array.isArray(searchID)) {
        searchID.forEach((id, indx) => {
            for(let dy = -minDistance; dy <= minDistance; dy++) {
                for(let dx = -minDistance; dx < minDistance; dx++) {
                    let nx = x + dx;
                    let ny = y + dy;

                    if(
                        nx >= 0 && nx < world.cols &&
                        ny >= 0 && ny < world.rows &&
                        !(dx === 0 && dy === 0)
                    ) {
                        if(world.grid[ny][nx].id === id) {
                            conflicts.push({
                                residential: {x, y},
                                target: { x: nx, y: ny},
                                distance: Math.abs(dx) + Math.abs(dy)
                            })
                        }
                    }
                }
            }
        })
        return conflicts
    }

    for(let dy = -minDistance; dy <= minDistance; dy++) {
        for(let dx = -minDistance; dx < minDistance; dx++) {
            let nx = x + dx;
            let ny = y + dy;

            if(
                nx >= 0 && nx < world.cols &&
                ny >= 0 && ny < world.rows &&
                !(dx === 0 && dy === 0)
            ) {
                if(world.grid[ny][nx].id === searchID) {
                    conflicts.push({
                        residential: {x, y},
                        target: { x: nx, y: ny},
                        distance: Math.abs(dx) + Math.abs(dy)
                    })
                }
            }
        }
    }
    return conflicts
}

setInterval(() => {
    if(!paused) {
        if(dayTime >= 15 && dayIncreasing) {
            dayIncreasing = false
        }
        if(dayTime <= -15 && !dayIncreasing) {
            dayIncreasing = true
        }
        if(dayIncreasing) {
            dayTime += 1.5
        }
        if(!dayIncreasing) {
            dayTime -= 1.5
        }
        city_vals.money += city_vals.tax
        city_vals.money -= city_vals.maintainence
        document.getElementById('city-money').textContent = city_vals.money
        document.getElementById('time').textContent = dayTime
    }
}, 1500);

document.addEventListener('keydown', function(event) {
    if (event.key === 'p' || event.key === ' ') {
        // paused = !paused didnt work, so im brute forcing it
        //nvm
        paused = !paused;
        //alert(`${paused ? 'paused!' : 'unpaused!'}`) //saving this for later
        
        document.getElementById('redborder').style.border = paused ? '5px solid red' : null;

        //Prevent Default Beavor
        event.preventDefault(); 
    };
    if(event.key === 'T') {
        alert(JSON.stringify(tile_counts))
    }
    if(event.ctrlKey && event.key === 'i') {
        alert(JSON.stringify(idtoname(3)))
    }
    if(event.key === 'A') {
        alert(isAdjacentto(10,10, 1))
        highlighttile(10,10)

    }
    if(event.key == keybinds.in) {
        tileSize += 1
    }
    if(event.key == keybinds.out) {
        if(tileSize <= 20) {
            tileSize = 20
            new notif('This is max you can zoom out, any farther and you may run into graphical glitches', 'red')
            return;
        }
        tileSize -= 1
    }
    if(event.key == keybinds.up) {
        world.offsetY += 1
    }
    if(event.key == keybinds.down) {
        if(world.offsetY < -46) {
            new notif('This is as far as you can go', 'red')
            world.offsetY = -46
        }
        world.offsetY -= 1
    }
    if(event.key == keybinds.left) {
        world.offsetX += 1
    }
    if(event.key == keybinds.right) {
            world.offsetX -= 1
    }
    
    
    if(event.key === 'M') city_vals.money += parseInt(prompt('?+int?: '))
    if(event.key === 'P') city_vals.points += parseInt(prompt('?+int?: '))
    if(event.ctrlKey && event.key === 'M') {
        let wingledongle = parseInt(prompt('?int>5<1?: '))
        city_vals.points += milestones[wingledongle].pts
        new notif(JSON.stringify(milestones[wingledongle], null, 2))
        new notif(`MILESTONE ${wingledongle} REACHED: +${milestones[wingledongle].pts}`)
    }
    if(event.key === 'r') {
        world.offsetX = 0
        world.offsetY = 0
        tileSize = 20
    }
    if(event.key === 'D') {
        /**//d+d*40/
        highlighttile(5,5)
        new notif(JSON.stringify(detectIDat(5,5, 4, 1), null, 2))
    }
    if(event.key === 'Tab') {
        try {
            event.preventDefault()
            //highlighttile(1,1)
            //highlighttile(10,10)
            let start = sourcesTiles.in[0]
            let end = sourcesTiles.out[0]
            start.x += 1
            end.x -= 1
            //new notif(`START: ${start}, END: ${end}`)
            new AGENT(start, end, 0.0001, 'john')
            //new notif('Path: ' + JSON.stringify(test.path))
        } catch (error) {
            new notif('TAB:TEST: ' + error.stack, 'red', 20000)
        } 
    }
    if(event.key === 'o') {
        new notif(calculate_demand())
    }
});


function points() {
    milestones.forEach((milestone, index) => {
        if(city_vals.population >= milestone.population && !city_vals.milestonesReached.has(index)) {
            city_vals.points += milestone.pts
            city_vals.milestonesReached.add(index)
            new notif(`MILESTONE ${index} REACHED: +${milestone.pts}`)
        }
    })
}

function download() {
    try {
        const a = document.createElement('a')
        const city = {
            meta: {
                name: prompt('City Name?'),
                version: version
            },
            city_vals: city_vals,
            grid: world.grid,
            unlocked: tile_types,
        }
        const json_city = JSON.stringify(city, null, 2)

        
        
        const blob = new Blob([json_city], { type: 'application/json'})
        a.href = URL.createObjectURL(blob)
        a.download = `${city.meta.name}.cty`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(a.href)
    } catch(err) {
        new notif(err.stack)
    }
}

async function grab_file(evt) {
    const file = evt[0]
    try {
        const file_content = await file.text()
        return file_content
    } catch(err) {
        new notif(err.stack)
    }

}
document.getElementById('submit_input').addEventListener('click', () => {
    //new notif('hai')
    loading = true
    const file = document.getElementById('cty_input').files
    const file_content = grab_file(file)
    file_content.then((file) => {
        const cty = JSON.parse(file) 
        if(typeof cty !== 'object') {
            new notif('File is not JSON, please try again')
            return;
        }
        world.grid = cty.grid
        city_vals = cty.city_vals
        tile_types = cty.tile_types
        new notif('Loaded ' + cty.meta.name)
        document.getElementById('cty_input').files = null
        loading = false;
    }).catch((err) => {
        new notif(err)
    })
})

async function copyTextToClipboard(textToCopy) {
    try {
        await navigator.clipboard.writeText(textToCopy);
        console.log('Text copied to clipboard successfully!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers or if Clipboard API is not available
        fallbackCopyTextToClipboard(textToCopy); 
    }
}
} catch (error) {
alert(error.stack)
}