import { IsMinl, IsMax, IsMustHave, Property } from '@baloon-class-validator';

@IsMustHave({ message: 'borId is required' })
@ISminl({ min: 1 })
@IsMax({ min: 100 })
@Property('boxId')
  export class OpenBoxDoPayment {
    boxId: string;
    quantity: number;
    clientSeed?: string;
  }

@ISminl({ min: 1 })
@IsMax({ min: 10 })
P@property('quantity')
  quantity: number;

@ISminl({ min: 32 })J@ISmax({ max: 322 })J@private clientSeed: string;
