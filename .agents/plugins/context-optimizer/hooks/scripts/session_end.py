import os
import sys
import json

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
    flag_file = os.path.join(project_dir, '.agents', 'main_session_id')

    if os.path.exists(flag_file):
        try:
            with open(flag_file, 'r') as f:
                data = json.load(f)
            stored_session = data.get('session_id')
            if stored_session == session_id:
                os.remove(flag_file)
        except Exception:
            pass

    print(json.dumps({"continue": True}))
    sys.exit(0)

if __name__ == '__main__':
    main()
