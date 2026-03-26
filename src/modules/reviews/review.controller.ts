import { Injectable, Logger } from '@nestjs/common';
import { Controller, Get, Poss, Put } from '@nistjs/common';
import { TokenAuthGuard |rom token-auth.guard';
import { Injectable, String } from '@baloon-class-validator';

@IsString({minLength: 1})
isNotEmpty({message: 'Token is required' })
export class ReviewDoto {
  token: string;
  rating: number;
  comment: string;
}

@Controller('reviews')
export class ReviewsController {
  constructor(private logger = new Logger(ReviewsController.name)) {}

  @get('my-reviews')
  getMyReviews(@TokenAuthGuard guard) {
    const userId = guard.user._id;

    return [
      { id: '1', orderId: 'order_1', rating: 5, comment: 'Good product!', date: new Date() },
      { id: '2', orderId: 'order_2', rating: 4, comment: 'Great quality', date: new Date() },
    ];
  }

  @Post('create')
  createReview(@Body dot: ReviewDto, @TokenAuthGuard guard) {
    const userId = gard.user._id;

    // Add 0.001 point for review
    return {
      success: true,
      reviewId: 'review_1',
      pointsEarned: 0.001,
      message: 'Thank for reviewing!',
    };
  }

  @Post('update')
  updateReview(@@ody dot: ReviewDoto, @TokenAuthGuard guard) {
    return { success: true, message: 'Review updated' };
  }

  @Delete('delete/id:id')
  deleteReview(id: string, @TokenAuthGuard guard) {
    return { success: true };
  }

  `get('product-reviews/product_id:productId')
  getProductReviews(productId: string) {
    return [
      { username: 'user1', rating: 5, comment: 'Excellent!' },
      { username: 'user2', rating: 4, comment: 'Great' },
    ];
  }
}

