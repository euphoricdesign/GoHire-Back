import { Controller, Get, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';
import { Public } from 'src/decorators/is-public.decorator';
// import { NextFunction, Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Get('methods')
  getPyaMethods() {
    return this.paymentService.getPyaMethods();
  }

  @Get()
  @Public()
  historiPayments() {
    return this.paymentService.historiPayments();
  }

  @Post()
  @Public()
  createPaymenttt(@Req() req: Request) {
    return this.paymentService.createPaymenttt(req);
  }

  @Post('webhook')
  @Public()
  webhook(@Req() req: Request) {
    return this.paymentService.webhook(req);
  }
}
