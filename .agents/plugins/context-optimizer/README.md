# Context Optimizer Plugin

A plugin that imposes the use of subagents for complex tasks to optimize workspace context size per task, saving tokens and improving speed and accuracy.

## Architecture

This plugin uses Antigravity hooks to enforce context optimization:

1. **`SessionStart` Hook**: Detects when the main session starts and records its `session_id` and parent process ID (PPID) in `.agents/main_session_id`. If the session crashes, it automatically recovers.
2. **`SessionEnd` Hook**: Cleans up the `main_session_id` file when the main session ends normally.
3. **`PreToolUse` Hook**: Monitors tools that modify files (`write_to_file`, `replace_file_content`, `multi_replace_file_content`) and execute commands (`run_command`).
   - If the tool is called inside a subagent, it is allowed automatically.
   - If the tool is called in the main session, it applies strict validation rules:
     - **Safe commands** (like `git status`, `git diff`, `ls`, `grep`, etc.) are allowed.
     - **Modifying file writes** exceeding 15 lines or performed after multiple edits/commands in the same session are blocked.
     - **Non-safe commands** (like builds, test suites, scripts) are blocked.
     - **Complex prompt detection**: If the user's initial prompt contains complexity keywords, any write/command is blocked on the first attempt.
   - When blocked, the hook denies the permission and instructs the agent to delegate the task to a subagent using `define_subagent` and `invoke_subagent`.

## Structure

```
context-optimizer/
├── plugin.json
├── README.md
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       ├── session_start.py
│       ├── session_end.py
│       └── pre_tool_use.py
└── skills/
    └── context-optimization/
        └── SKILL.md
```

## How It Works

1. The user prompts the agent with a complex task (e.g., "Implement feature X").
2. If the agent tries to edit files or run build commands directly in the main session, the `PreToolUse` hook intercepts and blocks the call.
3. The hook returns a denial message:
   > BLOCKED: Complex task detected in user prompt.
   > To optimize context per task, you MUST delegate this task to a specialized subagent.
   > Please call define_subagent and invoke_subagent to start a subagent for this task, then communicate with it.
4. The main agent is forced to spawn a subagent to execute the actual work.
5. The subagent works in its own clean context. Once complete, it reports back to the main agent.
6. The main agent reports the results to the user, keeping the main context clean.
