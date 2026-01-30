import { FinancialGroupService } from '../group.service';
import { VisibilityStatus } from '../../../../core/enums/isibilityStatus.enum';
import { AppError } from '../../../../core/errors/AppError';

const groupRepoMock = {
  createGroup: jest.fn(),
  findAllByOwner: jest.fn(),
  findByIdAndOwner: jest.fn(),
  updateByIdAndOwner: jest.fn(),
  deleteByIdAndOwner: jest.fn(),
  findById: jest.fn(),
};

const positionRepoMock = {
  findAllByGroup: jest.fn(),
  deleteManyByGroupId: jest.fn(),
};

const boardServiceMock = {
  ensurePostForGroup: jest.fn(),
  hidePostForGroup: jest.fn(),
  removePostForGroup: jest.fn(),
};

jest.mock('../../infrastructure/group.repository', () => ({
  FinancialGroupRepository: jest.fn().mockImplementation(() => groupRepoMock),
}));

jest.mock('../../infrastructure/position.repository', () => ({
  PositionRepository: jest.fn().mockImplementation(() => positionRepoMock),
}));

jest.mock('../../../board-post.model.ts/application/board.service', () => ({
  BoardService: jest.fn().mockImplementation(() => boardServiceMock),
}));

describe('FinancialGroupService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changeVisibility()', () => {
    test('ustawia PUBLIC i wywołuje ensurePostForGroup()', async () => {
      groupRepoMock.updateByIdAndOwner.mockResolvedValue({
        _id: { toString: () => 'g1' },
        name: 'My group',
        projectionYears: 3,
        visibilityStatus: VisibilityStatus.PUBLIC,
        description: 'desc',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      const svc = new FinancialGroupService();

      const res = await svc.changeVisibility('u1', 'g1', {
        visibilityStatus: VisibilityStatus.PUBLIC,
      });

      expect(groupRepoMock.updateByIdAndOwner).toHaveBeenCalledWith('g1', 'u1', {
        visibilityStatus: VisibilityStatus.PUBLIC,
      });

      expect(boardServiceMock.ensurePostForGroup).toHaveBeenCalledWith('g1', 'u1', 'desc');
      expect(boardServiceMock.hidePostForGroup).not.toHaveBeenCalled();

      expect(res).toMatchObject({
        id: 'g1',
        visibilityStatus: VisibilityStatus.PUBLIC,
        description: 'desc',
      });
    });

    test('ustawia PRIVATE i wywołuje hidePostForGroup()', async () => {
      groupRepoMock.updateByIdAndOwner.mockResolvedValue({
        _id: { toString: () => 'g1' },
        name: 'My group',
        projectionYears: 3,
        visibilityStatus: VisibilityStatus.PRIVATE,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const svc = new FinancialGroupService();

      const res = await svc.changeVisibility('u1', 'g1', {
        visibilityStatus: VisibilityStatus.PRIVATE,
      });

      expect(boardServiceMock.hidePostForGroup).toHaveBeenCalledWith('g1');
      expect(boardServiceMock.ensurePostForGroup).not.toHaveBeenCalled();

      expect(res.visibilityStatus).toBe(VisibilityStatus.PRIVATE);
    });

    test('gdy grupa nie istnieje -> rzuca AppError 404', async () => {
      groupRepoMock.updateByIdAndOwner.mockResolvedValue(null);

      const svc = new FinancialGroupService();

      await expect(
        svc.changeVisibility('u1', 'missing', {
          visibilityStatus: VisibilityStatus.PUBLIC,
        }),
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        svc.changeVisibility('u1', 'missing', {
          visibilityStatus: VisibilityStatus.PUBLIC,
        }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('getPublicGroupWithPositions()', () => {
    test('zwraca grupę i pozycje gdy PUBLIC', async () => {
      groupRepoMock.findById.mockResolvedValue({
        _id: { toString: () => 'g1' },
        name: 'Public plan',
        projectionYears: 2,
        visibilityStatus: VisibilityStatus.PUBLIC,
        description: 'hello',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      positionRepoMock.findAllByGroup.mockResolvedValue([
        {
          _id: { toString: () => 'p1' },
          name: 'Salary',
          amount: 5000,
          positionType: 'INCOME',
          frequencyType: 'RECURRING',
          date: new Date('2025-01-01'),
          notes: 'monthly',
          category: 'job',
          interestRate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const svc = new FinancialGroupService();
      const res = await svc.getPublicGroupWithPositions('g1');

      expect(res.name).toBe('Public plan');
      expect(res.positions).toHaveLength(1);
      expect(res.positions[0]).toMatchObject({
        id: 'p1',
        name: 'Salary',
        amount: 5000,
      });
    });

    test('gdy grupa nie jest PUBLIC -> 404', async () => {
      groupRepoMock.findById.mockResolvedValue({
        _id: { toString: () => 'g1' },
        visibilityStatus: VisibilityStatus.PRIVATE,
      });

      const svc = new FinancialGroupService();
      await expect(svc.getPublicGroupWithPositions('g1')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
