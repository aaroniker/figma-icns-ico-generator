async function compile(node) {
    if(node.type == 'FRAME') {
        if(node.width == node.height) {
            if(node.width <= 2000) {
                node.exportAsync().then(buffer => {
                    figma.showUI(__html__)
                    figma.ui.postMessage({
                        type: 'compile',
                        buffer: buffer
                    })
                })
            } else {
                figma.closePlugin('Maximal width/height is 2000px')
            }
        } else {
            figma.closePlugin('Selection must be a square')
        }
    } else {
        figma.closePlugin('Select a single Frame node.')
    }
}

if(figma.currentPage.selection.length !== 1) {
    figma.closePlugin('Select a single node.')
}

compile(figma.currentPage.selection[0])
