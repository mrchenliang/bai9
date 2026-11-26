import type { Tasting } from "@/types";

export const tastings: Tasting[] = [
  {
    session: 1,
    year: "1952",
    cityZh: "北京",
    cityEn: "Beijing",
    titleZh: "第一届 · 四大名酒",
    titleEn: "First National Tasting · The Four Baijiu",
    noteEn:
      "Eight national liquors were named across all categories: these four baijiu alongside Shaoxing Jianhu huangjiu and three Changyu wines (Red Rose, Vermouth, Gold Medal Brandy).",
    noteZh:
      "首届全国评酒会共评出八种国家级名酒：除这四种白酒外，还有绍兴鉴湖黄酒，以及张裕的红玫瑰葡萄酒、味美思和金奖白兰地。",
    entries: [
      { brandId: "moutai", medalName: "茅台酒", isNew: true },
      { brandId: "fenjiu", medalName: "汾酒", isNew: true },
      { brandId: "luzhou", medalName: "泸州大曲酒", isNew: true },
      { brandId: "xifeng", medalName: "西凤酒", isNew: true },
    ],
  },
  {
    session: 2,
    year: "1963",
    cityZh: "北京",
    cityEn: "Beijing",
    titleZh: "第二届 · 老八大名酒",
    titleEn: "Second National Tasting · The Old Eight",
    noteEn:
      "The original Eight Great Famous Liquors across Shanxi, Shaanxi, Guizhou, Sichuan and Anhui. Wuliangye, Gujing Gongjiu, Quanxing Daqu and Dongjiu joined the four from 1952.",
    noteZh:
      "「老八大名酒」出自这一届，主产于山西、陕西、贵州、四川、安徽五省。五粮液、古井贡酒、全兴大曲、董酒加入1952年的四大名酒。",
    entries: [
      { brandId: "fenjiu", medalName: "汾酒" },
      { brandId: "wuliangye", medalName: "五粮液", isNew: true },
      { brandId: "gujing", medalName: "古井贡酒", isNew: true },
      { brandId: "luzhou", medalName: "泸州老窖特曲" },
      { brandId: "quanxing", medalName: "全兴大曲酒", isNew: true },
      { brandId: "moutai", medalName: "茅台酒" },
      { brandId: "xifeng", medalName: "西凤酒" },
      { brandId: "dongjiu", medalName: "董酒", isNew: true },
    ],
  },
  {
    session: 3,
    year: "1979",
    cityZh: "大连",
    cityEn: "Dalian",
    titleZh: "第三届 · 新八大名酒",
    titleEn: "Third National Tasting · The New Eight",
    noteEn:
      "Jiannanchun and Yanghe Daqu entered for the first time while Xifeng and Quanxing dropped off this short list of eight.",
    noteZh:
      "习惯称「新八大名酒」。剑南春、洋河大曲首次入选；西凤酒与全兴大曲在这一届落选。",
    entries: [
      { brandId: "moutai", medalName: "茅台酒" },
      { brandId: "fenjiu", medalName: "汾酒" },
      { brandId: "wuliangye", medalName: "五粮液" },
      { brandId: "jiannanchun", medalName: "剑南春", isNew: true },
      { brandId: "gujing", medalName: "古井贡酒" },
      { brandId: "yanghe", medalName: "洋河大曲", isNew: true },
      { brandId: "dongjiu", medalName: "董酒" },
      { brandId: "luzhou", medalName: "泸州老窖特曲" },
    ],
  },
  {
    session: 4,
    year: "1984",
    cityZh: "太原",
    cityEn: "Taiyuan",
    titleZh: "第四届 · 十三大名酒",
    titleEn: "Fourth National Tasting · The Thirteen",
    noteEn:
      "Xifeng and Quanxing returned, and Shuanggou Daqu, Tezhi Huanghelou and Langjiu joined the national roll.",
    noteZh:
      "西凤酒、全兴大曲重回名单，双沟大曲、特制黄鹤楼酒、郎酒新晋国家名酒。",
    entries: [
      { brandId: "moutai", medalName: "茅台酒" },
      { brandId: "fenjiu", medalName: "汾酒" },
      { brandId: "wuliangye", medalName: "五粮液" },
      { brandId: "yanghe", medalName: "洋河大曲" },
      { brandId: "jiannanchun", medalName: "剑南春" },
      { brandId: "gujing", medalName: "古井贡酒" },
      { brandId: "dongjiu", medalName: "董酒" },
      { brandId: "xifeng", medalName: "西凤酒" },
      { brandId: "luzhou", medalName: "泸州老窖特曲" },
      { brandId: "quanxing", medalName: "全兴大曲酒" },
      { brandId: "shuanggou", medalName: "双沟大曲", isNew: true },
      { brandId: "huanghelou", medalName: "特制黄鹤楼酒", isNew: true },
      { brandId: "langjiu", medalName: "郎酒", isNew: true },
    ],
  },
  {
    session: 5,
    year: "1989",
    cityZh: "合肥",
    cityEn: "Hefei",
    titleZh: "第五届 · 十七大名酒",
    titleEn: "Fifth National Tasting · The Seventeen",
    noteEn:
      "The final state tasting. Wuling, Baofeng, Songhe Liangye and Tuopai Qujiu joined. No sixth national tasting was held.",
    noteZh:
      "最后一届国家级评酒会。武陵酒、宝丰酒、宋河粮液、沱牌曲酒入选。此后国家不再举办全国评酒会。",
    entries: [
      { brandId: "moutai", medalName: "茅台酒" },
      { brandId: "fenjiu", medalName: "汾酒" },
      { brandId: "wuliangye", medalName: "五粮液" },
      { brandId: "yanghe", medalName: "洋河大曲" },
      { brandId: "jiannanchun", medalName: "剑南春" },
      { brandId: "gujing", medalName: "古井贡酒" },
      { brandId: "dongjiu", medalName: "董酒" },
      { brandId: "xifeng", medalName: "西凤酒" },
      { brandId: "luzhou", medalName: "泸州老窖特曲" },
      { brandId: "quanxing", medalName: "全兴大曲酒" },
      { brandId: "shuanggou", medalName: "双沟大曲" },
      { brandId: "huanghelou", medalName: "特制黄鹤楼酒" },
      { brandId: "langjiu", medalName: "郎酒" },
      { brandId: "wuling", medalName: "武陵酒", isNew: true },
      { brandId: "baofeng", medalName: "宝丰酒", isNew: true },
      { brandId: "songhe", medalName: "宋河粮液", isNew: true },
      { brandId: "shede", medalName: "沱牌曲酒", isNew: true },
    ],
  },
];
