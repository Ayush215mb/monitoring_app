import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let createUser: ReturnType<typeof vi.fn<UsersService['create']>>;
  let findAllUsers: ReturnType<typeof vi.fn<UsersService['findAll']>>;
  let findOne: ReturnType<typeof vi.fn<UsersService['findOne']>>;
  let update: ReturnType<typeof vi.fn<UsersService['update']>>;
  let remove: ReturnType<typeof vi.fn<UsersService['remove']>>;

  beforeEach(async () => {
    createUser = vi.fn<UsersService['create']>();
    findAllUsers = vi.fn<UsersService['findAll']>();
    findOne = vi.fn<UsersService['findOne']>();
    update = vi.fn<UsersService['update']>();
    remove = vi.fn<UsersService['remove']>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: createUser,
            findAll: findAllUsers,
            findOne,
            update,
            remove,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an user', async () => {
    const user: User = { id: '', name: '', email: '' };
    createUser.mockResolvedValue(user);

    const createUserDto = {
      name: 'etst',
      email: 'testing@gmail.com',
    };

    const result = await controller.create(createUserDto);

    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(createUserDto);

    expect(result).toEqual(user);
  });

  it('should find all users', async () => {
    const users: User[] = [];
    findAllUsers.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(findAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it('should find the user by id', async () => {
    const user: User = { id: '', name: '', email: '' };
    findOne.mockResolvedValue(user);

    const result = await controller.findOne('1');

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledWith('1');

    expect(result).toEqual(user);
  });

  it('should update an user', async () => {
    const user: User = { id: '', name: '', email: '' };

    update.mockResolvedValue(user);

    const result = await controller.update('1', {
      name: 'Ayush',
      email: 'AYYA@gmail.com',
    });

    expect(update).toHaveBeenCalledWith('1', {
      name: 'Ayush',
      email: 'AYYA@gmail.com',
    });

    expect(update).toHaveBeenCalledTimes(1);

    expect(result).toEqual(user);
  });

  it('should remove an user', async () => {
    const deleteResult: DeleteResult = { raw: [], affected: 1 };

    remove.mockResolvedValue(deleteResult);
    const result = await controller.remove('1');

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith('1');
    expect(result).toEqual(deleteResult);
  });
});
