import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AgeRestriction {
  NONE = 'none',           // لا يوجد
  PLUS_13 = 'plus_13',    // 13+
  PLUS_16 = 'plus_16',    // 16+
  PLUS_18 = 'plus_18',    // 18+
}

export enum LegalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  UNDER_REVIEW = 'under_review',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class LegalCompliance extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: AgeRestriction, default: AgeRestriction.NONE })
  ageRestriction: AgeRestriction;

  @Prop({ type: String, enum: LegalStatus, default: LegalStatus.DRAFT })
  status: LegalStatus;

  @Prop({ default: true })
  isGamblingCompliant: boolean;

  @Prop({ type: Object })
  gamblingLicense: {
    licenseNumber: string;
    issuingAuthority: string;
    issuedDate: Date;
    expiryDate: Date;
    licenseUrl: string;
  };

  @Prop({ type: Object })
  regionalRestrictions: {
    allowedCountries: string[];
    blockedCountries: string[];
    requiresKYC: boolean;
  };

  @Prop({ type: Object })
  spendingLimits: {
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
    requireVerificationAbove: number;
  };

  @Prop({ type: Object })
  selfExclusion: {
    enabled: boolean;
    minPeriodDays: number;
    maxPeriodDays: number;
  };

  @Prop({ type: Object })
  oddsDisclosure: {
    published: boolean;
    lastUpdated: Date;
    rtp: number; // Return to Player percentage
  };

  @Prop({ default: true })
  fairPlayCertified: boolean;

  @Prop()
  fairPlayCertificateUrl: string;

  @Prop({ type: Object })
  auditInfo: {
    lastAuditDate: Date;
    auditorName: string;
    auditReportUrl: string;
  };

  @Prop({ type: [String] })
  supportedLocales: string[];

  @Prop({ type: Object })
  requiredDisclosures: {
    oddsDisclaimer: string;
    gamblingWarning: string;
    minorWarning: string;
    addictionWarning: string;
  };
}

export const LegalComplianceSchema = SchemaFactory.createForClass(LegalCompliance);
