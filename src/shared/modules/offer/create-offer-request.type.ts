import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOrUpdateOfferDto
>;
