import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface User {
  id: string;
  username: string;
  email: string;
}

interface RegisterResponse { id: string; }
interface LoginResponse { access_token: string; token_type: string; }

interface UserServiceGrpc {
  CreateUser(data: { username: string; email: string; password: string }): Observable<User>;
  GetUser(data: { id: string }): Observable<User>;
  UpdateUser(data: { id: string; username: string; email: string; password: string }): Observable<User>;
  DeleteUser(data: { id: string }): Observable<{ }>;
  ListUsers(data: {}): Observable<{ users: User[] }>;
  Register(data: { username: string; email: string; password: string }): Observable<RegisterResponse>;
  Login(data: { email: string; password: string }): Observable<LoginResponse>;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: UserServiceGrpc;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceGrpc>('UserService');
  }

  createUser(username: string, email: string, password: string) {
    return this.userService.CreateUser({ username, email, password });
  }
  getUser(id: string) {
    return this.userService.GetUser({ id });
  }
  updateUser(id: string, username: string, email: string, password: string) {
    return this.userService.UpdateUser({ id, username, email, password });
  }
  deleteUser(id: string) {
    return this.userService.DeleteUser({ id });
  }
  listUsers() {
    return this.userService.ListUsers({});
  }
  register(username: string, email: string, password: string) {
    return this.userService.Register({ username, email, password });
  }
  login(email: string, password: string) {
    return this.userService.Login({ email, password });
  }
}