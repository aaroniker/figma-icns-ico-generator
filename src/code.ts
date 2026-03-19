function slugify(str: string): string {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
  const b =
    "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");
  return str
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

type ExportableNode = FrameNode | ComponentNode | InstanceNode;

function isExportableSquare(node: SceneNode): node is ExportableNode {
  return (
    (node.type === "FRAME" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE") &&
    node.width === node.height
  );
}

async function compile(node: SceneNode) {
  if (!isExportableSquare(node)) {
    figma.closePlugin("Please select a square frame, component, or instance");
    return;
  }

  if (node.width > 2048) {
    figma.closePlugin("Maximum width/height is 2048px");
    return;
  }

  const buffer = await node.exportAsync({ format: "PNG" });

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
}

if (figma.currentPage.selection.length !== 1) {
  figma.closePlugin("Please select a single node");
} else {
  compile(figma.currentPage.selection[0]);
}
