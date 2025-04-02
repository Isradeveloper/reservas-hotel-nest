/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './main';
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe('Main.ts bootstrap', () => {
  let mockApp: {
    useGlobalPipes: jest.Mock;
    setGlobalPrefix: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should create application', async () => {
    await bootstrap();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should listen on env port', async () => {
    process.env.PORT = '4000';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT);
  });

  it('should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,

        validatorOptions: expect.objectContaining({
          forbidNonWhitelisted: true,
        }),
      }),
    );
  });
});
