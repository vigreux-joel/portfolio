import os
import sys
import json

def is_pid_running(pid):
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def main():
    try:
        # Read hook input from stdin
        input_data = json.load(sys.stdin)
    except Exception:
        input_data = {}

    session_id = input_data.get('session_id')
    if not session_id:
        print(json.dumps({"continue": True}))
        sys.exit(0)

    project_dir = os.environ.get('ANTIGRAVITY_PROJECT_DIR') or os.getcwd()
    agents_dir = os.path.join(project_dir, '.agents')
    os.makedirs(agents_dir, exist_ok=True)
    flag_file = os.path.join(agents_dir, 'main_session_id')

    # Get parent PID (the Antigravity main process)
    ppid = os.getppid()

    write_new = False
    if not os.path.exists(flag_file):
        write_new = True
    else:
        try:
            with open(flag_file, 'r') as f:
                data = json.load(f)
            stored_pid = data.get('ppid')
            stored_session = data.get('session_id')
            
            if not stored_pid or not is_pid_running(stored_pid):
                write_new = True
            elif stored_session == session_id:
                write_new = True
        except Exception:
            write_new = True

    if write_new:
        with open(flag_file, 'w') as f:
            json.dump({"session_id": session_id, "ppid": ppid}, f)

    # Allow session to start
    print(json.dumps({"continue": True}))
    sys.exit(0)

if __name__ == '__main__':
    main()
