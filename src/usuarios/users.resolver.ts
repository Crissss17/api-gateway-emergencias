import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  

  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    const res = await this.usersService.listUsers().toPromise();
    return (res && res.users) ? res.users.map(user => ({ ...user })) : [];
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id') id: string): Promise<UserType | null> {
    const user = await this.usersService.getUser(id).toPromise();
    return user ? { ...user } : null;
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<UserType> {
    const user = await this.usersService.createUser(username, email, password).toPromise();
    return {
      id: user?.id ?? '',
      username: user?.username ?? '',
      email: user?.email ?? ''
    };
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<UserType> {
    const user = await this.usersService.updateUser(id, username, email, password).toPromise();
    return {
      id: user?.id ?? '',
      username: user?.username ?? '',
      email: user?.email ?? ''
    };
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    await this.usersService.deleteUser(id).toPromise();
    return true;
  }

  // --------- NUEVOS MUTATIONS ----------
  @Mutation(() => String)
  async register(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const res = await this.usersService.register(username, email, password).toPromise();
    if (!res || !res.id) {
      throw new Error('No se pudo registrar el usuario');
    }
    return res.id;
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const res = await this.usersService.login(email, password).toPromise();
    console.log('Respuesta del microservicio login:', res);
    const token = res && (res.access_token || (res as any).accessToken);
    if (!res || !token) {
      throw new Error('Credenciales incorrectas o error en login');
    }
    return token;
  }
}