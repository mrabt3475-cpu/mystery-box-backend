import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LegalComplianceController } from './legal-compliance.controller';
import { LegalComplianceService } from './legal-compliance.service';
import { LegalCompliance, LegalComplianceSchema } from './legal-compliance.schema';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LegalCompliance.name, schema: LegalComplianceSchema },
    ]),
    UsersModule,
    SharedModule,
  ],
  controllers: [LegalComplianceController],
  providers: [LegalComplianceService],
  exports: [LegalComplianceService],
})
export class LegalModule {}
