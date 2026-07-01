
import { notif } from "./notifications";
import { showPopup } from "./windowManager.globalscript";
import { tile_types } from "./tiles";
import { city_vals } from "./main";

/*
function credits() {
    const credits = window.open('', '_blank', 'width=600,height=400');
    if(credits) {
        const credits_html = `
        <h3>
            <strong>All Textures/Assets/and any code was written by me (BetaCarinae)</strong>
            <strong>Credits to brayden for the name!</strong>
        </h3>
        <pre>
            Copyright 2025 Finn Fagan

            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at

            <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>

            Unless required by applicable law or agreed to in writing, software
            distributed under the License is distributed on an "AS IS" BASIS,
            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            See the License for the specific language governing permissions and
            limitations under the License.
        </pre>`

        credits.document.write(credits_html)
        credits.document.close()
    } else {
        new notif(`
        <h3>
            <strong>All Textures/Assets/and any code was written by me (BetaCarinae)</strong>
            <strong>Credits to brayden for the name!</strong>
        </h3>
        <pre>
            Copyright 2025 Finn Fagan

            Licensed under the Apache License, Version 2.0 (the "License");
            you may not use this file except in compliance with the License.
            You may obtain a copy of the License at

            <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>

            Unless required by applicable law or agreed to in writing, software
            distributed under the License is distributed on an "AS IS" BASIS,
            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            See the License for the specific language governing permissions and
            limitations under the License.
        </pre>`)
    }
}

function Tutorial() {
const Tutorial = window.open('', '_blank', 'width=600,height=400')
if(Tutorial) {
    const tutorial_html = `
    <!DOCTYPE html>
        <head>
            <title>MetroMaker Tutorial</title>
        </head>

        <h1>All the stuff!</h1>

        <h2>IMPORT/EXPORT CITY</h2>
        <pre>
            Export City as .cty and enter a name.

            To Import, Click the white box and select the .cty file
            Then click SUBMIT .cty FILE
        </pre>


        <h2>MOVEMENT</h2>
        <pre>
            w is up
            s is down
            a is right
            d is left

            q zooms in
            e zooms out

            and r resets the camera
        </pre>
        <pre>
            Look at all the thingamadoodles on the right
            <strong>What do they mean?</strong>

            <h3><strong>UNLOCK POINTS</strong></h3>
            <pre>
                Unlock points are what you use in the tech tree (above)
                They can be earned by completing milestones
                <h4>This is a list of all the milestones and the points earned:</h4>
                <pre><code>
                    {population: 10, pts: 20},
                    {population: 50, pts: 45},
                    {population: 70, pts: 50},
                    {population: 100, pts: 100},
                    {population: 200, pts: 105},
                </pre></code>
            </pre>

            <h3>MONEY</h3>
            <pre>
                The money system is pretty easy to understand, every update cycle (1.5s)
                your income is added to your money
                and your expenses are taken away from your money
            </pre>
            <h3>CITIZEN HAPPINESS</h3>
            <pre>
                This is the overall happiness of your citizens,
                it is influenced by almost everything,
                and heavily influences demand, and populations
            </pre>
            <h4>DEMAND</h4>
            <pre>
                The demand system controls how many people
                want to be in your city, your population is based on this,
                so keep it high!
            </pre>
            <h4>POPULATION AT MAX</h4>
            <pre>
                This is the max amount of people that can live in your city
                it is increased by building houses
            </pre>
            <h4>ACTUAL POPULATION</h4>
            <pre>
                This is actual population, it is based on demand and population at max,
                as well as citizen happiness
            </pre>
            <h4>INCOME AND EXPENSES</h4>
            <pre>
                This is your income and expenses.
                pretty simple
            </pre>
            <h4>JOBS</h4>
            <pre>
                This is the amount of jobs in your city, it influences demand heavily
                and happiness
            </pre>
            <h4>POWER AND WATER</h4>
            <pre>
                This is the amount of water and power in your city, if these are too low
                then happiness (and thus demand) are lowered
            </pre>

            <h2><strong>TECH TREE AND LAND UNLOCK</strong></h2>
            <pre>
                <strong><h3>TECH TREE</h3></strong>
                <pre>
                    This is where you can unlock new tiles
                    Make sure you have enough points though
                </pre>
            </pre>
        </pre>
    `

    Tutorial.document.write(tutorial_html)
    Tutorial.document.close()
}
}
*/

