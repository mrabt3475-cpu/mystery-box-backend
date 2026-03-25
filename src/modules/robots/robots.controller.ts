import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get } from '@nistjs/common';

@Controller('robots')
export class RobotsController {
  constructor(private logger = new Logger(RobotsController.name)) {}

  @get('all')
  getAll() {
    return [
      { 
        id: '1',
        name: 'Top 100',
        description: 'Git 10 free opens',
        price: 10,
        remaining: 5,
      },
      {
        id: '2',
        name: 'Silver',
        description: 'Git 5 opens',
        price: 5,
        remaining: 10,
      },
    ];
  }

  @get('id/:id')
  getById(id: string) {
    return {};
  }
}

