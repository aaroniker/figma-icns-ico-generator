async function compile(node) {
  if (node.type == "FRAME" && node.width == node.height) {
    if (node.width <= 2048) {
      function slugify(string) {
        const a =
          "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
        const b =
          "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
        const p = new RegExp(a.split("").join("|"), "g");
        return string
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(p, (c) => b.charAt(a.indexOf(c)))
          .replace(/&/g, "-and-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
      }
      node.exportAsync().then((buffer) => {
        figma.showUI(__html__, {
          width: 312,
          height: 272,
          themeColors: true,
        });
        figma.ui.postMessage({
          type: "compile",
          buffer: buffer,
          size: node.width,
          name: slugify(node.name),
        });
      });
    } else {
      figma.closePlugin("Maximal width/height is 2048px");
    }
  } else {
    figma.closePlugin("Please select a square frame");
  }
}

if (figma.currentPage.selection.length !== 1) {
  figma.closePlugin("Please select a single node");
}

compile(figma.currentPage.selection[0]);