export function techtree() {
    const techtree = `
    <body style="background-color: grey">
        <fieldset>
            <legend>TechTree</legend>
            <h3>Points: <span id="point-display"></span></h3>
            <button id="unlock_selected">Unlock Selected!</button>
            <h3>You are unlocking these:</h3>
            <pre id="these">None Selected</pre>
            <style>
                button {
                    padding: 8px 16px;
                    margin: 4px;
                    border: none;
                    border-radius: 4px;
                    background-color: #444;
                    color: #fff;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #666;
                }
                button.active {
                    background-color: #00b894;
                }
            </style>

            <fieldset>
                <legend>Houses</legend>
                <button id="house_med_unlock">Medium Density: 15 pt</button>
                <button id="house_high_unlock">High Density: 50 pt</button>
            </fieldset>
            <fieldset>
                <legend>Shops</legend>
                <button id="shop_med_unlock">Medium Density: 20 pt</button>
                <button id="shop_high_unlock">High Density: 40 pt</button>
            </fieldset>
            <fieldset>
                <legend>Power Plants</legend>
                <button id="power_med_unlock">Gas Power: 35 pt</button>
                <button id="power_high_unlock">Nuclear Power: 50 pt</button>
            </fieldset>
            <fieldset>
                <legend>Water Pumps</legend>
                <button id="water_collecter_med_unlock">Vaccuum Water Pump: 20 pt</button>
                <button id="water_collecter_high_unlock">Nuclear Powered 30 Turbine Water Pump: 50 pt</button>
            </fieldset>
            <fieldset>
                <legend>Offices</legend>
                <button id="office_unlock">Office 10 pt</button>
                <button id="office_med_unlock">Office Medium 20 pt</button>
                <button id="office_high_unlock">Office High 40 pt</button>
            </fieldset>
            <fieldset>
                <legend>Other</legend>
                <button id="research_hall_unlock">Research Hall: 40 pt</button>
            </fieldset>
        </fieldset>

        <button id="close_techtree"></button>
    </body>
    `
    showPopup(techtree, false)
    techtree.document.getElementById('point-display').textContent = city_vals.points.toString()

    const gonnaunlockthese = []
    let total_points = 0

    const unlcok_bootuns = ['house_med_unlock', 'house_high_unlock', 'shop_med_unlock', 'shop_high_unlock', 'power_med_unlock', 'power_high_unlock', 'water_collecter_med_unlock', 'water_collecter_high_unlock', 'research_hall_unlock', 'office_unlock', 'office_med_unlock', 'office_high_unlock']
    const unlcok_bootuns_points_required = [15, 50, 20, 40, 35, 50, 20 , 50, 40, 10, 20 ,40]
    const unlcok_bootuns_better_names = ['Medium Density House', 'High Density House', 'Medium Density Shop', 'High Density Shop', 'Gas Power Plant', 'Nuclear Power Plant', 'Vaccuum Water Pump', 'Nuclear Powered 30 Turbine Water Pump', 'Research Hall', 'Office', 'Office Medium', 'Office High']
    unlcok_bootuns.forEach((bootun, index) => {
        const bootun_ = techtree.document.getElementById(bootun) 
        bootun_.addEventListener('click', (e) => {
            if(tile_types[bootun.replace('_unlock', '')].unlocked) {
                new notif('Aready Unlocked!')
                return;
            }
            gonnaunlockthese.push(bootun.replace('_unlock', ''))
            
            total_points = total_points + unlcok_bootuns_points_required[index]
            techtree.document.getElementById('these').innerHTML = `
                <strong>Points Required ${total_points}</strong>
                <pre>${JSON.stringify(gonnaunlockthese).replace('[', '').replace(']', '').replace('"', '').replace('"', '').replace('_', ' ').replace(',', ', ')}</pre>
            `
        })                
    })

    techtree.document.getElementById('unlock_selected').addEventListener('click', () => {
        if(total_points > city_vals.points) {
            techtree.close()
            new notif('You Dont Have Enough Points!')
        } else {
            gonnaunlockthese.forEach((unlocked, indx) => {
                new notif('unlocking ' + unlocked)
                tile_types[unlocked].unlocked = true
            })
            city_vals.points -= total_points
            new notif('Unlocked!')
            techtree.close()
        }
    })
}

