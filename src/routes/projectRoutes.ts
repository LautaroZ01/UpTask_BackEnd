import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProyectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskContronller } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hashAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

router.use(authenticate)

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcions del proyecto es obligatorio'),
    handleInputErrors,
    ProyectController.createProject)

router.get('/', ProyectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProyectController.getProjectById)

// Routes for task
router.param('projectId', projectExists)

router.put('/:projectId',
    hashAuthorization,
    param('projectId').isMongoId().withMessage('ID no valido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcions del proyecto es obligatorio'),
    handleInputErrors,
    ProyectController.updateProject)

router.delete('/:projectId',
    hashAuthorization,
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProyectController.deleteProject)

router.post('/:projectId/tasks',
    hashAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es Obligatoria'),
    body('description')
        .notEmpty().withMessage('La descripcions de la tarea es Obligatorio'),
    handleInputErrors,
    TaskContronller.createTask
)

router.get('/:projectId/tasks',
    TaskContronller.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskContronller.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es Obligatoria'),
    body('description')
        .notEmpty().withMessage('La descripcions de la tarea es Obligatorio'),
    handleInputErrors,
    TaskContronller.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hashAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskContronller.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status').notEmpty().withMessage('El estado es Obligatorio'),
    handleInputErrors,
    TaskContronller.updateStatus
)

// Routes fot teams
router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team/find',
    body('email').isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.addMemberByID
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.removeMemberByID
)

// Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Valido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router