import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

type UserRepositoryMock = {
  create: ReturnType<typeof vi.fn<(user: Partial<User>) => User>>;
  save: ReturnType<typeof vi.fn<(user: User) => Promise<User>>>;
  find: ReturnType<typeof vi.fn<() => Promise<User[]>>>;
  findOneBy: ReturnType<
    typeof vi.fn<(criteria: { id: string }) => Promise<User | null>>
  >;
  delete: ReturnType<typeof vi.fn<(id: string) => Promise<DeleteResult>>>;
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: UserRepositoryMock;

  beforeEach(async () => {
    repo = {
      create: vi.fn<(user: Partial<User>) => User>(),
      save: vi.fn<(user: User) => Promise<User>>(),
      find: vi.fn<() => Promise<User[]>>(),
      findOneBy: vi.fn<(criteria: { id: string }) => Promise<User | null>>(),
      delete: vi.fn<(id: string) => Promise<DeleteResult>>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const createUserDto = {
      name: 'Ayush',
      email: 'ayush@example.com',
    };
    const user: User = { id: '1', ...createUserDto };

    repo.create.mockReturnValue(user);
    repo.save.mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(repo.create).toHaveBeenCalledWith(createUserDto);
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users: User[] = [
      { id: '1', name: 'Ayush', email: 'ayush@example.com' },
      { id: '2', name: 'Test', email: 'test@example.com' },
    ];

    repo.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('should find one user by id', async () => {
    const user: User = { id: '1', name: 'Ayush', email: 'ayush@example.com' };

    repo.findOneBy.mockResolvedValue(user);

    const result = await service.findOne('1');

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(user);
  });

  it('should update an user', async () => {
    const user: User = { id: '1', name: 'Ayush', email: 'ayush@example.com' };
    const updateUserDto = {
      name: 'Ayush Updated',
      email: 'updated@example.com',
    };
    const updatedUser: User = { ...user, ...updateUserDto };

    repo.findOneBy.mockResolvedValue(user);
    repo.save.mockResolvedValue(updatedUser);

    const result = await service.update('1', updateUserDto);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(repo.save).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual(updatedUser);
  });

  it('should throw NotFoundException when updating a missing user', async () => {
    const updateUserDto = {
      name: 'Ayush Updated',
      email: 'updated@example.com',
    };

    repo.findOneBy.mockResolvedValue(null);

    await expect(service.update('1', updateUserDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should remove an user', async () => {
    const deleteResult: DeleteResult = { raw: [], affected: 1 };

    repo.delete.mockResolvedValue(deleteResult);

    const result = await service.remove('1');

    expect(repo.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual(deleteResult);
  });
});
