# UX Flow Logic - User Guide

**Version 1.0**  
*Last Updated: October 13, 2025*

---

## Table of contents
- [About](#about)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Running the plugin](#running-the-plugin)
- [Understanding the plugin](#understanding-the-plugin)
  - [Summary](#summary)
  - [Define flow steps](#define-flow-steps)
- [Using "Initialize flow"](#using-initialize-flow)
  - [What gets generated](#what-gets-generated)
  - [Important notes](#important-notes)
- [Working with flow diagrams](#working-with-flow-diagrams)
  - [The three-column approach](#the-three-column-approach)
  - [Best practices](#best-practices)
  - [Collaboration tips](#collaboration-tips)
- [Why this tool exists](#why-this-tool-exists)
- [Version history](#version-history)
- [About](#about-1)
- [License](#license)

---

## About

UX Flow Logic is a Figma plugin for creating annotated user flow diagrams.

Create annotated flow diagrams linked to detail notes. Each numbered step connects to its explanation—clean visuals with complete documentation. Map micro-interactions, user journeys, system connections, or service design flows. Generate templates with metadata sections and flowchart stencils in coordinating light or dark themes. One structured approach for thinking through complexity and communicating it clearly to your team or stakeholders.

---

## Getting started

### Installation

1. Visit the ["UX Flow Logic" Figma Community page](https://www.figma.com/community/plugin/1548695544263550149/ux-flow-logic) and select "Open in…"
2. In your Figma Design file, select "Save."

### Running the plugin

1. Create or open a Figma Design file. Note that this version of Figma is not designed for FigJam, but future versions might be.
2. Open the "UX Flow Logic" plugin on an empty page for best results. If the page contains existing content, the plugin may overlay the flow diagram template and sticker sheet on top of it.

---

## Understanding the plugin

The UX Flow Logic plugin has three tabs. The two most important tabs for creating professional flow diagrams are "Summary" and "Define Flow Steps."

### Summary

Configure the foundation of your flow diagram and add important context.

#### Light/Dark Mode

Choose your preferred visual theme:

- **Light Mode**: Light backgrounds with dark shapes and text
- **Dark Mode**: Dark backgrounds with light shapes and text

If you select dark mode, both the diagram stencils and the flow diagram draft will have a dark background with light-colored stencils and text.

#### Flow Name

Enter a meaningful name for your flow.

- This name will be the name of the frame containing your starter flow diagram
- The name will also appear at the top of the frame as a title

#### Contextual Information

Document the important, high-level details about your flow. Select each contextual information item to enter its details in a separate screen, or skip this step and add them directly to the flow diagram frame on the canvas after selecting 'Initialize Flow.'

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

### Define flow steps

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

## Using "Initialize flow"

Select **"Initialize flow"** at any time to generate your diagram. You don't need to complete all sections.

When you activate "Initialize flow," the plugin creates two things on your page:

### What gets generated

#### 1. Flow diagram shape components

These flow diagram assets are available in two locations:

**On the canvas:** Find them organized in the "Flow Diagram Sticker Sheet" frame, with their main components positioned directly below. *Important:* Keep the main components in the file—you can relocate them if needed, but don't delete them.

**Assets panel:** Access them by opening the "Assets" tab in the left sidebar, then simply drag and drop onto your canvas.

**Editing stencil components:**

Double-click shapes to edit their text and numbers directly on the canvas. Plugin components cannot be edited via the Properties panel.

If a component becomes semi-transparent or unresponsive:
1. Select the component instance
2. In the Properties panel, click the **More actions (...)** button next to the component name
3. Select **Reset > Reset all changes**

Alternatively, delete the instance and drag a fresh copy from the stencil sheet.

[Learn more about resetting instances](https://help.figma.com/hc/en-us/articles/360039150733-Apply-changes-to-instances)

#### 2. Draft flow diagram (in a frame)

A starter diagram based on the information you added in the Summary and/or Define Flow Steps sections. If you added a flow name, it becomes:
- The frame name in your layers panel  
- The title displayed at the top of the diagram

### Important notes

- Use the plugin on an empty page (if the page isn't empty, the plugin may cover existing content)
- The generated diagram is just a starting point
- You'll likely add more steps and modify it on the page
- The plugin dialog gets you started quickly—refinement happens on the page
- You can activate "Initialize flow" multiple times on different pages

---

## Working with flow diagrams

### The three-column approach

This plugin supports a proven layout structure that's been beneficial in UX design work:

**Left Column: Summary**  
Your trigger, assumptions, pre-conditions, and post-conditions. This provides context at a glance.

**Center Column: Numbered Steps**  
The main user journey flowing from top to bottom. This is the "happy path" through your product.

**Right Column: Details**  
Specifics for each numbered step: error states, validation rules, alternate paths, technical notes, or design considerations.

### Best practices

- Access stencil components from the canvas section or Assets panel (whichever is faster for your workflow)
- Start with the basic flow—add complexity after the foundation is working
- Use consistent shape meanings throughout your flows
- Number your steps for easy reference in discussions
- Keep decision points clear with yes/no labels
- Document edge cases and error states
- Group related steps visually

### Collaboration tips

- Use Figma comments to discuss specific decision points
- Share the frame link for async review
- Update the flow as requirements change
- Keep archived versions for reference

---

## Why this tool exists

I built this tool to help make your UX work more efficient. This annotated flow diagram method has been hugely beneficial in my career.

My first UX design manager, interaction design rock star, and brilliant poet, Chris Harper, taught me this technique when I was a junior interaction designer in 2004.

---

## Version history

### Version 1.0 (October 13, 2025)

- Core plugin functionality
- Summary tab with light/dark mode support
- Define flow steps interface
- User guide tab with documentation links
- "Initialize flow" generation
- Component-based stencil library (accessible from page and Assets panel)

---

## About

**UX Flow Logic** is created and maintained by Linda Nakasone.

**For a visual guide with screenshots and examples**, visit the [UX Flow Logic documentation page](https://lindadesign.net/figma-plugin/ux_flow_logic.html).

- Website: [lindadesign.net](http://lindadesign.net)
- Support: Contact information available on website

---

## License

MIT License - Copyright (c) 2025 Linda Nakasone

See the [LICENSE](../LICENSE) file for full details.

---

*Thank you for using UX Flow Logic! If you find this plugin helpful, please consider leaving a review on the Figma Community page.*