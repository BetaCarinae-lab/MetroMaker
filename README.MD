# City Builder v-Smh idk like 0.2 ig
Will write stuff here eventually, dont know what yet
maybe a modding guide

### ITS TIME FOR A MODDING GUIDE!!!
## How to add new tiles:
# find id_vals object
Fill this out and put it at the bottom of the object
{ name: string, price: int, maintainence: int, tax: int, population_max: int, jobs: int, power_provided: int, power_taken: int, water_provided: int, water_taken: int, requiresRoad: bool}

# Then find tile_types object
Now this add to the bottom of tile_types
{ color: string (MUST BE HEX COLOR), id: int (make sure id is just +1 from the previous tile), texture: null (Only use if you know what your doing)}

# Find const toolButtons = [] at around ln: 1213 (may change)
Add your tile name to the array

# Now add a button to the html
the format must be
<button id=nameoftile>Name Of Tile</button>

# (Optional if you gave your tile a valid hex code): Add a texture
Go to https://kleki.com/ or any other image editor
Create a new image with a 64x64 px size and put it into a 
a proper entry should look like:
go to TEXTURES.js and find textures2, Ignore Textures