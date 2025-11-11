/// <reference types="@figma/plugin-typings" />

// Constants - Design tokens (plugins can't access Figma variables, so we use constants)
const LAYOUT = {
  FRAME_WIDTH: 1920,
  FRAME_BASE_HEIGHT: 1090,
  FRAME_MIN_HEIGHT: 1090,
  STEP_HEIGHT: 100,
  FRAME_HEADER_HEIGHT: 56,
  LEFT_COLUMN_WIDTH: 360,
  RIGHT_COLUMN_WIDTH: 360,
  CENTER_COLUMN_X: 360, // Left column width
  CENTER_COLUMN_WIDTH: 1200, // 1920 - 360 - 360
  STICKER_SHEET_OFFSET: 450,
  STICKER_SHEET_HEIGHT: 960,  // ADD THIS LINE
  METADATA_START_Y: 91,
  METADATA_SPACING: 112,
  NOTE_START_Y: 83,
  NOTE_SPACING: 100,
  FLOW_START_Y: 120,
  FLOW_SPACING: 80
};

const FONTS = {
  FAMILY: "Inter",
  REGULAR: { family: "Inter", style: "Regular" },
  BOLD: { family: "Inter", style: "Bold" }
};

figma.showUI(__html__, { width: 400, height: 600 });

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'initialize-flow') {
      await createFlowDiagram(msg.data);
      figma.closePlugin();
    }
    
    if (msg.type === 'cancel') {
      figma.closePlugin();
    }
  } catch (error) {
    console.error('Error in message handler:', error);
    figma.notify(`Error: ${error instanceof Error ? error.message : String(error)}`);
  }
};

