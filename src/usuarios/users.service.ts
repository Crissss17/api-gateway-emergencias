import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserServiceGrpc {
  CreateUser(data: { username: string; email: string; password: string }): Observable<User>;
  GetUser(data: { id: string }): Observable<User>;
  UpdateUser(data: { id: string; username: string; email: string; password: string }): Observable<User>;
  DeleteUser(data: { id: string }): Observable<any>;
  ListUsers(data: {}): Observable<{ users: User[] }>;
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
}