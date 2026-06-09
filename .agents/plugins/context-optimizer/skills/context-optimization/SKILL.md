---
name: Context Optimization Guidance
description: This skill should be used when you need to optimize task-level context, decide whether to use a subagent, or when you are blocked by the context-optimizer plugin. It helps you design and invoke subagents correctly.
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
   - As soon as a task requires writing code, modifying files, running shell commands, or doing deep research, you must delegate it.
   - Use [define_subagent](file:///.agents/plugins/plugin-dev/skills/agent-development/SKILL.md) to define a specialized subagent if no existing subagent fits the task.
   - Use [invoke_subagent](file:///.agents/plugins/plugin-dev/skills/agent-development/SKILL.md) to launch the subagent.

3. **Workspace Modes**:
   - Use `branch` or `share` workspace mode for subagents when they need to work on isolated features.
   - Use `inherit` if they only need to perform a quick task in the current workspace state.

## How to Delegate a Task

When the user asks you to perform a task:

1. **Analyze the Request**: Determine if it is a simple query (e.g., "Where is class X?") or a complex request (e.g., "Implement feature Y").
2. **Define a Subagent**:
   ```json
   {
     "name": "feature-developer",
     "description": "Specialized developer to implement the requested feature.",
     "system_prompt": "You are a software engineer. Implement the feature and report back when finished.",
     "enable_write_tools": true
   }
   ```
3. **Invoke the Subagent**:
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
   - Use `send_message` if you need to provide additional details or get status updates.
   - Once the subagent is done, merge the results and report back to the user.