async function createFlowDiagram(data: any) {
  console.log('createFlowDiagram called with data:', data);
  try {
    // Store the current page to return to it later
    const originalPage = figma.currentPage;
    
    // Load fonts once at the start
    await figma.loadFontAsync(FONTS.REGULAR);
    await figma.loadFontAsync(FONTS.BOLD);
    
    const isDark = data.theme === 'dark';
    const steps = parseFlowSteps(data.flowSteps);
    console.log('Parsed steps:', steps);
    const flowName = data.flowName || 'Flow Diagram';
    
    const colors = isDark ? {
      frameBg: { r: 0.2, g: 0.2, b: 0.2 },
      columnBg: { r: 0.15, g: 0.15, b: 0.15 },
      text: { r: 0.953, g: 0.953, b: 0.953 },
      textDark: { r: 1, g: 1, b: 1 },
      border: { r: 0.46, g: 0.46, b: 0.46 },
      shapeFill: { r: 0.173, g: 0.173, b: 0.173 },
      shapeStroke: { r: 1, g: 1, b: 1 },
      stepNumber: { r: 0.604, g: 0.706, b: 0.718 }
    } : {
      frameBg: { r: 1, g: 1, b: 1 },
      columnBg: { r: 0.961, g: 0.961, b: 0.961 },
      text: { r: 0.118, g: 0.118, b: 0.118 },
      textDark: { r: 0.192, g: 0.192, b: 0.192 },
      border: { r: 0.46, g: 0.46, b: 0.46 },
      shapeFill: { r: 1, g: 1, b: 1 },
      shapeStroke: { r: 0.459, g: 0.459, b: 0.459 },
      stepNumber: { r: 0.58, g: 0.58, b: 0.58 }
    };
    
    // Create or find the components page (with theme suffix)
    const themeMode = isDark ? 'Dark Mode' : 'Light Mode';
    const componentsPageName = `Components - UX Flow Logic - ${themeMode}`;
    
    let componentsPage = figma.root.children.find(
      page => page.type === 'PAGE' && page.name === componentsPageName
    ) as PageNode | undefined;
    
    if (!componentsPage) {
      componentsPage = figma.createPage();
      componentsPage.name = componentsPageName;
    }
    
    // Switch to components page temporarily to create components there
    await figma.setCurrentPageAsync(componentsPage);

    // Calculate frame height based on number of steps entered
    const contentSteps = steps.length > 0 ? steps.length : 3;
    const baseHeightFromSteps = 200 + (contentSteps * LAYOUT.STEP_HEIGHT);
    
    // Create metadata container temporarily to calculate its height
    const tempMetadataContainer = figma.createFrame();
    tempMetadataContainer.name = "Metadata Container";
    tempMetadataContainer.layoutMode = 'VERTICAL';
    tempMetadataContainer.itemSpacing = 36;
    tempMetadataContainer.fills = [];
    tempMetadataContainer.resize(328, 10);
    tempMetadataContainer.primaryAxisSizingMode = 'AUTO';
    tempMetadataContainer.counterAxisSizingMode = 'FIXED';
    
    await createMetadataSection(tempMetadataContainer, "Trigger", data.trigger, colors);
    await createMetadataSection(tempMetadataContainer, "Assumptions", data.assumptions, colors);
    await createMetadataSection(tempMetadataContainer, "Pre-Conditions", data.preconditions, colors);
    await createMetadataSection(tempMetadataContainer, "Post-Conditions", data.postconditions, colors);
    
    // Get the actual height of metadata content
    const metadataHeight = tempMetadataContainer.height;
    const requiredHeightForMetadata = LAYOUT.FRAME_HEADER_HEIGHT + 16 + metadataHeight + 16; // Header + top padding + metadata + bottom padding
    
    // Calculate height needed for notes on the right side
    let requiredHeightForNotes = LAYOUT.FRAME_HEADER_HEIGHT + 16; // Start with header + top padding
    if (steps.length > 0) {
      // Get the Note component to measure its height
      const noteComponent = await getOrCreateNoteComponent(isDark, colors);
      
      // Estimate total notes height: sum of all note heights + spacing between them
      for (let i = 0; i < steps.length; i++) {
        // Create a temporary instance to measure actual height with content
        const tempNoteInstance = noteComponent.createInstance();
        
        // Update the details text to measure with actual content
        const detailsNode = tempNoteInstance.findOne(node => 
          node.type === 'TEXT' && node.name === 'Details for this step'
        ) as TextNode | null;
        
        if (detailsNode) {
          await figma.loadFontAsync(detailsNode.fontName as FontName);
          detailsNode.characters = steps[i];
        }
        
        requiredHeightForNotes += tempNoteInstance.height + 24; // Note height + gap
        tempNoteInstance.remove(); // Clean up temporary instance
      }
      requiredHeightForNotes += 16; // Bottom padding
    }
    
    // Use the largest of all height requirements
    const calculatedHeight = Math.max(
      LAYOUT.FRAME_MIN_HEIGHT,
      baseHeightFromSteps,
      requiredHeightForMetadata,
      requiredHeightForNotes
    );
    
    const mainFrame = figma.createFrame();
    // Use flowName if provided, otherwise default to 'Flow diagram'
    mainFrame.name = data.flowName && data.flowName.trim() !== '' ? data.flowName : 'Flow diagram';
    mainFrame.resize(LAYOUT.FRAME_WIDTH, calculatedHeight);
    mainFrame.fills = [{ type: 'SOLID', color: colors.frameBg }];
    mainFrame.x = 0;
    mainFrame.y = 0;
    
    const nameText = figma.createText();
    nameText.characters = data.flowName && data.flowName.trim() !== '' ? data.flowName : 'Name of the flow';
    nameText.fontSize = 14;
    nameText.fontName = FONTS.REGULAR;
    nameText.fills = [{ type: 'SOLID', color: colors.text }];
    nameText.x = 16;
    nameText.y = 17;
    mainFrame.appendChild(nameText);
    
    const hRule = figma.createLine();
    hRule.resize(LAYOUT.FRAME_WIDTH, 0);
    hRule.x = 0;
    hRule.y = 48;
    hRule.strokes = [{ type: 'SOLID', color: colors.border }];
    hRule.strokeWeight = 1;
    mainFrame.appendChild(hRule);
    
    const leftBg = figma.createRectangle();
    leftBg.name = "Background for Summary";
    leftBg.resize(LAYOUT.LEFT_COLUMN_WIDTH, calculatedHeight - LAYOUT.FRAME_HEADER_HEIGHT);
    leftBg.x = 0;
    leftBg.y = LAYOUT.FRAME_HEADER_HEIGHT;
    leftBg.fills = [{ type: 'SOLID', color: colors.columnBg }];
    leftBg.constraints = {
      horizontal: 'MIN',
      vertical: 'STRETCH'
    };
    mainFrame.appendChild(leftBg);
    
    const rightBg = figma.createRectangle();
    rightBg.name = "Background for Notes";
    rightBg.resize(LAYOUT.RIGHT_COLUMN_WIDTH, calculatedHeight - LAYOUT.FRAME_HEADER_HEIGHT);
    rightBg.x = LAYOUT.FRAME_WIDTH - LAYOUT.RIGHT_COLUMN_WIDTH;
    rightBg.y = LAYOUT.FRAME_HEADER_HEIGHT;
    rightBg.fills = [{ type: 'SOLID', color: colors.columnBg }];
    rightBg.constraints = {
      horizontal: 'MAX',
      vertical: 'STRETCH'
    };
    mainFrame.appendChild(rightBg);
    
    // Add the metadata container we created earlier for height calculation
    tempMetadataContainer.x = 16; // Flush left with flow diagram text
    tempMetadataContainer.y = LAYOUT.FRAME_HEADER_HEIGHT + 16; // 16px below top edge of Background for Summary
    mainFrame.appendChild(tempMetadataContainer);
    
    // Switch back to original page and add main frame there
    await figma.setCurrentPageAsync(originalPage);
    figma.currentPage.appendChild(mainFrame);
    
    // Create sticker sheet on original page (where user is working)
    await createStickerSheet(
      mainFrame.x - LAYOUT.STICKER_SHEET_OFFSET, 
      mainFrame.y, 
      isDark, 
      colors,
      componentsPage  // Pass components page reference
    );
    
    // Only create center flow instances if user entered steps
    if (steps.length > 0) {
      // Get the Note component (from components page)
      const noteComponent = await getOrCreateNoteComponent(isDark, colors);
      
      // Create numbered notes on the right with actual step text, with 24px spacing between them
      let currentNoteY = LAYOUT.FRAME_HEADER_HEIGHT + 16; // 16px below top edge of Background for Notes
      for (let i = 0; i < steps.length; i++) {
        const noteInstance = noteComponent.createInstance();
        noteInstance.x = LAYOUT.FRAME_WIDTH - LAYOUT.RIGHT_COLUMN_WIDTH + 16; // 16px from left edge of Background for Notes
        noteInstance.y = currentNoteY;
        
        // Update the number text
        const numberNode = noteInstance.findOne(node => 
          node.type === 'TEXT' && node.name === 'Number associated with the step'
        ) as TextNode | null;
        
        if (numberNode) {
          await figma.loadFontAsync(numberNode.fontName as FontName);
          numberNode.characters = (i + 1).toString();
        }
        
        // Update the details text
        const detailsNode = noteInstance.findOne(node => 
          node.type === 'TEXT' && node.name === 'Details for this step'
        ) as TextNode | null;
        
        if (detailsNode) {
          await figma.loadFontAsync(detailsNode.fontName as FontName);
          detailsNode.characters = steps[i];
        }
        
        mainFrame.appendChild(noteInstance);
        
        // Calculate next Y position: current Y + note height + 24px gap
        currentNoteY += noteInstance.height + 24;
      }
      
      // Get existing components (already created by sticker sheet on components page)
      const components = await getOrCreateFlowComponents(isDark, colors);
      console.log('Creating center flow instances for', steps.length, 'steps');
      const stepInstances = await createCenterFlowInstances(mainFrame, steps, components, colors);
      console.log('Step instances created:', stepInstances.length);
    }
    
    // Return to original page
    await figma.setCurrentPageAsync(originalPage);
    
    figma.currentPage.selection = [mainFrame];
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    
    figma.notify('Flow diagram and sticker sheet created!');
  } catch (error) {
    console.error('Error creating flow diagram:', error);
    figma.notify(`Failed to create flow diagram: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

function parseFlowSteps(input: string): string[] {
  if (!input || input.trim() === '') {
    // Return placeholder steps if no input provided
    return [
      'Start of the flow (replace this)',
      'Associated with the second step',
      'Associated with the third step'
    ];
  }
  
  const lines = input.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // Fixed regex: no need to escape dash when it's at the end of character class
  return lines.map(line => {
    return line.replace(/^[\d]+[\.\)]\s*|^[â€¢\-]\s*/, '').trim();
  }).filter(step => step.length > 0);
}

async function createMetadataSection(parent: FrameNode, title: string, content: string, colors: any) {
  // Create an auto layout frame for this section
  const sectionFrame = figma.createFrame();
  sectionFrame.name = title;
  sectionFrame.layoutMode = 'VERTICAL';
  sectionFrame.itemSpacing = 4; // 4px between title and content
  sectionFrame.fills = [];
  sectionFrame.resize(328, 10); // Width fixed, height will auto-adjust
  sectionFrame.primaryAxisSizingMode = 'AUTO'; // Height grows with content
  sectionFrame.counterAxisSizingMode = 'FIXED'; // Width stays at 328px
  sectionFrame.layoutAlign = 'STRETCH'; // Stretch to parent width
  
  const titleText = figma.createText();
  titleText.name = title;
  titleText.characters = title;
  titleText.fontSize = 14;
  titleText.fontName = FONTS.BOLD;
  titleText.fills = [{ type: 'SOLID', color: colors.text }];
  titleText.textAutoResize = 'HEIGHT'; // Auto-resize vertically, fixed width
  titleText.resize(328, titleText.height);
  titleText.layoutAlign = 'STRETCH';
  sectionFrame.appendChild(titleText);
  
  const contentText = figma.createText();
  contentText.name = `${title} content`;
  contentText.characters = content || `Replace this with the ${title.toLowerCase()} for this flow`;
  contentText.fontSize = 14;
  contentText.fontName = FONTS.REGULAR;
  contentText.fills = [{ type: 'SOLID', color: colors.text }];
  contentText.textAutoResize = 'HEIGHT'; // Auto-resize vertically, fixed width
  contentText.resize(328, contentText.height);
  contentText.layoutAlign = 'STRETCH';
  sectionFrame.appendChild(contentText);
  
  parent.appendChild(sectionFrame);
}

// Get or create Note component
async function getOrCreateNoteComponent(
  isDark: boolean,
  colors: any
): Promise<ComponentNode> {
  const themePrefix = isDark ? 'Dark' : 'Light';
  const noteName = `${themePrefix} mode / Note`;
  
  // Get the components page with theme suffix
  const themeMode = isDark ? 'Dark Mode' : 'Light Mode';
  const componentsPageName = `Components - UX Flow Logic - ${themeMode}`;
  
  const componentsPage = figma.root.children.find(
    page => page.type === 'PAGE' && page.name === componentsPageName
  ) as PageNode | undefined;
  
  if (!componentsPage) {
    throw new Error('Components page not found');
  }
  
  // Search for existing component in components page
  let noteComponent = componentsPage.findOne(node => 
    node.type === 'COMPONENT' && node.name === noteName
  ) as ComponentNode | null;
  
  // Create if doesn't exist
  if (!noteComponent) {
    // Switch to components page to create component there
    const currentPage = figma.currentPage;
    await figma.setCurrentPageAsync(componentsPage);
    
    noteComponent = createFlowShapeComponent('note', colors, isDark);
    noteComponent.x = 200; // Position to the right of other components
    noteComponent.y = 0;
    
    // Switch back to original page
    await figma.setCurrentPageAsync(currentPage);
  }
  
  return noteComponent;
}

// Get existing components (created by sticker sheet)
async function getOrCreateFlowComponents(
  isDark: boolean, 
  colors: any
): Promise<{
  enterProcess: ComponentNode,
  userAction: ComponentNode
}> {
  const themePrefix = isDark ? 'Dark' : 'Light';
  const enterProcessName = `${themePrefix} mode / Enter process`;
  const userActionName = `${themePrefix} mode / User action or system response`;
  
  // Get the components page with theme suffix
  const themeMode = isDark ? 'Dark Mode' : 'Light Mode';
  const componentsPageName = `Components - UX Flow Logic - ${themeMode}`;
  
  const componentsPage = figma.root.children.find(
    page => page.type === 'PAGE' && page.name === componentsPageName
  ) as PageNode | undefined;
  
  if (!componentsPage) {
    throw new Error('Components page not found');
  }
  
  // Search for existing components in the components page
  let enterProcess = componentsPage.findOne(node => 
    node.type === 'COMPONENT' && node.name === enterProcessName
  ) as ComponentNode | null;
  
  let userAction = componentsPage.findOne(node => 
    node.type === 'COMPONENT' && node.name === userActionName
  ) as ComponentNode | null;
  
  // Safety fallback: create if they somehow don't exist
  if (!enterProcess || !userAction) {
    const currentPage = figma.currentPage;
    await figma.setCurrentPageAsync(componentsPage);
    
    if (!enterProcess) {
      enterProcess = createFlowShapeComponent('enterProcess', colors, isDark);
      enterProcess.x = 0;
      enterProcess.y = 0;
    }
    
    if (!userAction) {
      userAction = createFlowShapeComponent('userAction', colors, isDark);
      userAction.x = 0;
      userAction.y = 50;
    }
    
    await figma.setCurrentPageAsync(currentPage);
  }
  
  return { enterProcess, userAction };
}

async function createCenterFlowInstances(parent: FrameNode, steps: string[], components: {
  enterProcess: ComponentNode,
  userAction: ComponentNode
}, colors: any): Promise<InstanceNode[]> {
  const centerX = LAYOUT.CENTER_COLUMN_X + (LAYOUT.CENTER_COLUMN_WIDTH / 2);
  let currentY = LAYOUT.FLOW_START_Y;
  const arrowLength = 32; // Length of arrow between steps
  
  // Array to store all step instances
  const stepInstances: InstanceNode[] = [];
  
  // First component: Enter process (oval)
  const enterInstance = components.enterProcess.createInstance();
  enterInstance.x = centerX - (enterInstance.width / 2);
  enterInstance.y = currentY;
  
  // Update step number directly in text node
  await updateInstanceStepNumber(enterInstance, '1');
  
  parent.appendChild(enterInstance);
  stepInstances.push(enterInstance);
  currentY += enterInstance.height;
  
  // For remaining steps: arrow â†’ step â†’ arrow â†’ step...
  for (let i = 1; i < steps.length; i++) {
    // Create arrow line (vertical, pointing down) with arrow endpoint
    const arrow = figma.createVector();
    arrow.name = `Arrow ${i} to ${i + 1}`;
    arrow.x = centerX;
    arrow.y = currentY;
    arrow.strokes = [{
      type: 'SOLID',
      color: colors.shapeStroke
    }];
    arrow.strokeWeight = 1;
    arrow.strokeJoin = 'MITER';
    
    // Set vector network with different caps for start (NONE) and end (ARROW)
    await arrow.setVectorNetworkAsync({
      vertices: [
        { x: 0, y: 0, strokeCap: 'NONE' },
        { x: 0, y: arrowLength, strokeCap: 'ARROW_EQUILATERAL' }
      ],
      segments: [{
        start: 0,
        end: 1,
        tangentStart: { x: 0, y: 0 },
        tangentEnd: { x: 0, y: 0 }
      }],
      regions: []
    });
    
    parent.appendChild(arrow);
    currentY += arrowLength;
    
    // Create next step
    const stepInstance = components.userAction.createInstance();
    stepInstance.x = centerX - (stepInstance.width / 2);
    stepInstance.y = currentY;
    
    // Update step number directly in text node
    const stepNum = (i + 1).toString();
    await updateInstanceStepNumber(stepInstance, stepNum);
    
    parent.appendChild(stepInstance);
    stepInstances.push(stepInstance);
    currentY += stepInstance.height;
  }
  
  return stepInstances;
}

// Update step number in instance by finding and modifying text node directly
async function updateInstanceStepNumber(instance: InstanceNode, stepNumber: string) {
  try {
    // Find all text nodes named "Step #" in the instance
    const textNodes = instance.findAll(node => 
      node.type === 'TEXT' && node.name === 'Step #'
    ) as TextNode[];
    
    if (textNodes.length > 0) {
      const textNode = textNodes[0];
      // Load the font before updating
      await figma.loadFontAsync(textNode.fontName as FontName);
      textNode.characters = stepNumber;
    } else {
      console.warn('Could not find Step # text node in instance');
    }
  } catch (error) {
    console.error('Error updating step number:', error);
  }
}

function createFlowShapeComponent(
  type: 'enterProcess' | 'endProcess' | 'decision' | 'userAction' | 'systemAction' | 'continuesFlow' | 'concurrentStep' | 'decisionYes' | 'decisionNo' | 'note',
  colors: any,
  isDark: boolean
): ComponentNode {
  const component = figma.createComponent();
  
  const names = {
    enterProcess: 'Enter process',
    endProcess: 'End process',
    decision: 'Decision',
    userAction: 'User action or system response',
    systemAction: 'System action',
    continuesFlow: 'Continues to or from another flow',
    concurrentStep: 'Concurrent step',
    decisionYes: 'Decision - Yes',
    decisionNo: 'Decision - No',
    note: 'Note'
  };
  
  component.name = `${isDark ? 'Dark' : 'Light'} mode / ${names[type]}`;
  
  switch (type) {
    case 'enterProcess':
    case 'endProcess':
      component.resize(100, 28);
      component.layoutMode = 'HORIZONTAL';
      component.primaryAxisAlignItems = 'CENTER';
      component.counterAxisAlignItems = 'CENTER';
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.itemSpacing = 10;
      component.fills = [];
      
      const contentFrame = figma.createFrame();
      contentFrame.name = 'Step # and description';
      contentFrame.resize(100, 14);
      contentFrame.layoutMode = 'HORIZONTAL';
      contentFrame.primaryAxisAlignItems = 'CENTER';
      contentFrame.counterAxisAlignItems = 'CENTER';
      contentFrame.itemSpacing = 2;
      contentFrame.fills = [];
      
      const stepFrame = figma.createFrame();
      stepFrame.name = 'Step 1';
      stepFrame.resize(8, 12);
      stepFrame.layoutMode = 'VERTICAL';
      stepFrame.counterAxisAlignItems = 'CENTER';
      stepFrame.primaryAxisSizingMode = 'FIXED';
      stepFrame.counterAxisSizingMode = 'AUTO';
      stepFrame.paddingRight = 6;
      stepFrame.fills = [];
      
      const stepNumber = figma.createText();
      stepNumber.name = 'Step #';
      stepNumber.characters = '#';
      stepNumber.fontSize = 12;
      stepNumber.fontName = FONTS.BOLD;
      stepNumber.fills = [{ type: 'SOLID', color: colors.stepNumber }];
      stepNumber.textAlignHorizontal = 'CENTER';
      stepNumber.textAlignVertical = 'CENTER';
      stepNumber.layoutAlign = 'STRETCH';
      stepNumber.layoutGrow = 1;
      stepFrame.appendChild(stepNumber);
      
      contentFrame.appendChild(stepFrame);
      
      const processText = figma.createText();
      processText.name = 'Enter or exit process';
      processText.characters = names[type];
      processText.fontSize = 14;
      processText.fontName = FONTS.REGULAR;
      processText.fills = [{ type: 'SOLID', color: colors.textDark }];
      processText.textAlignHorizontal = 'CENTER';
      processText.textAlignVertical = 'TOP';
      contentFrame.appendChild(processText);
      
      component.appendChild(contentFrame);
      break;
      
    case 'decision':
      component.resize(116, 54);
      component.fills = [];
      
      const diamond = figma.createPolygon();
      diamond.name = 'Diamond shape';
      diamond.pointCount = 4;
      diamond.resize(110, 50);
      diamond.x = 3;
      diamond.y = 2;
      diamond.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      diamond.strokes = [{ type: 'SOLID', color: colors.shapeStroke }];
      diamond.strokeWeight = 1;
      // Add constraints so diamond scales with component
      diamond.constraints = {
        horizontal: 'STRETCH',
        vertical: 'STRETCH'
      };
      component.appendChild(diamond);
      
      // Create wrapper frame for the text content
      const decisionFrame = figma.createFrame();
      decisionFrame.name = 'Decision';
      decisionFrame.layoutMode = 'VERTICAL';
      decisionFrame.primaryAxisAlignItems = 'CENTER';
      decisionFrame.itemSpacing = 10;
      decisionFrame.paddingTop = 4;
      decisionFrame.paddingBottom = 4;
      decisionFrame.paddingLeft = 4;
      decisionFrame.paddingRight = 4;
      decisionFrame.fills = [];
      decisionFrame.x = 3;
      decisionFrame.y = 2;
      decisionFrame.resize(110, 50);
      decisionFrame.primaryAxisSizingMode = 'AUTO'; // Hug contents vertically
      decisionFrame.counterAxisSizingMode = 'FIXED'; // Fixed width (110px)
      // Add constraints so it scales with diamond
      decisionFrame.constraints = {
        horizontal: 'STRETCH',
        vertical: 'STRETCH'
      };
      
      const diamondTextFrame = figma.createFrame();
      diamondTextFrame.name = 'Step # and description';
      diamondTextFrame.resize(102, 42);
      diamondTextFrame.layoutMode = 'VERTICAL';
      diamondTextFrame.primaryAxisAlignItems = 'CENTER';
      diamondTextFrame.itemSpacing = 2;
      diamondTextFrame.fills = [];
      diamondTextFrame.clipsContent = false; // Don't clip text when it wraps
      diamondTextFrame.layoutAlign = 'STRETCH'; // Stretch to fill parent
      diamondTextFrame.primaryAxisSizingMode = 'AUTO'; // HUG contents vertically - grows with text
      diamondTextFrame.counterAxisSizingMode = 'FIXED'; // Will be overridden by layoutAlign STRETCH
      
      const diamondNumber = figma.createText();
      diamondNumber.name = 'Step #';
      diamondNumber.characters = '#';
      diamondNumber.fontSize = 12;
      diamondNumber.fontName = FONTS.BOLD;
      diamondNumber.fills = [{ type: 'SOLID', color: colors.stepNumber }];
      diamondNumber.textAlignHorizontal = 'CENTER';
      diamondNumber.textAlignVertical = 'CENTER';
      diamondNumber.textAutoResize = 'HEIGHT'; // horizontal: fill, vertical: hug
      diamondNumber.layoutAlign = 'STRETCH'; // Fill parent width
      diamondTextFrame.appendChild(diamondNumber);
      
      const diamondDesc = figma.createText();
      diamondDesc.name = 'Step description';
      diamondDesc.characters = 'Step info';
      diamondDesc.fontSize = 14;
      diamondDesc.fontName = FONTS.REGULAR;
      diamondDesc.fills = [{ type: 'SOLID', color: colors.textDark }];
      diamondDesc.textAlignHorizontal = 'CENTER';
      diamondDesc.textAlignVertical = 'TOP';
      diamondDesc.textAutoResize = 'HEIGHT'; // horizontal: fill, vertical: hug
      diamondDesc.layoutAlign = 'STRETCH'; // Fill parent width
      diamondTextFrame.appendChild(diamondDesc);
      
      decisionFrame.appendChild(diamondTextFrame);
      component.appendChild(decisionFrame);
      break;
      
    case 'userAction':
      component.resize(100, 54);
      component.layoutMode = 'HORIZONTAL';
      component.counterAxisAlignItems = 'MIN'; // Align to top
      component.primaryAxisAlignItems = 'CENTER';
      component.paddingTop = 2; // 2px top padding
      component.paddingBottom = 4;
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      component.strokes = [{ type: 'SOLID', color: colors.shapeStroke }];
      component.strokeWeight = 1;
      component.primaryAxisSizingMode = 'AUTO'; // Hug contents horizontally
      component.counterAxisSizingMode = 'AUTO'; // Hug contents vertically
      component.minWidth = 100; // Minimum width constraint
      component.minHeight = 54; // Minimum height constraint
      
      const rectTextFrame = figma.createFrame();
      rectTextFrame.name = 'Step # and description';
      rectTextFrame.layoutMode = 'VERTICAL';
      rectTextFrame.primaryAxisAlignItems = 'CENTER';
      rectTextFrame.itemSpacing = 2;
      rectTextFrame.layoutGrow = 1; // Fill parent
      rectTextFrame.fills = [];
      
      const rectNumber = figma.createText();
      rectNumber.name = 'Step #';
      rectNumber.characters = '#';
      rectNumber.fontSize = 12;
      rectNumber.fontName = FONTS.BOLD;
      rectNumber.fills = [{ type: 'SOLID', color: colors.stepNumber }];
      rectNumber.textAlignHorizontal = "CENTER";
      rectNumber.textAlignVertical = "CENTER";
      rectNumber.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      rectNumber.layoutAlign = 'STRETCH'; // Fill parent width for centering
      rectTextFrame.appendChild(rectNumber);
      
      const rectDesc = figma.createText();
      rectDesc.name = 'Step description';
      rectDesc.characters = 'Step info';
      rectDesc.fontSize = 14;
      rectDesc.fontName = FONTS.REGULAR;
      rectDesc.fills = [{ type: 'SOLID', color: colors.textDark }];
      rectDesc.textAlignHorizontal = "CENTER";
      rectDesc.textAlignVertical = "TOP";
      rectDesc.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      rectDesc.layoutAlign = 'STRETCH'; // Fill parent width for centering
      rectTextFrame.appendChild(rectDesc);
      
      component.appendChild(rectTextFrame);
      break;
      
    case 'systemAction':
      component.resize(100, 54);
      component.layoutMode = 'HORIZONTAL';
      component.counterAxisAlignItems = 'MIN'; // Align to top
      component.primaryAxisAlignItems = 'CENTER';
      component.paddingTop = 2; // 2px top padding
      component.paddingBottom = 4;
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      component.strokes = [{ type: 'SOLID', color: colors.shapeStroke }];
      component.strokeWeight = 1;
      component.cornerRadius = 90000;
      component.primaryAxisSizingMode = 'AUTO'; // Hug contents horizontally
      component.counterAxisSizingMode = 'AUTO'; // Hug contents vertically
      component.minWidth = 100; // Minimum width constraint
      component.minHeight = 54; // Minimum height constraint
      
      const pillTextFrame = figma.createFrame();
      pillTextFrame.name = 'Step # and description';
      pillTextFrame.layoutMode = 'VERTICAL';
      pillTextFrame.primaryAxisAlignItems = 'CENTER';
      pillTextFrame.itemSpacing = 2;
      pillTextFrame.layoutGrow = 1; // Fill parent
      pillTextFrame.fills = [];
      
      const pillNumber = figma.createText();
      pillNumber.name = 'Step #';
      pillNumber.characters = '#';
      pillNumber.fontSize = 12;
      pillNumber.fontName = FONTS.BOLD;
      pillNumber.fills = [{ type: 'SOLID', color: colors.stepNumber }];
      pillNumber.textAlignHorizontal = 'CENTER';
      pillNumber.textAlignVertical = 'CENTER';
      pillNumber.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      pillNumber.layoutAlign = 'STRETCH'; // Fill parent width for centering
      pillTextFrame.appendChild(pillNumber);
      
      const pillDesc = figma.createText();
      pillDesc.name = 'Step description';
      pillDesc.characters = 'Step info';
      pillDesc.fontSize = 14;
      pillDesc.fontName = FONTS.REGULAR;
      pillDesc.fills = [{ type: 'SOLID', color: colors.textDark }];
      pillDesc.textAlignHorizontal = 'CENTER';
      pillDesc.textAlignVertical = 'TOP';
      pillDesc.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      pillDesc.layoutAlign = 'STRETCH'; // Fill parent width for centering
      pillTextFrame.appendChild(pillDesc);
      
      component.appendChild(pillTextFrame);
      break;
      
    case 'continuesFlow':
      component.resize(100, 54);
      component.layoutMode = 'HORIZONTAL';
      component.counterAxisAlignItems = 'MIN'; // Align to top
      component.primaryAxisAlignItems = 'CENTER';
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.fills = [];
      component.primaryAxisSizingMode = 'AUTO'; // Hug contents horizontally
      component.counterAxisSizingMode = 'AUTO'; // Hug contents vertically
      component.minWidth = 100; // Minimum width constraint
      component.minHeight = 54; // Minimum height constraint
      
      const bracketFrame = figma.createFrame();
      bracketFrame.name = 'Continues to or from another flow';
      bracketFrame.layoutMode = 'VERTICAL';
      bracketFrame.primaryAxisAlignItems = 'CENTER';
      bracketFrame.itemSpacing = -4;
      bracketFrame.fills = [];
      bracketFrame.layoutAlign = 'STRETCH'; // Stretch to fill parent
      bracketFrame.layoutGrow = 1; // Fill available space vertically
      bracketFrame.counterAxisSizingMode = 'FIXED'; // Fixed width (horizontal for vertical layout)
      
      // Bracket color: #757575 in light mode, #FFFFFF in dark mode
      const bracketColor = isDark ? { r: 1, g: 1, b: 1 } : { r: 0.459, g: 0.459, b: 0.459 };
      
      const topBracket = figma.createVector();
      topBracket.name = 'Top bracket';
      topBracket.resize(100, 12);
      topBracket.vectorPaths = [{
        windingRule: 'NONZERO',
        data: 'M 0 12 L 0 0 L 100 0 L 100 12'
      }];
      topBracket.strokes = [{ type: 'SOLID', color: bracketColor }];
      topBracket.strokeWeight = 1;
      topBracket.strokeAlign = 'INSIDE';
      topBracket.strokeCap = 'NONE';
      topBracket.strokeJoin = 'MITER';
      topBracket.fills = [];
      topBracket.layoutAlign = 'STRETCH'; // Fill parent width
      topBracket.constraints = {
        horizontal: 'STRETCH',
        vertical: 'MIN'
      };
      bracketFrame.appendChild(topBracket);
      
      const continuesTextFrame = figma.createFrame();
      continuesTextFrame.name = 'Step # and description';
      continuesTextFrame.layoutMode = 'VERTICAL';
      continuesTextFrame.primaryAxisAlignItems = 'CENTER';
      continuesTextFrame.itemSpacing = 2;
      continuesTextFrame.fills = [];
      continuesTextFrame.layoutAlign = 'STRETCH'; // Stretch to fill parent
      continuesTextFrame.counterAxisSizingMode = 'FIXED'; // Fixed width (horizontal for vertical layout)
      
      const continuesNumber = figma.createText();
      continuesNumber.name = 'Step #';
      continuesNumber.characters = '#';
      continuesNumber.fontSize = 12;
      continuesNumber.fontName = FONTS.BOLD;
      continuesNumber.fills = [{ type: 'SOLID', color: colors.stepNumber }];
      continuesNumber.textAlignHorizontal = 'CENTER';
      continuesNumber.textAlignVertical = 'CENTER';
      continuesNumber.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      continuesNumber.layoutAlign = 'STRETCH'; // Fill parent width for centering
      continuesTextFrame.appendChild(continuesNumber);
      
      const continuesDesc = figma.createText();
      continuesDesc.name = 'Step description';
      continuesDesc.characters = 'Step info';
      continuesDesc.fontSize = 14;
      continuesDesc.fontName = FONTS.REGULAR;
      continuesDesc.fills = [{ type: 'SOLID', color: colors.textDark }];
      continuesDesc.textAlignHorizontal = 'CENTER';
      continuesDesc.textAlignVertical = 'TOP';
      continuesDesc.textAutoResize = 'HEIGHT'; // Only resize vertically, wrap horizontally
      continuesDesc.layoutAlign = 'STRETCH'; // Fill parent width for centering
      continuesTextFrame.appendChild(continuesDesc);
      
      bracketFrame.appendChild(continuesTextFrame);
      
      const bottomBracket = figma.createVector();
      bottomBracket.name = 'Bottom bracket';
      bottomBracket.resize(100, 12);
      bottomBracket.vectorPaths = [{
        windingRule: 'NONZERO',
        data: 'M 0 0 L 0 12 L 100 12 L 100 0'
      }];
      bottomBracket.strokes = [{ type: 'SOLID', color: bracketColor }];
      bottomBracket.strokeWeight = 1;
      bottomBracket.strokeAlign = 'INSIDE';
      bottomBracket.strokeCap = 'NONE';
      bottomBracket.strokeJoin = 'MITER';
      bottomBracket.fills = [];
      bottomBracket.layoutAlign = 'STRETCH'; // Fill parent width
      bottomBracket.constraints = {
        horizontal: 'STRETCH',
        vertical: 'MIN'
      };
      bracketFrame.appendChild(bottomBracket);
      
      component.appendChild(bracketFrame);
      break;
      
    case 'concurrentStep':
      component.resize(36, 16);
      component.fills = [];
      
      const semicircle = figma.createRectangle();
      semicircle.name = 'semi-circle';
      semicircle.resize(36, 16);
      semicircle.x = 0;
      semicircle.y = 0;
      semicircle.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      semicircle.strokes = [{ type: 'SOLID', color: colors.shapeStroke }];
      semicircle.strokeWeight = 1;
      semicircle.topLeftRadius = 1000;
      semicircle.topRightRadius = 1000;
      semicircle.bottomLeftRadius = 0;
      semicircle.bottomRightRadius = 0;
      component.appendChild(semicircle);
      break;
      
    case 'decisionYes':
      component.resize(29, 19);
      component.layoutMode = 'HORIZONTAL';
      component.primaryAxisAlignItems = 'CENTER';
      component.counterAxisAlignItems = 'CENTER';
      component.paddingTop = 2;
      component.paddingBottom = 2;
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.itemSpacing = 10;
      component.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      component.primaryAxisSizingMode = 'AUTO';
      component.counterAxisSizingMode = 'AUTO';
      
      const yesText = figma.createText();
      yesText.name = 'Text';
      yesText.characters = 'Yes';
      yesText.fontSize = 12;
      yesText.fontName = FONTS.REGULAR;
      yesText.fills = [{ type: 'SOLID', color: colors.textDark }];
      yesText.textAlignHorizontal = 'LEFT';
      yesText.textAlignVertical = 'TOP';
      component.appendChild(yesText);
      break;
      
    case 'decisionNo':
      component.resize(25, 19);
      component.layoutMode = 'HORIZONTAL';
      component.primaryAxisAlignItems = 'CENTER';
      component.counterAxisAlignItems = 'CENTER';
      component.paddingTop = 2;
      component.paddingBottom = 2;
      component.paddingLeft = 4;
      component.paddingRight = 4;
      component.itemSpacing = 10;
      component.fills = [{ type: 'SOLID', color: colors.shapeFill }];
      component.primaryAxisSizingMode = 'AUTO';
      component.counterAxisSizingMode = 'AUTO';
      
      const noText = figma.createText();
      noText.name = 'text';
      noText.characters = 'No';
      noText.fontSize = 12;
      noText.fontName = FONTS.REGULAR;
      noText.fills = [{ type: 'SOLID', color: colors.textDark }];
      noText.textAlignHorizontal = 'LEFT';
      noText.textAlignVertical = 'TOP';
      component.appendChild(noText);
      break;
      
    case 'note':
      component.layoutMode = 'HORIZONTAL';
      component.itemSpacing = 20;
      component.primaryAxisSizingMode = 'AUTO'; // Hug contents
      component.counterAxisSizingMode = 'AUTO'; // Hug contents
      component.fills = [];
      
      const numberText = figma.createText();
      numberText.name = 'Number associated with the step';
      numberText.characters = '1';
      numberText.fontSize = 14;
      numberText.fontName = FONTS.BOLD;
      numberText.fills = [{ type: 'SOLID', color: colors.text }];
      numberText.textAlignHorizontal = 'RIGHT';
      numberText.textAlignVertical = 'TOP';
      numberText.lineHeight = { value: 121.02272033691406, unit: 'PERCENT' };
      numberText.resize(52, numberText.height);
      numberText.textAutoResize = 'HEIGHT'; // Fixed width, hug height
      component.appendChild(numberText);
      
      const detailsText = figma.createText();
      detailsText.name = 'Details for this step';
      detailsText.characters = 'Details for this step';
      detailsText.fontSize = 14;
      detailsText.fontName = FONTS.REGULAR;
      detailsText.fills = [{ type: 'SOLID', color: colors.text }];
      detailsText.textAlignHorizontal = 'LEFT';
      detailsText.textAlignVertical = 'TOP';
      detailsText.lineHeight = { value: 121.02272033691406, unit: 'PERCENT' };
      detailsText.resize(251, detailsText.height);
      detailsText.textAutoResize = 'HEIGHT'; // Fixed width, hug height
      component.appendChild(detailsText);
      break;
  }
  
  return component;
}

async function createStickerSheet(x: number, y: number, isDark: boolean, colors: any, componentsPage: PageNode) {
  try {
    // Note: This function is called when figma.currentPage is the original page
    // Components will be created on the componentsPage, but sticker sheet stays on current page
    
    const stickerFrame = figma.createFrame();
    stickerFrame.name = "Flow Diagram Sticker Sheet";
    stickerFrame.resize(400, LAYOUT.STICKER_SHEET_HEIGHT);
    stickerFrame.x = x; // Allow negative positioning (to the left of main frame)
    stickerFrame.y = y;
    stickerFrame.fills = [{ type: 'SOLID', color: colors.frameBg }];
    
    const title = figma.createText();
    title.characters = "Flow Diagram Sticker Sheet";
    title.fontSize = 20;
    title.fontName = FONTS.BOLD;
    title.fills = [{ type: 'SOLID', color: colors.text }];
    title.x = 20;
    title.y = 20;
    stickerFrame.appendChild(title);
    
    const subtitle = figma.createText();
    subtitle.characters = "These markers are also available in this Figma file's \"Assets\" panel.";
    subtitle.fontSize = 12;
    subtitle.fontName = FONTS.REGULAR;
    subtitle.fills = [{ type: 'SOLID', color: colors.text }];
    subtitle.x = 20;
    subtitle.y = 50;
    subtitle.resize(360, subtitle.height);
    stickerFrame.appendChild(subtitle);
    
    let currentY = 90;
    
    const shapeTypes: Array<{type: 'enterProcess' | 'endProcess' | 'decision' | 'userAction' | 'systemAction' | 'continuesFlow' | 'concurrentStep' | 'decisionYes' | 'decisionNo' | 'note', name: string, height: number}> = [
      { type: 'enterProcess', name: "Enter process", height: 28 },
      { type: 'endProcess', name: "End process", height: 28 },
      { type: 'userAction', name: "User action or system response", height: 54 },
      { type: 'decision', name: "Decision", height: 54 },
      { type: 'systemAction', name: "System action", height: 54 },
      { type: 'continuesFlow', name: "Continues to or from another flow", height: 54 },
      { type: 'concurrentStep', name: "Concurrent step", height: 16 },
      { type: 'decisionYes', name: "Decision - Yes", height: 19 },
      { type: 'decisionNo', name: "Decision - No", height: 19 },
      { type: 'note', name: "Note", height: 26 }
    ];
    
    // Position for component masters on components page (starting at 0, 0)
    let componentY = 0;
    
    for (const shape of shapeTypes) {
      try {
        const themePrefix = isDark ? 'Dark' : 'Light';
        const componentName = `${themePrefix} mode / ${shape.name}`;
        
        // Check if component already exists in components page
        let component = componentsPage.findOne(node => 
          node.type === 'COMPONENT' && node.name === componentName
        ) as ComponentNode | null;
        
        // Only create if it doesn't exist
        if (!component) {
          // Store current page
          const currentPage = figma.currentPage;
          
          // Switch to components page to create component
          await figma.setCurrentPageAsync(componentsPage);
          
          component = createFlowShapeComponent(shape.type, colors, isDark);
          // Position component master on components page starting at x=0, y=0
          component.x = 0;
          component.y = componentY;
          componentY += shape.height + 20;
          
          // Switch back to original page
          await figma.setCurrentPageAsync(currentPage);
        }
        
        const instance = component.createInstance();
        instance.x = 20;
        instance.y = currentY;
        stickerFrame.appendChild(instance);
        
        if (shape.type !== 'enterProcess' && shape.type !== 'endProcess' && shape.type !== 'note') {
          const label = figma.createText();
          label.characters = shape.name;
          label.fontSize = 12;
          label.fontName = FONTS.REGULAR;
          label.fills = [{ type: 'SOLID', color: colors.text }];
          label.x = 140;
          label.y = currentY + (shape.height / 2) - 6;
          stickerFrame.appendChild(label);
        }
        
        currentY += shape.height + 30;
      } catch (shapeError) {
        console.error(`Error creating shape ${shape.type}:`, shapeError);
        const errorMessage = shapeError instanceof Error ? shapeError.message : String(shapeError);
        figma.notify(`Error creating ${shape.type}: ${errorMessage}`);
      }
    }
    
    currentY += 20;
    const connectorsTitle = figma.createText();
    connectorsTitle.characters = "Creating Connectors";
    connectorsTitle.fontSize = 16;
    connectorsTitle.fontName = FONTS.BOLD;
    connectorsTitle.fills = [{ type: 'SOLID', color: colors.text }];
    connectorsTitle.x = 20;
    connectorsTitle.y = currentY;
    stickerFrame.appendChild(connectorsTitle);
    
    currentY += 40;
    
    const connectorsText = figma.createText();
    connectorsText.characters = "To connect your flowchart shapes with arrows, use Figma's built-in arrow tool:\n\n1. Select the Arrow tool from the toolbar (or press Shift + X)\n2. Click and drag between shapes to create connectors\n3. Customize arrowheads, colors, and stroke weight in the Properties panel";
    connectorsText.fontSize = 12;
    connectorsText.fontName = FONTS.REGULAR;
    connectorsText.fills = [{ type: 'SOLID', color: colors.text }];
    connectorsText.textAlignHorizontal = "LEFT";
    connectorsText.x = 20;
    connectorsText.y = currentY;
    connectorsText.resize(360, connectorsText.height);
    stickerFrame.appendChild(connectorsText);
    
    figma.currentPage.appendChild(stickerFrame);
  } catch (error) {
    console.error('Error in createStickerSheet:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    figma.notify(`Sticker sheet error: ${errorMessage}`);
    throw error;
  }
}