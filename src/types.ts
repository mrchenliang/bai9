export type AromaId =
  | "jiang"
  | "nong"
  | "qing"
  | "mi"
  | "feng"
  | "jian"
  | "dong"
  | "zhima"
  | "chi"
  | "te"
  | "laobaigan"
  | "fuyu"
  | "prepared";

export type TierId = "guoyan" | "mingjiu" | "jianiang" | "kouliang";

export interface Aroma {
  id: AromaId;
  zh: string;
  en: string;
  taste: string;
  tasteZh: string;
  referenceBrandId: string;
}

export interface Tier {
  id: TierId;
  zh: string;
  en: string;
  line: string;
}

export interface Shop {
  country: "Canada" | "United States";
  retailer: string;
  place: string;
  url: string;
  price: string;
  note: string;
}

export interface Credit {
  id: string;
  by: string;
  license: string;
  file: string;
}

export interface Sku {
  id: string;
  brandId: string;
  nameZh: string;
  nameEn: string;
  tier: TierId;
  rank?: number;
  aroma?: AromaId;
  abv: string;
  volume: string;
  chinaPrice?: string;
  chinaNote?: string;
  role: string;
  roleZh: string;
  image?: string;
  imagePosition?: string;
  caption: string;
  creditId?: string;
  specUrl?: string;
  shops: Shop[];
}

export interface Brand {
  id: string;
  nameZh: string;
  nameEn: string;
  pinyin: string;
  aroma: AromaId;
  provinceZh: string;
  provinceEn: string;
  placeZh: string;
  placeEn: string;
  distilleryZh: string;
  distilleryEn: string;
  medals: string[];
  official?: { label: string; url: string };
  historyEn: string;
  historyZh: string;
  craftEn?: string;
  craftZh?: string;
  verse?: { by: string; lines: string };
}
