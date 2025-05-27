import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';
import { ParamOfferId } from './type/param-offerid.js';

export type UpdateOfferRequest = Request<
  ParamOfferId,
  RequestBody,
  CreateOrUpdateOfferDto
>;
