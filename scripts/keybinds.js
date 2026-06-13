function keybindmenu() {
    const keybindwindow = window.open('', '_blank', 'width=600,height=400')
    if(keybindwindow) {
        const html = `<!DOCTYPE html>
<style>
    button {
        background-color: #3c3c3c;
        color: white;
        border-radius: 50;
    }
    button :hover {
        background-color: #5d5c5c;
        color: white;
    }
    body {
        background-color: #1e1e1e;
    }
    fieldset {
        color: white;
    }
</style>
<body>
    <fieldset>
        <legend>Keybind Menu</legend>
        <button id="change-zoom-in">Change Zoom In: Current ${keybinds.in}</button> <br>
        <button id="change-zoom-out">Change Zoom Out: Current ${keybinds.out}</button> <br>
        <button id="change-up">Change Up Key: Current ${keybinds.up}</button> <br>
        <button id="change-down">Change Down Key: Current ${keybinds.down}</button> <br>
        <button id="change-left">Change Left Key: Current ${keybinds.left}</button> <br>
        <button id="change-right">Change Right Key: Current ${keybinds.right}</button> <br>
        <button id="reset">Reset Keybinds</button> <br>
        <button id="close">Close Window</button> <br>
    </fieldset>
</body>`
        keybindwindow.document.write(html)
        const kdocument = keybindwindow.document
        //const buildkey = document.getElementById('change-build')
        const inkey = kdocument.getElementById('change-zoom-in')
        const outkey = kdocument.getElementById('change-zoom-out')
        const upkey = kdocument.getElementById('change-up')
        const downkey = kdocument.getElementById('change-down')
        const leftkey = kdocument.getElementById('change-left')
        const rightkey = kdocument.getElementById('change-right')
        const resetkey = kdocument.getElementById('reset')
        const closekey = kdocument.getElementById('close')
        const listeningfor = {
            key: null,
            text: null,
            ref: null,
        }
        closekey.addEventListener('click', () => { keybindwindow.close() })
        resetkey.addEventListener('click', () => {
            keybinds.up = 'w'
            keybinds.down = 's'
            keybinds.left = 'a'
            keybinds.right = 'd'
            keybinds.in = 'q'
            keybinds.out = 'e'
            keybindwindow.close()
            new notif('Reset Keybinds!')
        })
        inkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('inkey')
            inkey.textContent = 'Listening for key!'
            listeningfor.text = `Zoom In: `
            listeningfor.key = 'in'
            listeningfor.ref = inkey
            
        })
        outkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('outkey')
            outkey.textContent = 'Listening for key!'
            listeningfor.text = `Zoom Out: `
            listeningfor.key = 'out'
            listeningfor.ref = outkey
        })
        upkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('upkey')
            upkey.textContent = 'Listening for key!'
            listeningfor.text = `Go Up: `
            listeningfor.key = 'up'
            listeningfor.ref = upkey
        })
        downkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('downkey')
            downkey.textContent = 'Listening for key!'
            listeningfor.text = `Go Down: `
            listeningfor.key = 'down'
            listeningfor.ref = downkey
        })
        leftkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('leftkey')
            leftkey.textContent = 'Listening for key!'
            listeningfor.text = `Go Left: `
            listeningfor.key = 'left'
            listeningfor.ref = leftkey
        })
        rightkey.addEventListener('click', () => {
            ///const defaultkeycontent = inkey.textContent
            new notif('rightkey')
            rightkey.textContent = 'Listening for key!'
            listeningfor.text = `Zoom Right: `
            listeningfor.key = 'right'
            listeningfor.ref = rightkey
        })
        kdocument.addEventListener('keydown', (e) => {
            if(listeningfor) {
                keybinds[listeningfor] = e.key
                listeningfor.ref.textContent = listeningfor.text + keybinds[listeningfor]
                listeningfor = {
                    text: null,
                    key: null,
                    ref: null,
                }
            }
        })
    }
}