import { Container } from "inversify";
import { RestApplication } from "./rest/index.js";
import { createRestApplicationContainer } from "./rest/rest.container.js";
import { Component } from "./shared/types/component.enum.js";
import { createUserContainer } from "./shared/modules/user/index.js";
import { createOfferContainer } from "./shared/modules/offer/index.js";

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
