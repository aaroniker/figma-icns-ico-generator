import './scss/ui.scss'

var $ = require('jQuery')

window.onmessage = async (event) => {
    if(event.data.pluginMessage.type == 'compile') {

        function random(length) {
            let result = '',
                characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                charactersLength = characters.length;
            for(let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        let data = new FormData(),
            base64 = btoa(new Uint8Array(event.data.pluginMessage.buffer).reduce((data, byte) => {
                return data + String.fromCharCode(byte)
            }, ''));

        data.append('base64', base64)
        data.append('random', random(16))

        fetch('https://aaroniker.me/api/icns', {
            method: 'POST',
            body: data
        }).then(response => {
            response.json().then(res => {
                $('#download a').attr({
                    href: res.url
                })
                $('#download img').attr({
                    src: 'data:image/png;base64,' + base64
                })
            })
        })
    }
}
