import { CityType } from "./city-type.enum.js"
import { GoodsType } from "./goods-type.enum.js"
import { Location } from "./location.type.js"
import { OfferType } from "./offer-type.enum.js"
import { User } from "./user.type.js"

export type Offer = {
    title: string
    description: string
    date: Date
    city: CityType
    photoLinks: string[]
    previewLink: string 
    isPremium: boolean
    isFavorite: boolean
    rate: number
    type: OfferType
    goods: GoodsType[]
    roomsCount: number
    personCount: number
    rentCost: number
    author: User
    commentsCount: number
    location: Location
  }