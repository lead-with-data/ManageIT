# ManageIT

ManageIT is a project management application designed to organize teams, projects, sprints, and tasks.

The application is divided into two parts:
* **Frontend**: A single-page application built with React and Vite (generated via AI).
* **Backend**: A custom-built REST API using Django REST Framework (created by the developer).

---

## 🎨 Frontend (React)

The frontend uses React 18 and a custom CSS design without heavy UI libraries.

### Features
* **Authentication**: Login and Signup flow.
* **Canvas View**: A single dashboard to view active teams, projects, and sprints.
* **Task Management**: Create, delete, and update task statuses (To Do, In Progress, Done, Blocked) directly from task cards.
* **Team Management**: Create Teams, invite members, and start new Projects.

---

## ⚙️ Backend (Django REST Framework)

The backend is organized into four main Django apps, mapping directly to the application's core functionality.

1. **`accounts` App**:
   * Replaces the default Django User model.
   * Uses an email address as the primary identifier for login instead of a username.

2. **`teams` App**:
   * **`Teams` Model**: Represents a group of users working together on projects.
   * **`TeamMembers` Model**: Links a user to a specific team. It assigns a role to the user within that team (`Manager`, `Developer`, `Tester`, `Member`).

3. **`projects` App**:
   * **`Projects` Model**: Large initiatives assigned to a specific team by a user. Tracks basic details like the project name, description, start date, and end date.

4. **`sprints` App**:
   * **`Sprints` Model**: Time-boxed work cycles belonging to a specific Project.
   * **`SprintTasks` Model**: Individual work items created inside a Sprint. Tracks the assigned user, task description, and its current status (`To Do`, `In Progress`, `Done`, `Blocked`).

---

## 🚀 Getting Started

### 1. Start the Backend
Navigate to the `Backend` folder, activate the virtual environment, and run the Django server:
\`\`\`bash
cd Backend
# Activate your venv if necessary
python manage.py runserver
\`\`\`
*The backend runs on `http://127.0.0.1:8000/`*

### 2. Start the Frontend
Navigate to the `FrontEnd/frontend` folder, install dependencies, and start Vite:
\`\`\`bash
cd FrontEnd/frontend
npm install
npm run dev
\`\`\`
*The frontend runs on `http://localhost:5173/`*