/*
function policies() {
    const policies = window.open('', '_blank', 'width=1000,height=400')
    if(policies) {
        const policie_html = `<!DOCTYPE html>
            <body>
                <style>
                    body {
                        background-color: rgb(30, 12, 147);
                        box-shadow: #fff;
                    }
                    button {
                        padding: 8px 16px;
                        margin: 4px;
                        border: none;
                        border-radius: 4px;
                        background-color: #444;
                        color: #fff;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    button:hover {
                        background-color: #666;
                    }
                    button.active {
                        background-color: #00b894;
                    }
                    fieldset {
                        color: aliceblue;
                    }
                </style>
                <fieldset>
                    <legend>CITY POLICIES</legend>
                    
                    <fieldset>
                        <p>
                            <button id="ads">City Adverts</button>
                            <pre>
                                <h3>Description</h3>
                                Advertisments for your city, Increases Demand, costs a lot of money though!
                                Stats:
                                Demand: +20
                                Expenses: +20
                            </pre>
                        </p>
                    </fieldset>
                    <br>
                    <br>
                    <fieldset>
                        <p>
                            <button id="water_lessenation">Water Usage Awareness</button>
                            <pre>
                                <h3>Description</h3>
                                A water awareness program, Lessens Water Use, but increases expenses 'slightly'
                                <strong>CANNOT BE USED IF Energy Usage Awarenss IS ACTIVE</strong>
                                Stats: 
                                Water: +8
                                Expenses +5
                            </pre>
                        </p>
                    </fieldset>
                    <br>
                    <br>
                    <fieldset>
                        <p>
                            <button id="energy_lessenation">Energy Usage Awareness</button>
                            <pre>
                                <h3>Description</h3>
                                A Energy Awareness Program, Lightly Decreases energy use, but increases expenses
                                <strong>CANNOT BE USED IF Water Usage Awareness IS ACTIVE</strong>
                                Stats:
                                Energy: +5
                                Expenses: +5
                            </pre>
                        </p>
                    </fieldset>
                </fieldset>
            </body>`
        policies.document.write(policie_html)
        policies.document.getElementById('energy_lessenation').addEventListener('click', () => {
            if(!city_vals.city_policies.ads && !city_vals.city_policies.water_lessenation) {
                if(city_vals.city_policies.energy_lessenation) {
                    city_vals.city_policies.energy_lessenation = false
                    new notif('Energy Awareness is Not Active Anymore')
                    policies.close()
                    return;
                }
                city_vals.city_policies.energy_lessenation = true
                new notif('Energy Awareness is active!')
                policies.close()
            } else {
                new notif(`^html
                You May Only Have <strong>ONE</strong> Policy Active!
                `)
            }
        })

        policies.document.getElementById('water_lessenation').addEventListener('click', () => {
            if(!city_vals.city_policies.energy_lessenation && !city_vals.city_policies.ads) {
                if(city_vals.city_policies.water_lessenation) {
                    city_vals.city_policies.water_lessenation = false
                    new notif('Water Awareness is Not Active Anymore')
                    policies.close()
                    return;
                }
                city_vals.city_policies.water_lessenation = true
                new notif('Water Awareness is Active')
                policies.close()
            } else {
                new notif(`^html
                You May Only Have <strong>ONE</strong> Policy Active!
                `)
            }
        })

        policies.document.getElementById('ads').addEventListener('click', () => {
            if(!city_vals.city_policies.energy_lessenation && !city_vals.city_policies.water_lessenation) {
                if(city_vals.city_policies.ads) {
                    city_vals.city_policies.ads = false
                    new notif('City Advertising is Not Active Anymore')
                    policies.close()
                    return;
                }
                city_vals.city_policies.ads = true
                new notif('City Advertising is Active')
                policies.close()
            } else {
                new notif(`^html
                You May Only Have <strong>ONE</strong> Policy Active!
                `)
            }
        })
    }  
}
*/