import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    Logger.log(
      'Server started on port ' + (process.env.PORT ?? 3000),
      'Bootstrap',
    );
  });
}
bootstrap().catch((err) => {
  Logger.error(err, 'Bootstrap failed');
  process.exit(1);
});
