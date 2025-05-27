import { Container } from 'inversify';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { Controller } from '../../libs/rest/index.js';
import { FavoriteController } from './favorite.controller.js';

export function createFavoritesContainer() {
  const favoritesContainer = new Container();

  favoritesContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  favoritesContainer.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();
  return favoritesContainer;
}
