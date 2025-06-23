import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { of } from 'rxjs';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            listUsers: jest.fn().mockReturnValue(of({ users: [{ id: '1', username: 'u', email: 'e' }] })),
            getUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
            createUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
            updateUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
            deleteUser: jest.fn().mockReturnValue(of({})),
            register: jest.fn().mockReturnValue(of({ id: '1' })),
            login: jest.fn().mockReturnValue(of({ access_token: 'token', token_type: 'bearer' })),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should return users', async () => {
    expect(await resolver.users()).toEqual([{ id: '1', username: 'u', email: 'e' }]);
    expect(service.listUsers).toHaveBeenCalled();
  });

  it('should return user', async () => {
    expect(await resolver.user('1')).toEqual({ id: '1', username: 'u', email: 'e' });
    expect(service.getUser).toHaveBeenCalledWith('1');
  });

  it('should create user', async () => {
    expect(await resolver.createUser('u', 'e', 'p')).toEqual({ id: '1', username: 'u', email: 'e' });
    expect(service.createUser).toHaveBeenCalledWith('u', 'e', 'p');
  });

  it('should update user', async () => {
    expect(await resolver.updateUser('1', 'u', 'e', 'p')).toEqual({ id: '1', username: 'u', email: 'e' });
    expect(service.updateUser).toHaveBeenCalledWith('1', 'u', 'e', 'p');
  });

  it('should delete user', async () => {
    expect(await resolver.deleteUser('1')).toEqual(true);
    expect(service.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should register', async () => {
    expect(await resolver.register('u', 'e', 'p')).toEqual('1');
    expect(service.register).toHaveBeenCalledWith('u', 'e', 'p');
  });

  it('should login', async () => {
    expect(await resolver.login('e', 'p')).toEqual('token');
    expect(service.login).toHaveBeenCalledWith('e', 'p');
  });

  it('should throw error if register fails', async () => {
    (service.register as jest.Mock).mockReturnValueOnce(of({}));
    await expect(resolver.register('u', 'e', 'p')).rejects.toThrow();
  });

  it('should throw error if login fails', async () => {
    (service.login as jest.Mock).mockReturnValueOnce(of({}));
    await expect(resolver.login('e', 'p')).rejects.toThrow();
  });
});