import { PositionService } from '../position.service';
import { AppError } from '../../../../core/errors/AppError';
import { PositionType } from '../../../../core/enums/PositionType.enum';
import { FrequencyType } from '../../../../core/enums/FrequencyType.enum';

const groupRepoMock = {
  findByIdAndOwner: jest.fn(),
};

const positionRepoMock = {
  createPosition: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
};

jest.mock('../../infrastructure/group.repository', () => ({
  FinancialGroupRepository: jest.fn().mockImplementation(() => groupRepoMock),
}));

jest.mock('../../infrastructure/position.repository', () => ({
  PositionRepository: jest.fn().mockImplementation(() => positionRepoMock),
}));

describe('PositionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addPosition(): tworzy pozycję gdy grupa należy do usera', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });

    positionRepoMock.createPosition.mockResolvedValue({
      _id: { toString: () => 'p1' },
      name: 'Salary',
      amount: 5000,
      positionType: PositionType.INCOME,
      frequencyType: FrequencyType.RECURRING,
      date: new Date('2025-01-01'),
      notes: 'monthly',
      category: 'job',
      interestRate: null,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-03'),
    });

    const svc = new PositionService();

    const res = await svc.addPosition('u1', 'g1', {
      name: 'Salary',
      amount: 5000,
      positionType: PositionType.INCOME,
      frequencyType: FrequencyType.RECURRING,
      date: new Date('2025-01-01'),
      notes: 'monthly',
      category: 'job',
    });

    expect(groupRepoMock.findByIdAndOwner).toHaveBeenCalledWith('g1', 'u1');

    expect(positionRepoMock.createPosition).toHaveBeenCalledWith(
      expect.objectContaining({
        groupId: 'g1',
        name: 'Salary',
        amount: 5000,
        positionType: PositionType.INCOME,
        frequencyType: FrequencyType.RECURRING,
      }),
    );

    expect(res).toMatchObject({
      id: 'p1',
      name: 'Salary',
      amount: 5000,
      positionType: PositionType.INCOME,
      frequencyType: FrequencyType.RECURRING,
      notes: 'monthly',
      category: 'job',
    });
  });

  test('addPosition(): gdy grupa nie należy do usera -> 404', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue(null);

    const svc = new PositionService();

    await expect(
      svc.addPosition('u1', 'g1', {
        name: 'X',
        amount: 1,
        positionType: PositionType.INCOME,
        frequencyType: FrequencyType.RECURRING,
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      svc.addPosition('u1', 'g1', {
        name: 'X',
        amount: 1,
        positionType: PositionType.INCOME,
        frequencyType: FrequencyType.RECURRING,
        date: new Date(),
      }),
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(positionRepoMock.createPosition).not.toHaveBeenCalled();
  });

  test('updatePosition(): aktualizuje pozycję jeśli należy do groupId', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });

    positionRepoMock.updateById.mockResolvedValue({
      _id: { toString: () => 'p1' },
      groupId: { toString: () => 'g1' },
      name: 'Rent',
      amount: 1000,
      positionType: PositionType.EXPENSE,
      frequencyType: FrequencyType.RECURRING,
      date: new Date('2025-01-01'),
      notes: 'updated',
      category: 'housing',
      interestRate: null,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-03'),
    });

    const svc = new PositionService();

    const res = await svc.updatePosition('u1', 'g1', 'p1', {
      notes: 'updated',
      category: 'housing',
    });

    expect(positionRepoMock.updateById).toHaveBeenCalledWith('p1', {
      notes: 'updated',
      category: 'housing',
    });

    expect(res).toMatchObject({
      id: 'p1',
      name: 'Rent',
      notes: 'updated',
      category: 'housing',
    });
  });

  test('updatePosition(): gdy updateById zwróci null -> 404', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });
    positionRepoMock.updateById.mockResolvedValue(null);

    const svc = new PositionService();

    await expect(svc.updatePosition('u1', 'g1', 'pX', { notes: 'x' })).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('updatePosition(): gdy pozycja należy do innej grupy -> 400', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });

    positionRepoMock.updateById.mockResolvedValue({
      _id: { toString: () => 'p1' },
      groupId: { toString: () => 'OTHER_GROUP' },
    });

    const svc = new PositionService();

    await expect(svc.updatePosition('u1', 'g1', 'p1', { notes: 'x' })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  test('deletePosition(): usuwa pozycję gdy należy do grupy', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });

    positionRepoMock.deleteById.mockResolvedValue({
      _id: { toString: () => 'p1' },
      groupId: { toString: () => 'g1' },
    });

    const svc = new PositionService();
    await expect(svc.deletePosition('u1', 'g1', 'p1')).resolves.toBeUndefined();

    expect(positionRepoMock.deleteById).toHaveBeenCalledWith('p1');
  });

  test('deletePosition(): gdy brak pozycji -> 404', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });
    positionRepoMock.deleteById.mockResolvedValue(null);

    const svc = new PositionService();

    await expect(svc.deletePosition('u1', 'g1', 'pX')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  test('deletePosition(): gdy pozycja z innej grupy -> 400', async () => {
    groupRepoMock.findByIdAndOwner.mockResolvedValue({ _id: { toString: () => 'g1' } });

    positionRepoMock.deleteById.mockResolvedValue({
      _id: { toString: () => 'p1' },
      groupId: { toString: () => 'OTHER_GROUP' },
    });

    const svc = new PositionService();

    await expect(svc.deletePosition('u1', 'g1', 'p1')).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
