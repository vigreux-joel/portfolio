import os
import sys
import json
import re

def is_safe_command(cmd):
    cmd = cmd.strip()
    # Strip any leading env vars or prefixes (e.g. PAGER=cat)
    cmd = re.sub(r'^(PAGER=\w+|env\s+\w+=\w+)\s+', '', cmd)
    # Check if command starts with a safe utility
    safe_utils = [
        'git status', 'git diff', 'git log', 'git show',
        'ls', 'pwd', 'echo', 'cat', 'grep', 'find',
        'which', 'whoami', 'date', 'hostname', 'uname',
        'git branch', 'git tag'
    ]
    for util in safe_utils:
        if cmd == util or cmd.startswith(util + ' '):
            return True
    return False

def count_modifying_steps(transcript_path):
    if not transcript_path or not os.path.exists(transcript_path):
        return 0
    
    count = 0
    try:
        with open(transcript_path, 'r') as f:
            for line in f:
                if not line.strip():
                    continue
                step = json.loads(line)
                # Check if it is a tool call that modifies files or runs non-safe command
                if step.get('type') == 'PLANNER_RESPONSE':
                    tool_calls = step.get('tool_calls', [])
                    for call in tool_calls:
                        name = call.get('name')
                        args = call.get('args', {})
                        if name in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                            count += 1
                        elif name == 'run_command':
                            cmd = args.get('CommandLine', '')
                            if not is_safe_command(cmd):
                                count += 1
    except Exception:
        pass
    return count

def get_user_prompt(transcript_path):
    if not transcript_path or not os.path.exists(transcript_path):
        return ""
    try:
        with open(transcript_path, 'r') as f:
            for line in f:
                if not line.strip():
                    continue
                step = json.loads(line)
                if step.get('type') == 'USER_INPUT':
                    return step.get('content', '')
    except Exception:
        pass
    return ""

def main():
    try:
        # Read hook input from stdin
        input_data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    session_id = input_data.get('session_id')
    tool_name = input_data.get('tool_name')
    tool_input = input_data.get('tool_input', {})
    transcript_path = input_data.get('transcript_path')

    if not session_id or not tool_name:
        sys.exit(0)

    project_dir = os.environ.get('ANTIGRAVITY_PROJECT_DIR') or os.getcwd()
    flag_file = os.path.join(project_dir, '.agents', 'main_session_id')

    # 1. Check if we are in the main session
    is_main_session = False
    if os.path.exists(flag_file):
        try:
            with open(flag_file, 'r') as f:
                data = json.load(f)
            stored_session = data.get('session_id')
            if stored_session == session_id:
                is_main_session = True
        except Exception:
            pass
    else:
        # If flag file does not exist, assume it's the main session to be safe
        is_main_session = True

    if not is_main_session:
        # Inside subagents, allow everything
        sys.exit(0)

    # 2. Analyze tool call and context
    block = False
    reason = ""

    # Check safe commands
    if tool_name == 'run_command':
        cmd = tool_input.get('CommandLine', '')
        if is_safe_command(cmd):
            sys.exit(0) # Safe read command, allow
        else:
            block = True
            reason = f"Execution of non-safe command '{cmd}' in main session."

    elif tool_name in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
        # For writes, check if it's large or if we have already made other modifications
        content = ""
        if tool_name == 'write_to_file':
            content = tool_input.get('CodeContent', '')
        elif tool_name == 'replace_file_content':
            content = tool_input.get('ReplacementContent', '')
        elif tool_name == 'multi_replace_file_content':
            chunks = tool_input.get('ReplacementChunks', [])
            content = "\n".join([c.get('ReplacementContent', '') for c in chunks])

        lines_count = len(content.splitlines())
        if lines_count > 15:
            block = True
            reason = f"Large file modification ({lines_count} lines) in main session."
        else:
            # Check historical modifications
            mod_count = count_modifying_steps(transcript_path)
            if mod_count >= 1:
                block = True
                reason = "Multiple file modifications/commands in main session."

    # Check user prompt complexity (from step 0)
    if not block:
        user_prompt = get_user_prompt(transcript_path).lower()
        complex_keywords = [
            'créer', 'create', 'implémenter', 'implement', 'refactor', 
            'ajouter', 'add', 'développer', 'develop', 'écrire', 'write'
        ]
        has_complex_keyword = any(k in user_prompt for k in complex_keywords)
        if has_complex_keyword:
            block = True
            reason = "Complex task detected in user prompt."

    # If block is triggered, print deny response to stderr and exit with 2
    if block:
        msg = (
            f"BLOCKED: {reason}\n"
            "To optimize context per task, you MUST delegate this task to a specialized subagent.\n"
            "Please call define_subagent and invoke_subagent to start a subagent for this task, "
            "then communicate with it."
        )
        response = {
            "hookSpecificOutput": {
                "permissionDecision": "deny"
            },
            "systemMessage": msg
        }
        sys.stderr.write(json.dumps(response))
        sys.exit(2)

    sys.exit(0)

if __name__ == '__main__':
    main()
