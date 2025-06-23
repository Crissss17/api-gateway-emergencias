import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let client: ClientGrpc;

  const userServiceMock = {
    CreateUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
    GetUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
    UpdateUser: jest.fn().mockReturnValue(of({ id: '1', username: 'u', email: 'e' })),
    DeleteUser: jest.fn().mockReturnValue(of({})),
    ListUsers: jest.fn().mockReturnValue(of({ users: [{ id: '1', username: 'u', email: 'e' }] })),
    Register: jest.fn().mockReturnValue(of({ id: '1' })),
    Login: jest.fn().mockReturnValue(of({ access_token: 'token', token_type: 'bearer' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_PACKAGE',
          useValue: {
            getService: jest.fn().mockReturnValue(userServiceMock),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    client = module.get<ClientGrpc>('USER_PACKAGE');
    service.onModuleInit();
  });

  it('should call createUser', () => {
    expect(service.createUser('u', 'e', 'p')).toBeDefined();
    expect(userServiceMock.CreateUser).toHaveBeenCalledWith({ username: 'u', email: 'e', password: 'p' });
  });

  it('should call getUser', () => {
    expect(service.getUser('1')).toBeDefined();
    expect(userServiceMock.GetUser).toHaveBeenCalledWith({ id: '1' });
  });

  it('should call updateUser', () => {
    expect(service.updateUser('1', 'u', 'e', 'p')).toBeDefined();
    expect(userServiceMock.UpdateUser).toHaveBeenCalledWith({ id: '1', username: 'u', email: 'e', password: 'p' });
  });

  it('should call deleteUser', () => {
    expect(service.deleteUser('1')).toBeDefined();
    expect(userServiceMock.DeleteUser).toHaveBeenCalledWith({ id: '1' });
  });

  it('should call listUsers', () => {
    expect(service.listUsers()).toBeDefined();
    expect(userServiceMock.ListUsers).toHaveBeenCalledWith({});
  });

  it('should call register', () => {
    expect(service.register('u', 'e', 'p')).toBeDefined();
    expect(userServiceMock.Register).toHaveBeenCalledWith({ username: 'u', email: 'e', password: 'p' });
  });

  it('should call login', () => {
    expect(service.login('e', 'p')).toBeDefined();
    expect(userServiceMock.Login).toHaveBeenCalledWith({ email: 'e', password: 'p' });
  });
});