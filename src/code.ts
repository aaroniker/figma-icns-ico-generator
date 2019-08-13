async function compile(node) {
    if(node.type == 'FRAME' && node.width == node.height) {
        if(node.width <= 2048) {
            node.exportAsync().then(buffer => {
                figma.showUI(__html__, {
                    width: 312,
                    height: 252
                })
                figma.ui.postMessage({
                    type: 'compile',
                    buffer: buffer,
                    size: node.width
                })
            })
        } else {
            figma.closePlugin('Maximal width/height is 2048px')
        }
    } else {
        figma.closePlugin('Select a single quadratic frame node.')
    }
}

if(figma.currentPage.selection.length !== 1) {
    figma.closePlugin('Select a single node.')
}

compile(figma.currentPage.selection[0])
