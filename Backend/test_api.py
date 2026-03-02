import urllib.request
import json
import time
import subprocess

# Start the server
process = subprocess.Popen(["c:\\Users\\MUHAMMAD AHMAD\\Downloads\\ManageIT\\.venv\\Scripts\\python.exe", "manage.py", "runserver", "8000"])
print("Server started...")
time.sleep(2)  # Give the server time to start

endpoints_to_test = [
    "http://127.0.0.1:8000/api/accounts/users/",
    "http://127.0.0.1:8000/api/teams/teams/",
    "http://127.0.0.1:8000/api/teams/team-members/",
    "http://127.0.0.1:8000/api/projects/projects/",
    "http://127.0.0.1:8000/api/sprints/sprints/",
    "http://127.0.0.1:8000/api/sprints/sprint-tasks/",
]

success = True
for url in endpoints_to_test:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print(f"[OK] {url}")
            else:
                print(f"[FAIL] {url} - Status: {response.status}")
                success = False
    except Exception as e:
        print(f"[ERROR] {url} - {str(e)}")
        success = False

# Kill the server
process.terminate()
print("Server terminated.")

if success:
    print("All endpoints are working correctly!")
else:
    print("Some endpoints failed.")
