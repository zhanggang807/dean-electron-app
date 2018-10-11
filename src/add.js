const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipcRender = electron.ipcRenderer

const closeBtn = document.getElementById('closeBtn')

closeBtn.addEventListener('click', function(event){
    var win = remote.getCurrentWindow()
    win.close()
})

const updateBtn = document.getElementById('updateBtn')
updateBtn.addEventListener('click', function(){
    ipcRender.send('update-notify-value', document.getElementById('notifyVal').value)

    var win = remote.getCurrentWindow()
    win.close()
})