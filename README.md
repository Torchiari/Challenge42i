# Challenge42i
# Task System

Aplicación web para gestionar tareas y subtareas con prioridades, estados, estimaciones y CRUD completo.  
Permite crear, actualizar, eliminar y visualizar tareas, así como consultar subtareas y sus estimaciones.

---

## Tecnologías utilizadas

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript  
- **Backend:** NestJS, TypeScript, TypeORM  
- **Base de datos:** SQLite (`data.sqlite`)  
- **Librerías importantes:** Axios para llamadas API  

---

## Instalación y ejecución

### 1. Clonar el repositorio
git clone https://github.com/Torchiari/Challenge42i.git


### 2. Instalar dependencias

**Backend**
cd backend
npm install

**Frontend**
cd ../frontend
npm install

### 3. Configurar variables de entorno
Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000

Backend (backend/.env)
PORT=3000
API_PREFIX=api

### 4. Levantar la aplicación
Backend
cd backend
npm run start:dev

Frontend
cd frontend
npm run dev
