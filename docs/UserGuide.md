# UX Flow Logic - User Guide

**Version 0.1.0**  
*Last Updated: October 9, 2025*

---

## Table of Contents
- [About](#about)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Opening the Plugin](#opening-the-plugin)
- [Understanding the Plugin](#understanding-the-plugin)
- [Tab 1: Summary](#tab-1-summary)
  - [Light/Dark Mode](#lightdark-mode)
  - [Flow Name](#flow-name)
  - [Contextual Information](#contextual-information)
- [Tab 2: Define Flow Steps](#tab-2-define-flow-steps)
- [Tab 3: User Guide](#tab-3-user-guide)
- [Using "Initialize flow"](#using-initialize-flow)
- [Working with Flow Diagrams](#working-with-flow-diagrams)
  - [The Three-Column Approach](#the-three-column-approach)
  - [Best Practices](#best-practices)
  - [Collaboration Tips](#collaboration-tips)
- [Troubleshooting](#troubleshooting)
- [Why This Tool Exists](#why-this-tool-exists)
- [Version History](#version-history)
- [About (Contact)](#about-1)
- [License](#license)

---

## About

UX Flow Logic is a Figma plugin for creating annotated user flow diagrams. It gives you a sticker sheet of standard flowchart symbols and lets you build your flow visually.

This plugin supports a three-column annotated flow diagram approach:
- **Left column:** Summary information (trigger, assumptions, pre-conditions, post-conditions)
- **Center column:** Numbered flow steps flowing from top to bottom
- **Right column:** Detailed notes for each numbered step

---

## Getting Started

### Installation
1. Open Figma Desktop or browser
2. Go to **Resources** → **Plugins** → **Find more plugins**
3. Search for "UX Flow Logic"
4. Select **Install**

### Opening the Plugin
1. Create or open a Figma file
2. Use the plugin on a page that's empty (if the page isn't empty, the plugin may cover existing content)
3. Right-click → **Plugins** → **UX Flow Logic**

Or use: **Cmd+/** (Mac) or **Ctrl+/** (Windows), then type "UX Flow Logic"

---

## Understanding the Plugin

The UX Flow Logic plugin has three main tabs that help you create professional flow diagrams:

1. **Summary** - Configure your flow's visual style and add contextual information
2. **Define Flow Steps** - Add the initial outline of your flow
3. **User Guide** - Access documentation and help resources

You can activate **"Initialize flow"** at any time from any tab. You don't need to complete all sections—the plugin will generate your diagram based on whatever information you've provided. Just make sure you're on an empty page in your Figma file.

---

## Tab 1: Summary

Configure the foundation of your flow diagram and add important context.

### Light/Dark Mode

Choose your preferred visual theme:

- **Light Mode**: Light backgrounds with dark shapes and text
- **Dark Mode**: Dark backgrounds with light shapes and text

If you select dark mode, both the diagram stencils and the flow diagram draft will have a dark background with light-colored stencils and text.

### Flow Name

Enter a meaningful name for your flow.

- This name will be the name of the frame containing your starter flow diagram
- The name will also appear at the top of the frame as a title

### Contextual Information

Document the important details about your flow. Click on any item to open a separate screen where you can add your text. You can also skip adding these in the plugin and add them directly to the flow diagram frame on the canvas after clicking "Initialize Flow."

**Trigger**  
What initiates this flow?

*Examples:*
- "User activates the 'Sign Up' button"
- "Password reset email link expires"  
- "Cart total exceeds $100"

**Assumptions**  
What conditions are we assuming are true?

*Examples:*
- "User has a valid email address"
- "Payment gateway is operational"
- "User is logged in"

**Pre-conditions**  
What must be true before this flow can start?

*Examples:*
- "User must be on the home page"
- "Shopping cart must contain at least one item"
- "User profile must be complete"

**Post-conditions**  
What will be true after this flow completes successfully?

*Examples:*
- "User account is created and verified"
- "Order confirmation email is sent"
- "User is redirected to dashboard"

---

## Tab 2: Define Flow Steps

Add the initial outline of your user flow by listing the main steps in sequence.

**This is a starter only.** If you have a complex flow, don't try to document everything here. Enter just the core steps to get started quickly—you'll build out the full complexity on the page.

Enter each step on a new line. Choose one of these formatting options:
- **Numbers:** 1, 2, 3...
- **Dashes:** -
- **Bullets or asterisk:** • or *

Add indentation for sub-steps or conditional branches.

**Example:**
```
1. User enters email address
2. System validates email
   - If invalid: Show error message
   - If valid: Continue to next step
3. User creates password
4. Account is created
```

---

## Tab 3: User Guide

This section lets you place the user guide directly into your Figma file as a "UX Flow Logic User Guide" section on your current page. Keep it available for reference while you work.

---

## Using "Initialize flow"

Activate **"Initialize flow"** at any time to generate your diagram. You don't need to complete all sections.

When you activate "Initialize flow," the plugin creates two things on your page:

### What Gets Generated

**1. Stencil Library (Figma components in a section)**  
A collection of standard flowchart shape components. These components are accessible in two ways:
- **On the canvas:** In a visible section you can copy from
- **Assets panel:** Drag and drop from your local components library anytime

The stencil components include:
- Rectangles for screens/pages
- Diamonds for decision points
- Ovals for start/end points
- Connectors and arrows

**Editing stencil components:**
- Change shape type (rectangle → oval → diamond) through the Properties panel
- Edit numbers and text by clicking directly on them, or through the Properties panel
- All changes maintain the component connection

**Draft Flow Diagram (in a frame)**  
A starter diagram based on the information you added in the Summary and/or Define Flow Steps sections. If you added a flow name, it becomes:
- The frame name in your layers panel  
- The title displayed at the top of the diagram

### Important Notes
- Use the plugin on an empty page (if the page isn't empty, the plugin may cover existing content)
- The generated diagram is just a starting point
- You'll likely add more steps and modify it on the page
- The plugin dialog gets you started quickly—refinement happens on the page
- You can activate "Initialize flow" multiple times on different pages

---

## Working with Flow Diagrams

### The Three-Column Approach

This plugin supports a proven layout structure that's been beneficial in UX design work:

**Left Column: Summary**  
Your trigger, assumptions, pre-conditions, and post-conditions. This provides context at a glance.

**Center Column: Numbered Steps**  
The main user journey flowing from top to bottom. This is the "happy path" through your product.

**Right Column: Details**  
Specifics for each numbered step: error states, validation rules, alternate paths, technical notes, or design considerations.

### Best Practices
- Access stencil components from the canvas section or Assets panel (whichever is faster for your workflow)
- Use the Properties panel to quickly change shape types without recreating elements
- Start with the basic flow—add complexity after the foundation is working
- Use consistent shape meanings throughout your flows
- Number your steps for easy reference in discussions
- Keep decision points clear with yes/no labels
- Document edge cases and error states
- Group related steps visually
- Add version numbers when sharing with teams

### Collaboration Tips
- Use Figma comments to discuss specific decision points
- Share the frame link for async review
- Update the flow as requirements change
- Keep archived versions for reference

---

## Troubleshooting

**Plugin won't open**  
- Refresh Figma (Cmd+R / Ctrl+R)
- Check that plugin is installed under Resources → Plugins

**Initialize flow doesn't generate anything**  
- Verify you're on a page with edit access
- Try zooming out—elements may be placed outside your current view

**Can't find generated elements**  
- Use Cmd+F (Mac) or Ctrl+F (Windows) to search for "UX Flow Logic"
- Check the Layers panel for the generated frame
- Zoom to fit the page (Shift+1)

**Dark mode shapes not visible**  
- Check your Figma page background color
- Dark mode is designed for dark page backgrounds

**Need more help?**  
- Visit [lindadesign.net/figma-plugin/ux_flow_logic.html](http://lindadesign.net/figma-plugin/ux_flow_logic.html)
- Report issues on [GitHub Issues](https://github.com/linda-n-design/figma-ux-flow-logic/issues)
- Contact information available on website

---

## Why This Tool Exists

I built this tool to help make your UX work more efficient. This annotated flow diagram method has been hugely beneficial in my career.

My first UX design manager and interaction design rock star, Chris Harper, taught me this technique when I was a junior interaction designer in 2004. This plugin is dedicated to his memory.

---

## Version History

### Version 0.1.0 (October 9, 2025)
**Beta Release**
- Core plugin functionality
- Summary tab with light/dark mode support
- Define flow steps interface
- User guide tab with documentation links
- "Initialize flow" generation
- Component-based stencil library (accessible from page and Assets panel)
- Editable shape variants and text properties

---

## About

**UX Flow Logic** is created and maintained by Linda Nakasone.

- Website: [lindadesign.net](http://lindadesign.net)
- GitHub: [github.com/linda-n-design/figma-ux-flow-logic](https://github.com/linda-n-design/figma-ux-flow-logic)
- Support: Contact information available on website

---

## License

MIT License - Copyright (c) 2025 Linda Nakasone

See the [LICENSE](../LICENSE) file for full details.

---

*Thank you for using UX Flow Logic! If you find this plugin helpful, please consider leaving a review on the Figma Community page.*