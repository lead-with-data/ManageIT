# ManageIT - Project Management Platform

ManageIT is a modern, full-stack project management application designed to organize teams, projects, sprints, and tasks within a sleek and aesthetic user interface. 

The application is divided into two distinct parts: a dynamic **Frontend** built with React, and a robust **Backend** built with Django REST Framework entirely generated and managed by AI.

---

## 🎨 The Frontend (React + Vite)

The frontend is a visually striking Single Page Application (SPA) designed with a premium, glassmorphism aesthetic. It focuses on providing a smooth, intuitive, and interactive user experience.

### Key Technologies
* **React 18**: The core library used for building interactive UI components.
* **Vite**: A lightning-fast build tool and development server.
* **Axios**: Used for making seamless HTTP requests to the backend API.
* **Vanilla CSS**: Employs modern CSS features (variables, flexbox, CSS Grid) to create a custom "frosted glass" look with vibrant gradients, avoiding heavy UI libraries for maximum customizability.

### Frontend Features
* **Authentication**: Login and Signup flow.
* **Single Canvas View**: A unified dashboard where users can see their active team, project, and in-progress sprints without navigating away.
* **Interactive Task Management**: Create, delete, and update task statuses (To Do, In Progress, Done, Blocked) directly from the task cards.
* **Team Management**: Floating action buttons (FAB) and modals to handle creating Teams, inviting Members, and starting new Projects.

---

## ⚙️ The Backend (Django REST Framework) - Powered by AI 🤖

The backend of ManageIT is a comprehensive RESTful API built using Django and the Django REST Framework (DRF). 

**What makes this backend unique is that it was entirely architected, written, and configured by an AI assistant in collaboration with the developer.**

### How the Backend was Built with AI

The backend creation process followed a strict AI-assisted development workflow:

1. **Architecture Planning**: The AI and developer outlined the database schema, agreeing on four core entities: Users, Teams, Projects, and Sprints/Tasks.
2. **App Generation**: The AI generated modular Django apps (`accounts`, `teams`, `projects`, `sprints`) to maintain a clean separation of concerns.
3. **Model Definition**: The AI wrote the Django `models.py` for each app, establishing relationships like ForeignKeys (e.g., mapping a Task to a Sprint, and a Sprint to a Project).
4. **Serialization and ViewSets**: The AI automatically generated serializers to convert complex database instances into JSON, and configured DRF `ModelViewSet` classes to instantly wire up Create, Read, Update, and Delete (CRUD) operations.
5. **URL Routing**: The AI connected the ViewSets to Django's URL router, creating predictable endpoints (e.g., `/api/sprints/sprints/`).
6. **Iterative Refinement**: As UI features evolved, the AI dynamically updated the backend—for example, updating validators to allow new roles (like adding a `Member` role) or adding new task statuses (`Blocked`).

### Backend Architecture & Components

The backend is organized into distinct applications, mapped to a SQLite database:

* **`accounts` App**: Manages users and authentication.
    * Models: `Users` (Custom user model).
* **`teams` App**: Manages groups of users.
    * Models: `Teams`, `TeamMembers`. Includes permission roles like Manager, Developer, Tester, and Member.
* **`projects` App**: Manages large scopes of work assigned to teams.
    * Models: `Projects`. Tracks start and end dates.
* **`sprints` App**: Manages agile iterations and granular tasks.
    * Models: `Sprints`, `SprintTasks`. Handles task assignments, descriptions, and dynamic statuses.

### API Capabilities
The backend provides a fully functional REST API capable of deep data filtering. For instance, it can dynamically filter Projects or Teams based on the currently authenticated `user_id`, ensuring secure data scoping. It natively handles `GET`, `POST`, `PATCH`, and `DELETE` requests directly integrated with the React frontend components.

---

## 🚀 Getting Started

To run this application locally, you will need two terminal windows.

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
