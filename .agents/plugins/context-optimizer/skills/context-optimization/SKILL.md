---
name: Context Optimization Guidance
description: This skill should be used when the agent needs to optimize task-level context, when a task requires delegation, or when the agent is blocked by the context-optimizer plugin. Trigger this skill on phrases like "delegate to a subagent", "optimize context", or "create a subagent".
version: 1.0.0
---

# Context Optimization via Subagent Delegation

## Overview

To prevent context clutter, slow responses, and high token usage in the main conversation session, this workspace enforces a **Subagent-First** architecture. Any complex, multi-step, or modifying tasks must be delegated to specialized subagents.

## Core Rules

1. **Main Session is for Planning and Reading Only**:
   - The main session (interacting directly with the user) should only be used to read files, search the codebase, list directories, make plans, and interact with subagents.
   - Do NOT write or modify files directly in the main session.
   - Do NOT run complex build, test, lint, or run commands directly in the main session.

2. **Delegate Modifying Tasks**:
   - As soon as a task requires writing code, modifying files, running shell commands, or doing deep research, delegate it immediately.
   - Use the `define_subagent` tool to define a specialized subagent if no existing subagent fits the task. Reference [Agent Development](file:///home/joel/Documents/projets/vigreux-joel.fr/.agents/plugins/plugin-dev/skills/agent-development/SKILL.md) for details.
   - Use the `invoke_subagent` tool to launch the subagent.

3. **Workspace Modes**:
   - Use `branch` or `share` workspace mode for subagents when they need to work on isolated features.
   - Use `inherit` if they only need to perform a quick task in the current workspace state.

## How to Delegate a Task

When processing a user request:

1. **Analyze the Request**: Determine if it is a simple query (e.g., "Where is class X?") or a complex request (e.g., "Implement feature Y").
2. **Define a Subagent**: Call the `define_subagent` tool using this payload structure:
   ```json
   {
     "name": "feature-developer",
     "description": "Specialized developer to implement the requested feature.",
     "system_prompt": "You are a software engineer. Implement the feature and report back when finished.",
     "enable_write_tools": true
   }
   ```
3. **Invoke the Subagent**: Call the `invoke_subagent` tool using this payload structure:
   ```json
   {
     "Subagents": [
       {
         "TypeName": "feature-developer",
         "Role": "Feature Developer",
         "Prompt": "Implement feature Y according to the plan."
       }
     ]
   }
   ```
4. **Communicate and Wait**:
   - Stop calling tools to allow the subagent to run.
   - Use the `send_message` tool if necessary to provide additional details or get status updates.
   - Once the subagent is done, merge the results and report back to the user.
