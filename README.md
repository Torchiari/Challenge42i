# Challenge42i - Task System

Aplicación web para gestionar tareas y subtareas con prioridades, estados, estimaciones y CRUD completo.
Permite crear, actualizar, eliminar y visualizar tareas, así como consultar subtareas y sus estimaciones.

---

## Tecnologías utilizadas

* **Frontend:** Next.js, React, Tailwind CSS, TypeScript
* **Backend:** NestJS, TypeScript, TypeORM
* **Base de datos:** SQLite (`data.sqlite`)
* **Librerías importantes:** Axios para llamadas API

---

## Estructura del proyecto

```

├─ frontend/          # Aplicación Next.js (front-end)
│  ├─ .env.local      # Variables de entorno
│  └─ ...
│
├─ backend/           # Aplicación NestJS (back-end)
│  ├─ .env            # Variables de entorno
│  └─ ...
│
└─ data.sqlite        # Base de datos SQLite
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Torchiari/Challenge42i.git
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 3. Configurar variables de entorno

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Backend (`backend/.env`)

```env
PORT=3000
API_PREFIX=api
```

---

### 4. Levantar la aplicación

#### Backend

```bash
cd backend
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

Luego abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## Uso de la aplicación

* **Crear tarea:** Completar título, descripción, prioridad, estado y estimación.
* **Ver tareas:** Listado paginado con filtros por estado, búsqueda y ordenamiento.
* **Detalles de tarea:** Visualizar información completa de la tarea, incluyendo subtareas y estimaciones:

  * Total estimado de subtareas pendientes (*Backlog* y *Unstarted*)
  * Total estimado de subtareas en progreso (*Started*)
  * Estimación total global
* **Editar o eliminar tarea:** Desde la vista de detalles de cada tarea.

---

## Testing

Para ejecutar pruebas unitarias en el backend:

```bash
cd backend
npm run test
```

---

## Notas

* Base de datos SQLite (`data.sqlite`) utilizada para persistencia local.
* La aplicación es **responsive** y funciona en dispositivos móviles y desktop.

---
