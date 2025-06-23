import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

// Mock NestFactory as before
jest.mock('@nestjs/core', () => ({
  ...jest.requireActual('@nestjs/core'),
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe('Main bootstrap', () => {
  it('should bootstrap without error', async () => {
    process.env.PORT = '4000';
    const loggerLog = jest.spyOn(console, 'log').mockImplementation();
    // Importa y ejecuta la función bootstrap exportada desde main.ts
    const mod = await import('./main');
    await expect(mod.bootstrap()).resolves.not.toThrow();
    loggerLog.mockRestore();
  });
});