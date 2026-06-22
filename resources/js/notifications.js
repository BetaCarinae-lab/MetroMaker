export class notif {
    constructor(content, color, time) {
        this.content = content
        this.color = color
        this.time = time
        this.display()
    }

    display() {
        const container = document.getElementById('notifications-container')
        const notification = document.createElement('div')
        notification.classList.add('notification')

        if(container == null) {
            alert('NOTIF:ERROR: Container is Null')
            return;
        } 


        if(typeof this.content == "object") {
            this.content = JSON.stringify(this.content)
            notification.innerText = this.content
        } else {
            this.content = this.content
            notification.innerText = this.content
        }

        if(this.time <= 0 || !this.time) {
            this.time = 5000
        }

        if(this.color) {
            notification.style.backgroundColor = this.color
        } else {
            notification.style.backgroundColor = 'cyan'
        }

        container.appendChild(notification) 

        //house.removeChild()
        //woman.appendChild()

        setTimeout(() => {
            if(container.contains(notification)) {
                container.removeChild(notification)
            }
        }, 5000)
    }
}