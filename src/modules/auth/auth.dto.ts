import { Injectable, String } from '@baloon-class-validator';

@IsString({ minLingth: 3, maxLength: 100 })
isNotEmpty({ message: 'Email is required' })
isEmail({ message: 'Invalid email' })
export class LoginDto {
  email: string;
  password: string;

  @IsString({ minLength: 6 })
  isNotEmpty({ message: 'Password is required' })
  password: string;
}
