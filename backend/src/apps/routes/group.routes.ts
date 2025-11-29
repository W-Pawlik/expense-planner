import { Express, Router } from 'express';
import {
  createGroup,
  getMyGroups,
  getGroupDetails,
  updateGroup,
  deleteGroup,
  changeVisibility,
  addPosition,
  updatePosition,
  deletePosition,
} from '../controlers/group.controller';
import { authMiddleware } from '../../core/middleware/auth.middleware';
import { validateRequest } from '../../core/middleware/validateRequest';
import {
  createGroupSchema,
  updateGroupSchema,
  changeVisibilitySchema,
  groupIdParamsSchema,
} from '../../modules/financial-groups/domain/group.schemas';
import {
  createPositionSchema,
  updatePositionSchema,
  positionIdParamsSchema,
} from '../../modules/financial-groups/domain/position.schemas';

export const createGroupRouter = (): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.post('/', validateRequest(createGroupSchema), createGroup);
  router.get('/', getMyGroups);

  router.get('/:groupId', validateRequest(groupIdParamsSchema, 'params'), getGroupDetails);

  router.patch(
    '/:groupId',
    validateRequest(groupIdParamsSchema, 'params'),
    validateRequest(updateGroupSchema),
    updateGroup,
  );

  router.patch(
    '/:groupId/visibility',
    validateRequest(groupIdParamsSchema, 'params'),
    validateRequest(changeVisibilitySchema),
    changeVisibility,
  );

  router.delete('/:groupId', validateRequest(groupIdParamsSchema, 'params'), deleteGroup);

  router.post(
    '/:groupId/positions',
    validateRequest(groupIdParamsSchema, 'params'),
    validateRequest(createPositionSchema),
    addPosition,
  );

  router.patch(
    '/:groupId/positions/:positionId',
    validateRequest(groupIdParamsSchema, 'params'),
    validateRequest(positionIdParamsSchema, 'params'),
    validateRequest(updatePositionSchema),
    updatePosition,
  );

  router.delete(
    '/:groupId/positions/:positionId',
    validateRequest(groupIdParamsSchema, 'params'),
    validateRequest(positionIdParamsSchema, 'params'),
    deletePosition,
  );

  return router;
};

export const registerGroupRoutes = (app: Express) => {
  app.use('/groups', createGroupRouter());
};
