/// <reference types="@figma/plugin-typings" />
// This shows the UI
figma.showUI(__html__, { width: 400, height: 600 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-flow-diagram') {
    await createFlowDiagram(msg.data);
    figma.closePlugin();
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function createFlowDiagram(data: any) {
  const frame = figma.createFrame();
  frame.name = "Flow Diagram";
  frame.resize(1400, 1000);
  frame.x = figma.viewport.center.x - 700;
  frame.y = figma.viewport.center.y - 500;
  
  // Left Section - Context
  await createLeftSection(frame, data);
  
  // Center Section - Flow
  await createCenterFlow(frame, data);
  
  // Right Section - Details
  await createRightSection(frame, data);
  
  figma.currentPage.appendChild(frame);
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
}

async function createLeftSection(parent: FrameNode, data: any) {
  const sections = ['Trigger', 'Assumptions', 'Pre-Conditions', 'Post-Conditions'];
  let yPos = 50;
  
  for (const section of sections) {
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    text.fontName = { family: "Inter", style: "Bold" };
    text.characters = section;
    text.fontSize = 14;
    text.x = 20;
    text.y = yPos;
    parent.appendChild(text);
    
    const description = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    description.fontName = { family: "Inter", style: "Regular" };
    description.characters = data[section.toLowerCase()] || `Enter ${section.toLowerCase()} here`;
    description.fontSize = 12;
    description.x = 20;
    description.y = yPos + 25;
    description.resize(250, description.height);
    parent.appendChild(description);
    
    yPos += 120;
  }
}

async function createCenterFlow(parent: FrameNode, data: any) {
  // Create flow steps in the center
  const steps = data.steps || [];
  let yPos = 50;
  
  for (let i = 0; i < steps.length; i++) {
    const step = figma.createRectangle();
    step.x = 500;
    step.y = yPos;
    step.resize(200, 60);
    step.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.95, b: 1 } }];
    step.cornerRadius = 8;
    step.strokes = [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.8 } }];
    step.strokeWeight = 2;
    parent.appendChild(step);
    
    const stepText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    stepText.fontName = { family: "Inter", style: "Medium" };
    stepText.characters = `${i + 1}. ${steps[i].title}`;
    stepText.fontSize = 13;
    stepText.x = 510;
    stepText.y = yPos + 20;
    stepText.resize(180, stepText.height);
    parent.appendChild(stepText);
    
    yPos += 100;
  }
}

async function createRightSection(parent: FrameNode, data: any) {
  const steps = data.steps || [];
  let yPos = 50;
  
  for (let i = 0; i < steps.length; i++) {
    const number = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    number.fontName = { family: "Inter", style: "Bold" };
    number.characters = `${i + 1}`;
    number.fontSize = 14;
    number.x = 750;
    number.y = yPos;
    parent.appendChild(number);
    
    const detail = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    detail.fontName = { family: "Inter", style: "Regular" };
    detail.characters = steps[i].detail || "Detail description";
    detail.fontSize = 12;
    detail.x = 780;
    detail.y = yPos;
    detail.resize(580, detail.height);
    parent.appendChild(detail);
    
    yPos += 60;
  }
}