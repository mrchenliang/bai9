export type RegionId = "southwest" | "north" | "east" | "central" | "south" | "northwest" | "northeast";

export interface RegionalHouse {
  nameZh: string;
  nameEn: string;
  aromaZh: string;
  aromaEn: string;
  aromaGroup: "nong" | "jiang" | "qing" | "jian" | "feng" | "mi" | "chi" | "other";
  cityZh: string;
  cityEn: string;
  brandId?: string;
}

export interface ProvinceEntry {
  id: string;
  nameZh: string;
  nameEn: string;
  region: RegionId;
  regionEn: string;
  regionZh: string;
  houses: RegionalHouse[];
}

export const REGIONS: { id: RegionId; en: string; zh: string }[] = [
  { id: "southwest", en: "Southwest", zh: "西南" },
  { id: "central", en: "Central", zh: "华中" },
  { id: "east", en: "East", zh: "华东" },
  { id: "north", en: "North", zh: "华北" },
  { id: "northwest", en: "Northwest", zh: "西北" },
  { id: "northeast", en: "Northeast", zh: "东北" },
  { id: "south", en: "South", zh: "华南" },
];

export const provincesAtlas: ProvinceEntry[] = [
  {
    id: "sichuan",
    nameZh: "四川省",
    nameEn: "Sichuan",
    region: "southwest",
    regionEn: "Southwest",
    regionZh: "西南",
    houses: [
      { nameZh: "五粮液", nameEn: "Wuliangye", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "宜宾", cityEn: "Yibin", brandId: "wuliangye" },
      { nameZh: "剑南春", nameEn: "Jiannanchun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "绵竹", cityEn: "Mianzhu", brandId: "jiannanchun" },
      { nameZh: "郎酒", nameEn: "Langjiu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "二郎 · 古蔺", cityEn: "Erlang, Gulin", brandId: "langjiu" },
      { nameZh: "舍得酒", nameEn: "Shede", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "遂宁射洪", cityEn: "Shehong, Suining", brandId: "shede" },
      { nameZh: "全兴大曲", nameEn: "Quanxing Daqu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "成都", cityEn: "Chengdu", brandId: "quanxing" },
      { nameZh: "泸州老窖", nameEn: "Luzhou Laojiao", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "泸州", cityEn: "Luzhou", brandId: "luzhou" },
      { nameZh: "水井坊", nameEn: "Swellfun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "成都", cityEn: "Chengdu", brandId: "swellfun" },
      { nameZh: "文君酒", nameEn: "Wenjun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "邛崃", cityEn: "Qionglai" },
      { nameZh: "江口醇", nameEn: "Jiangkouchun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "平昌", cityEn: "Pingchang" },
      { nameZh: "沱牌曲酒", nameEn: "Tuopai Qujiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "射洪", cityEn: "Shehong", brandId: "shede" },
      { nameZh: "小角楼", nameEn: "Xiaojiaolou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "巴中", cityEn: "Bazhong" },
      { nameZh: "潭酒", nameEn: "Tanjiu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "古蔺", cityEn: "Gulin" },
    ],
  },
  {
    id: "guizhou",
    nameZh: "贵州省",
    nameEn: "Guizhou",
    region: "southwest",
    regionEn: "Southwest",
    regionZh: "西南",
    houses: [
      { nameZh: "茅台", nameEn: "Moutai", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "仁怀", cityEn: "Renhuai", brandId: "moutai" },
      { nameZh: "国台", nameEn: "Guotai", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "仁怀", cityEn: "Renhuai", brandId: "guotai" },
      { nameZh: "珍酒", nameEn: "Zhenjiu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "遵义", cityEn: "Zunyi", brandId: "zhenjiu" },
      { nameZh: "董酒", nameEn: "Dongjiu", aromaZh: "董香型", aromaEn: "Dong / Herbal", aromaGroup: "other", cityZh: "遵义", cityEn: "Zunyi", brandId: "dongjiu" },
      { nameZh: "赖茅", nameEn: "Laimao", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "仁怀", cityEn: "Renhuai", brandId: "moutai" },
      { nameZh: "金沙", nameEn: "Jinsha", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "金沙", cityEn: "Jinsha" },
      { nameZh: "鸭溪窖", nameEn: "Yaxijiao", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "遵义", cityEn: "Zunyi" },
      { nameZh: "习酒", nameEn: "Xijiu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "习水", cityEn: "Xishui", brandId: "xijiu" },
      { nameZh: "习水大曲", nameEn: "Xishui Daqu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "习水", cityEn: "Xishui", brandId: "xijiu" },
      { nameZh: "安酒", nameEn: "Anjiu", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "安顺 · 习水", cityEn: "Anshun / Xishui" },
      { nameZh: "筑春酒", nameEn: "Zhuchun", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "贵阳", cityEn: "Guiyang" },
      { nameZh: "贵州醇", nameEn: "Guizhouchun", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "兴义", cityEn: "Xingyi" },
      { nameZh: "平坝窖酒", nameEn: "Pingba Jiaojiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "平坝", cityEn: "Pingba" },
    ],
  },
  {
    id: "chongqing",
    nameZh: "重庆",
    nameEn: "Chongqing",
    region: "southwest",
    regionEn: "Southwest",
    regionZh: "西南",
    houses: [
      { nameZh: "江小白", nameEn: "Jiangxiaobai", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "江津", cityEn: "Jiangjin", brandId: "jiangxiaobai" },
      { nameZh: "渝北老窖", nameEn: "Yubei Laojiao", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "渝北", cityEn: "Yubei" },
      { nameZh: "渝州大曲", nameEn: "Yuzhou Daqu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "重庆", cityEn: "Chongqing" },
      { nameZh: "江津老白干", nameEn: "Jiangjin Laobaigan", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "江津", cityEn: "Jiangjin" },
      { nameZh: "诗仙太白酒", nameEn: "Shixian Taibai", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "万州", cityEn: "Wanzhou" },
    ],
  },
  {
    id: "yunnan",
    nameZh: "云南省",
    nameEn: "Yunnan",
    region: "southwest",
    regionEn: "Southwest",
    regionZh: "西南",
    houses: [
      { nameZh: "玉林泉酒", nameEn: "Yulinquan", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "玉溪", cityEn: "Yuxi" },
    ],
  },
  {
    id: "henan",
    nameZh: "河南省",
    nameEn: "Henan",
    region: "central",
    regionEn: "Central",
    regionZh: "华中",
    houses: [
      { nameZh: "仰韶", nameEn: "Yangshao", aromaZh: "浓香 / 陶融香", aromaEn: "Strong / Taorong", aromaGroup: "nong", cityZh: "渑池", cityEn: "Mianchi" },
      { nameZh: "宝丰", nameEn: "Baofeng", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "宝丰", cityEn: "Baofeng", brandId: "baofeng" },
      { nameZh: "杜康", nameEn: "Dukang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "伊川", cityEn: "Yichuan" },
      { nameZh: "皇沟", nameEn: "Huanggou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "商丘", cityEn: "Shangqiu" },
      { nameZh: "宋河", nameEn: "Songhe", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "鹿邑", cityEn: "Luyi", brandId: "songhe" },
      { nameZh: "林河酒", nameEn: "Linhe", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "商丘", cityEn: "Shangqiu" },
      { nameZh: "赊店", nameEn: "Shedian", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "南阳", cityEn: "Nanyang" },
      { nameZh: "百泉春", nameEn: "Baiquanchun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "辉县", cityEn: "Huixian" },
      { nameZh: "张弓", nameEn: "Zhanggong", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "商丘", cityEn: "Shangqiu" },
      { nameZh: "豫坡酒", nameEn: "Yupo", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "驻马店", cityEn: "Zhumadian" },
    ],
  },
  {
    id: "hunan",
    nameZh: "湖南省",
    nameEn: "Hunan",
    region: "central",
    regionEn: "Central",
    regionZh: "华中",
    houses: [
      { nameZh: "酒鬼酒", nameEn: "Jiugui", aromaZh: "馥郁香", aromaEn: "Fuyu", aromaGroup: "other", cityZh: "吉首", cityEn: "Jishou", brandId: "jiugui" },
      { nameZh: "湘泉酒", nameEn: "Xiangquan", aromaZh: "馥郁香", aromaEn: "Fuyu", aromaGroup: "other", cityZh: "吉首", cityEn: "Jishou", brandId: "jiugui" },
      { nameZh: "武陵酒", nameEn: "Wuling", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "常德", cityEn: "Changde", brandId: "wuling" },
      { nameZh: "湘窖", nameEn: "Xiangjiao", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "邵阳", cityEn: "Shaoyang" },
      { nameZh: "德山酒", nameEn: "Deshan", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "常德", cityEn: "Changde" },
      { nameZh: "白沙液", nameEn: "Baisha", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "长沙", cityEn: "Changsha" },
      { nameZh: "浏阳河", nameEn: "Liuyanghe", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "浏阳", cityEn: "Liuyang" },
      { nameZh: "邵阳大曲", nameEn: "Shaoyang Daqu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "邵阳", cityEn: "Shaoyang" },
    ],
  },
  {
    id: "hubei",
    nameZh: "湖北省",
    nameEn: "Hubei",
    region: "central",
    regionEn: "Central",
    regionZh: "华中",
    houses: [
      { nameZh: "白云边", nameEn: "Baiyunbian", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "荆州松滋", cityEn: "Songzi, Jingzhou", brandId: "baiyunbian" },
      { nameZh: "黄鹤楼", nameEn: "Huanghelou", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "武汉", cityEn: "Wuhan", brandId: "huanghelou" },
      { nameZh: "枝江大曲", nameEn: "Zhijiang Daqu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "枝江", cityEn: "Zhijiang" },
      { nameZh: "稻花香", nameEn: "Daohuaxiang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "宜昌", cityEn: "Yichang" },
      { nameZh: "石花", nameEn: "Shihua", aromaZh: "清香 / 酱香", aromaEn: "Light / Sauce", aromaGroup: "qing", cityZh: "襄阳", cityEn: "Xiangyang" },
    ],
  },
  {
    id: "shandong",
    nameZh: "山东省",
    nameEn: "Shandong",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "泰山", nameEn: "Taishan", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "泰安", cityEn: "Tai’an" },
      { nameZh: "兰陵", nameEn: "Lanling", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "临沂", cityEn: "Linyi" },
      { nameZh: "景芝", nameEn: "Jingzhi", aromaZh: "芝麻香", aromaEn: "Sesame", aromaGroup: "other", cityZh: "潍坊", cityEn: "Weifang", brandId: "jingzhi" },
      { nameZh: "琅琊台", nameEn: "Langyatai", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "青岛", cityEn: "Qingdao" },
      { nameZh: "云门酱酒", nameEn: "Yunmen", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "青州", cityEn: "Qingzhou" },
      { nameZh: "孔府家", nameEn: "Kongfujia", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "曲阜", cityEn: "Qufu" },
      { nameZh: "花冠", nameEn: "Huaguan", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "菏泽", cityEn: "Heze" },
      { nameZh: "扳倒井", nameEn: "Bandaojing", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "淄博", cityEn: "Zibo" },
      { nameZh: "趵突泉", nameEn: "Baotuquan", aromaZh: "芝麻 / 泉香", aromaEn: "Sesame / Spring", aromaGroup: "other", cityZh: "济南", cityEn: "Jinan" },
      { nameZh: "古贝春", nameEn: "Gubeichun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "德州", cityEn: "Dezhou" },
    ],
  },
  {
    id: "anhui",
    nameZh: "安徽省",
    nameEn: "Anhui",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "古井贡酒", nameEn: "Gujing Gongjiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "亳州", cityEn: "Bozhou", brandId: "gujing" },
      { nameZh: "口子窖", nameEn: "Kouzijiao", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "淮北", cityEn: "Huaibei", brandId: "kouzi" },
      { nameZh: "皖酒", nameEn: "Wanjiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "亳州", cityEn: "Bozhou" },
      { nameZh: "迎驾贡酒", nameEn: "Yingjia Gongjiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "六安", cityEn: "Lu’an", brandId: "yingjia" },
      { nameZh: "金种子", nameEn: "Golden Seed", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "阜阳", cityEn: "Fuyang" },
      { nameZh: "宣酒", nameEn: "Xuanjiu", aromaZh: "芝麻 / 浓香", aromaEn: "Sesame / Strong", aromaGroup: "other", cityZh: "宣城", cityEn: "Xuancheng" },
    ],
  },
  {
    id: "jiangsu",
    nameZh: "江苏省",
    nameEn: "Jiangsu",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "双沟", nameEn: "Shuanggou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "泗洪", cityEn: "Sihong", brandId: "shuanggou" },
      { nameZh: "洋河大曲", nameEn: "Yanghe Daqu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "宿迁", cityEn: "Suqian", brandId: "yanghe" },
      { nameZh: "今世缘", nameEn: "Jinshiyuan", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "淮安", cityEn: "Huai’an", brandId: "jinshiyuan" },
      { nameZh: "汤沟", nameEn: "Tanggou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "连云港", cityEn: "Lianyungang" },
      { nameZh: "分金亭酒", nameEn: "Fenjinting", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "泗洪", cityEn: "Sihong" },
      { nameZh: "五醍浆", nameEn: "Wutijiang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "盐城", cityEn: "Yancheng" },
    ],
  },
  {
    id: "jiangxi",
    nameZh: "江西省",
    nameEn: "Jiangxi",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "四特酒", nameEn: "Site", aromaZh: "特香型", aromaEn: "Te", aromaGroup: "other", cityZh: "宜春樟树", cityEn: "Zhangshu, Yichun", brandId: "site" },
      { nameZh: "牛头酒", nameEn: "Niutou", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "永修", cityEn: "Yongxiu" },
      { nameZh: "李渡酒", nameEn: "Lidu", aromaZh: "特香 / 兼香", aromaEn: "Te / Mixed", aromaGroup: "jian", cityZh: "进贤", cityEn: "Jinxian" },
    ],
  },
  {
    id: "fujian",
    nameZh: "福建省",
    nameEn: "Fujian",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "福矛酒", nameEn: "Fumao", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "建瓯", cityEn: "Jian’ou" },
    ],
  },
  {
    id: "taiwan",
    nameZh: "台湾",
    nameEn: "Taiwan",
    region: "east",
    regionEn: "East",
    regionZh: "华东",
    houses: [
      { nameZh: "金门高粱酒", nameEn: "Kinmen Kaoliang", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "金门", cityEn: "Kinmen" },
      { nameZh: "八八坑道高粱酒", nameEn: "Tunnel 88 Kaoliang", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "马祖", cityEn: "Matsu" },
    ],
  },
  {
    id: "shanxi",
    nameZh: "山西省",
    nameEn: "Shanxi",
    region: "north",
    regionEn: "North",
    regionZh: "华北",
    houses: [
      { nameZh: "汾酒", nameEn: "Fenjiu", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "汾阳", cityEn: "Fenyang", brandId: "fenjiu" },
      { nameZh: "汾阳王", nameEn: "Fenyangwang", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "汾阳", cityEn: "Fenyang" },
      { nameZh: "梨花春", nameEn: "Lihuachun", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "应县", cityEn: "Yingxian" },
      { nameZh: "晋泉", nameEn: "Jinquan", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "太原", cityEn: "Taiyuan" },
      { nameZh: "六曲香", nameEn: "Liuquxiang", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "祁县", cityEn: "Qixian" },
      { nameZh: "潞酒", nameEn: "Lujiu", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "长治", cityEn: "Changzhi" },
    ],
  },
  {
    id: "hebei",
    nameZh: "河北省",
    nameEn: "Hebei",
    region: "north",
    regionEn: "North",
    regionZh: "华北",
    houses: [
      { nameZh: "迎春酒", nameEn: "Yingchun", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "廊坊", cityEn: "Langfang" },
      { nameZh: "刘伶醉", nameEn: "Liulingzui", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "保定", cityEn: "Baoding" },
      { nameZh: "丛台酒", nameEn: "Congtai", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "邯郸", cityEn: "Handan" },
      { nameZh: "衡水老白干", nameEn: "Hengshui Laobaigan", aromaZh: "老白干香", aromaEn: "Laobaigan", aromaGroup: "other", cityZh: "衡水", cityEn: "Hengshui", brandId: "hengshui" },
      { nameZh: "山庄老酒", nameEn: "Shanzhuang Laojiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "承德", cityEn: "Chengde" },
      { nameZh: "燕潮酩", nameEn: "Yanchaoming", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "三河", cityEn: "Sanhe" },
    ],
  },
  {
    id: "beijing",
    nameZh: "北京",
    nameEn: "Beijing",
    region: "north",
    regionEn: "North",
    regionZh: "华北",
    houses: [
      { nameZh: "红星", nameEn: "Red Star (Hongxing)", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "北京", cityEn: "Beijing", brandId: "hongxing" },
      { nameZh: "永丰", nameEn: "Yongfeng", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "北京", cityEn: "Beijing" },
      { nameZh: "牛栏山", nameEn: "Niulanshan", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "顺义", cityEn: "Shunyi", brandId: "niulanshan" },
    ],
  },
  {
    id: "tianjin",
    nameZh: "天津",
    nameEn: "Tianjin",
    region: "north",
    regionEn: "North",
    regionZh: "华北",
    houses: [
      { nameZh: "芦台春", nameEn: "Lutaichun", aromaZh: "酱香 / 浓香", aromaEn: "Sauce / Strong", aromaGroup: "jiang", cityZh: "宁河", cityEn: "Ninghe" },
      { nameZh: "渔阳酒", nameEn: "Yuyang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "蓟州", cityEn: "Jizhou" },
      { nameZh: "津酒", nameEn: "Jinjiu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "天津", cityEn: "Tianjin" },
    ],
  },
  {
    id: "neimenggu",
    nameZh: "内蒙古",
    nameEn: "Inner Mongolia",
    region: "north",
    regionEn: "North",
    regionZh: "华北",
    houses: [
      { nameZh: "河套王", nameEn: "Hetaowang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "巴彦淖尔", cityEn: "Bayannur" },
      { nameZh: "蒙古王酒", nameEn: "Mengguwang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "通辽", cityEn: "Tongliao" },
      { nameZh: "宁城老窖", nameEn: "Ningcheng Laojiao", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "赤峰宁城", cityEn: "Ningcheng" },
      { nameZh: "金骆驼", nameEn: "Golden Camel", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "内蒙古", cityEn: "Inner Mongolia" },
      { nameZh: "草原白", nameEn: "Caoyuanbai", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "内蒙古", cityEn: "Inner Mongolia" },
    ],
  },
  {
    id: "shaanxi",
    nameZh: "陕西省",
    nameEn: "Shaanxi",
    region: "northwest",
    regionEn: "Northwest",
    regionZh: "西北",
    houses: [
      { nameZh: "西凤酒", nameEn: "Xifeng", aromaZh: "凤香型", aromaEn: "Feng", aromaGroup: "feng", cityZh: "凤翔", cityEn: "Fengxiang", brandId: "xifeng" },
      { nameZh: "太白酒", nameEn: "Taibai", aromaZh: "凤香型", aromaEn: "Feng", aromaGroup: "feng", cityZh: "眉县", cityEn: "Meixian" },
      { nameZh: "白水杜康", nameEn: "Baishui Dukang", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "白水", cityEn: "Baishui" },
      { nameZh: "三粮液", nameEn: "Sanliangye", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "勉县", cityEn: "Mianxian" },
      { nameZh: "龙窝酒", nameEn: "Longwo", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "西安", cityEn: "Xi’an" },
      { nameZh: "金醇古", nameEn: "Jinchungu", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "长武", cityEn: "Changwu" },
      { nameZh: "秦川大曲", nameEn: "Qinchuan Daqu", aromaZh: "凤香型", aromaEn: "Feng", aromaGroup: "feng", cityZh: "宝鸡", cityEn: "Baoji" },
    ],
  },
  {
    id: "gansu",
    nameZh: "甘肃省",
    nameEn: "Gansu",
    region: "northwest",
    regionEn: "Northwest",
    regionZh: "西北",
    houses: [
      { nameZh: "陇南春", nameEn: "Longnanchun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "徽县", cityEn: "Huixian" },
      { nameZh: "滨河九粮液", nameEn: "Binhe Jiuliangye", aromaZh: "九粮香", aromaEn: "Nine-Grain", aromaGroup: "other", cityZh: "张掖", cityEn: "Zhangye" },
      { nameZh: "金徽", nameEn: "Jinhui", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "陇南", cityEn: "Longnan" },
      { nameZh: "红川", nameEn: "Hongchuan", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "成县", cityEn: "Chengxian" },
      { nameZh: "古河州", nameEn: "Guhezhou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "临夏", cityEn: "Linxia" },
      { nameZh: "皇台酒", nameEn: "Huangtai", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "武威", cityEn: "Wuwei" },
      { nameZh: "汉武御酒", nameEn: "Hanwuyu", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "武威", cityEn: "Wuwei" },
    ],
  },
  {
    id: "qinghai",
    nameZh: "青海省",
    nameEn: "Qinghai",
    region: "northwest",
    regionEn: "Northwest",
    regionZh: "西北",
    houses: [
      { nameZh: "互助头曲", nameEn: "Huzhu Touqu", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "互助", cityEn: "Huzhu" },
      { nameZh: "天佑德青稞酒", nameEn: "Tianyoude Highland Barley", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "互助", cityEn: "Huzhu" },
    ],
  },
  {
    id: "xinjiang",
    nameZh: "新疆",
    nameEn: "Xinjiang",
    region: "northwest",
    regionEn: "Northwest",
    regionZh: "西北",
    houses: [
      { nameZh: "伊力特", nameEn: "Yilite", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "伊犁", cityEn: "Ili", brandId: "yilite" },
    ],
  },
  {
    id: "heilongjiang",
    nameZh: "黑龙江省",
    nameEn: "Heilongjiang",
    region: "northeast",
    regionEn: "Northeast",
    regionZh: "东北",
    houses: [
      { nameZh: "北大荒", nameEn: "Beidahuang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "哈尔滨", cityEn: "Harbin" },
      { nameZh: "北大仓", nameEn: "Beidacang", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "齐齐哈尔", cityEn: "Qiqihar" },
      { nameZh: "老村长", nameEn: "Laocunzhang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "哈尔滨", cityEn: "Harbin" },
      { nameZh: "玉泉酒", nameEn: "Yuquan", aromaZh: "兼香型", aromaEn: "Mixed", aromaGroup: "jian", cityZh: "哈尔滨", cityEn: "Harbin" },
      { nameZh: "黑土地", nameEn: "Heitudi", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "齐齐哈尔", cityEn: "Qiqihar" },
      { nameZh: "龙滨酒", nameEn: "Longbin", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "哈尔滨", cityEn: "Harbin" },
      { nameZh: "富裕老窖", nameEn: "Fuyu Laojiao", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "齐齐哈尔", cityEn: "Qiqihar" },
      { nameZh: "哈尔滨老白干", nameEn: "Harbin Laobaigan", aromaZh: "老白干香", aromaEn: "Laobaigan", aromaGroup: "other", cityZh: "哈尔滨", cityEn: "Harbin" },
    ],
  },
  {
    id: "jilin",
    nameZh: "吉林省",
    nameEn: "Jilin",
    region: "northeast",
    regionEn: "Northeast",
    regionZh: "东北",
    houses: [
      { nameZh: "榆树钱", nameEn: "Yushuqian", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "榆树", cityEn: "Yushu" },
      { nameZh: "龙泉春", nameEn: "Longquanchun", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "辽源", cityEn: "Liaoyuan" },
      { nameZh: "大泉源酒", nameEn: "Daquanyuan", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "通化", cityEn: "Tonghua" },
      { nameZh: "新怀德酒", nameEn: "Xinhuaide", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "公主岭", cityEn: "Gongzhuling" },
      { nameZh: "洮南香", nameEn: "Taonanxiang", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "洮南", cityEn: "Taonan" },
    ],
  },
  {
    id: "liaoning",
    nameZh: "辽宁省",
    nameEn: "Liaoning",
    region: "northeast",
    regionEn: "Northeast",
    regionZh: "东北",
    houses: [
      { nameZh: "凤城老窖", nameEn: "Fengcheng Laojiao", aromaZh: "酱香 / 浓香", aromaEn: "Sauce / Strong", aromaGroup: "jiang", cityZh: "丹东凤城", cityEn: "Fengcheng, Dandong" },
      { nameZh: "老龙口", nameEn: "Laolongkou", aromaZh: "浓香型", aromaEn: "Strong", aromaGroup: "nong", cityZh: "沈阳", cityEn: "Shenyang" },
      { nameZh: "凌塔酒", nameEn: "Lingta", aromaZh: "清香型", aromaEn: "Light", aromaGroup: "qing", cityZh: "朝阳", cityEn: "Chaoyang" },
      { nameZh: "凌川酒", nameEn: "Lingchuan", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "锦州", cityEn: "Jinzhou" },
    ],
  },
  {
    id: "guangdong",
    nameZh: "广东省",
    nameEn: "Guangdong",
    region: "south",
    regionEn: "South",
    regionZh: "华南",
    houses: [
      { nameZh: "玉冰烧", nameEn: "Yuk Bing Siu", aromaZh: "豉香型", aromaEn: "Chi (Rice-fat)", aromaGroup: "chi", cityZh: "佛山石湾", cityEn: "Shiwan, Foshan", brandId: "yukbing" },
      { nameZh: "飞霞液", nameEn: "Feixiaye", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "清远", cityEn: "Qingyuan" },
      { nameZh: "九江双蒸酒", nameEn: "Jiujiang Shuangzheng", aromaZh: "豉香型", aromaEn: "Chi (Rice-fat)", aromaGroup: "chi", cityZh: "佛山九江", cityEn: "Jiujiang, Foshan" },
      { nameZh: "长乐烧酒", nameEn: "Changle Shaojiu", aromaZh: "米香型", aromaEn: "Rice", aromaGroup: "mi", cityZh: "梅州五华", cityEn: "Wuhua, Meizhou" },
    ],
  },
  {
    id: "guangxi",
    nameZh: "广西",
    nameEn: "Guangxi",
    region: "south",
    regionEn: "South",
    regionZh: "华南",
    houses: [
      { nameZh: "桂林三花酒", nameEn: "Guilin Sanhua", aromaZh: "米香型", aromaEn: "Rice", aromaGroup: "mi", cityZh: "桂林", cityEn: "Guilin", brandId: "sanhua" },
      { nameZh: "丹泉酒", nameEn: "Danquan", aromaZh: "酱香型", aromaEn: "Sauce", aromaGroup: "jiang", cityZh: "河池南丹", cityEn: "Nandan, Hechi" },
      { nameZh: "湘山", nameEn: "Xiangshan", aromaZh: "米香型", aromaEn: "Rice", aromaGroup: "mi", cityZh: "桂林全州", cityEn: "Quanzhou, Guilin" },
    ],
  },
];

export const totalRegionalHouses = provincesAtlas.reduce((sum, p) => sum + p.houses.length, 0);

export interface ProvinceLocalLore {
  /** Short local identity title */
  localTitle: string;
  /** Chinese local flavor tag */
  localTitleZh: string;
  /** How locals actually drink, pour, and show hometown loyalty */
  localStory: string;
  /** Signature local dish pairing (下酒菜) */
  localPairing: string;
  /** Short Chinese brand label plotted on the China SVG map */
  mapBrandZh: string;
  /** Index of the flagship house inside prov.houses (defaults to 0) */
  flagshipIndex?: number;
}

export const provinceLocalLore: Record<string, ProvinceLocalLore> = {
  sichuan: {
    localTitle: "The Six Golden Flowers",
    localTitleZh: "川酒六朵金花",
    localStory:
      "China’s strong-aroma powerhouse. Locals debate single-grain Luzhou vs. five-grain Yibin like football teams, pouring generously over long spicy meals.",
    localPairing: "Sichuan hotpot, cold chili rabbit & braised pork",
    mapBrandZh: "五粮液",
  },
  guizhou: {
    localTitle: "Chishui River Sauce Turf",
    localTitleZh: "赤水河酱香腹地",
    localStory:
      "Red sorghum, sandstone water, and 53% vol pure-grain solid-state sauce aroma as the unspoken law. Even casual tables expect empty-cup fragrance.",
    localPairing: "Sour-soup fish, smoky cured pork & spicy dry-pot",
    mapBrandZh: "茅台",
  },
  chongqing: {
    localTitle: "Hotpot & Midnight Sorghum",
    localTitleZh: "火锅配高粱小酒",
    localStory:
      "Where old-school Jiangjin sorghum meets Jiangxiaobai’s young urban bottles — chilled crisp light aroma cuts straight through tallow-broth numbing spice.",
    localPairing: "Nine-grid beef-tallow hotpot & grilled brain flower",
    mapBrandZh: "江小白",
  },
  yunnan: {
    localTitle: "Plateau Small-Qu Clarity",
    localTitleZh: "云贵高原小曲清香",
    localStory:
      "High-altitude Yuxi spring water and light small-qu grain spirit keep pours brisk and clean beside Yunnan’s wild mushrooms and cured ham.",
    localPairing: "Xuanwei ham, wild porcini stir-fry & crossing-the-bridge noodles",
    mapBrandZh: "玉林泉",
  },
  henan: {
    localTitle: "Cradle of Central Plains Wine",
    localTitleZh: "中原酒源·豫酒振兴",
    localStory:
      "From ancient Dukang lore to modern ceramic-jar Yangshao and 1989 gold medalist Baofeng — Henan hosts love big, hospitable toasts around hometown labels.",
    localPairing: "Braised carp, spiced donkey meat & roasted peanuts",
    mapBrandZh: "仰韶",
  },
  hunan: {
    localTitle: "Xiangxi Art & Three-Aroma Bite",
    localTitleZh: "湘西馥郁·辣配烈酒",
    localStory:
      "Hunan drinkers want flavor that stands up to fierce chilies: Jiugui’s layered fuyu stoneware in Xiangxi and gold-medal Wuling sauce aroma in Changde.",
    localPairing: "Steamed chopped-chili fish head & smoky Xiangxi bacon",
    mapBrandZh: "酒鬼酒",
  },
  hubei: {
    localTitle: "Bridge of Sauce & Strong",
    localTitleZh: "荆楚兼香·一饮江湖",
    localStory:
      "Sitting between Sichuan and Guizhou, Hubei perfected mixed-aroma Baiyunbian — a fixture at Wuhan reunions alongside historic light-aroma Huanghelou.",
    localPairing: "Wuhan spicy crayfish, lotus-root pork rib soup & spiced duck necks",
    mapBrandZh: "白云边",
  },
  shandong: {
    localTitle: "Strictest Seating & Sesame Craft",
    localTitleZh: "齐鲁酒桌·芝麻香故乡",
    localStory:
      "Home to China’s most formal table etiquette (主陪 faces the door; never sip before the host). Locals champion fermented sesame-aroma Jingzhi and hometown Taishan.",
    localPairing: "Braised sea cucumber, Dezhou roast chicken & scallion pancakes",
    mapBrandZh: "景芝",
    flagshipIndex: 2,
  },
  anhui: {
    localTitle: "Fierce Hometown Loyalty",
    localTitleZh: "徽酒主场·古井口子",
    localStory:
      "Few provinces defend local distilleries harder than Anhui: Bozhou’s Gujing Gu 16/20, Huaibei’s mixed-aroma Kouzijiao, and Dabie Mountain Yingjia dominate every banquet.",
    localPairing: "Stinky mandarin fish (臭鳜鱼) & Huizhou braised bamboo shoots",
    mapBrandZh: "古井",
  },
  jiangsu: {
    localTitle: "Cotton-Soft Ladder of Blues",
    localTitleZh: "苏酒绵柔·蓝白梯队",
    localStory:
      "Jianghuai tables speak fluent bottle hierarchy — Sea Blue, Sky Blue, Dream Blue M6+, and Huai’an’s Guoyuan Sikou — prized for plush, smooth toasting.",
    localPairing: "Yangzhou lion’s head meatballs, salted duck & hairy crab",
    mapBrandZh: "洋河",
    flagshipIndex: 1,
  },
  jiangxi: {
    localTitle: "Whole-Rice Te Aroma",
    localTitleZh: "赣鄱整粒大米特香",
    localStory:
      "In Zhangshu, Site distills whole-grain rice with flour qu into a style found nowhere else in China — deeply beloved across Jiangxi family tables.",
    localPairing: "Nanchang claypot soup, chili-fried rice noodles & Poyang Lake fish",
    mapBrandZh: "四特",
  },
  fujian: {
    localTitle: "Wuyi Mountain Sauce Pocket",
    localTitleZh: "闽北山水酱香",
    localStory:
      "While coastal Fujian leans toward tea, beer, and red wine, northern Jian’ou’s Fumao brings humid mountain-valley sauce aroma to festive hometown tables.",
    localPairing: "Buddha Jumps Over the Wall, roast goose & razor clams",
    mapBrandZh: "福矛",
  },
  taiwan: {
    localTitle: "Island-Cellared Kaoliang",
    localTitleZh: "离岛坑道高粱清香",
    localStory:
      "Granite military tunnels on Kinmen and Matsu age crisp 58% pure-sorghum kaoliang into a collector obsession — often served ice-cold straight from the freezer.",
    localPairing: "Mullet roe (乌鱼子), three-cup chicken & oyster omelet",
    mapBrandZh: "金门",
  },
  shanxi: {
    localTitle: "Birthplace of Light Aroma",
    localTitleZh: "杏花村清香祖庭",
    localStory:
      "Fifteen centuries of Xinghuacun heritage. Locals drink ¥55 Yellow-Cap Fenjiu on weeknights and pour porcelain Qinghua 20/30 when guests arrive.",
    localPairing: "Aged-vinegar braised pork, Pingyao beef & knife-cut noodles",
    mapBrandZh: "汾酒",
  },
  hebei: {
    localTitle: "High-Proof Northern Grit",
    localTitleZh: "燕赵烈酒·六十七度",
    localStory:
      "Hengshui Laobaigan’s dry, crystal-clear 67% fire is legendary across North China — respected for leaving a clean head despite its fearless proof.",
    localPairing: "Baoding donkey burger, braised lamb & cold cucumber salad",
    mapBrandZh: "衡水",
    flagshipIndex: 3,
  },
  beijing: {
    localTitle: "Hutong Erguotou Capital",
    localTitleZh: "京味二锅头·烟火气",
    localStory:
      "No pretension allowed: green-bottle 56% Red Star and white-bottle Niulanshan anchor Beijing’s plastic-stool skewer stalls, copper hotpots, and neighborhood reunions.",
    localPairing: "Copper-pot mutton hotpot, roast duck & charcoal lamb skewers",
    mapBrandZh: "红星",
  },
  tianjin: {
    localTitle: "Bohai Port Comfort Pours",
    localTitleZh: "津门海河老味",
    localStory:
      "Ninghe’s Lutaichun and local Jinjiu pair effortlessly with Tianjin’s savory coastal snacks and famously quick-witted dinner-table banter.",
    localPairing: "Braised Yellow River carp, spiced crab & crispy fried dough twists",
    mapBrandZh: "芦台春",
  },
  neimenggu: {
    localTitle: "Steppe Hospitality & Bowls",
    localTitleZh: "草原豪饮·河套王",
    localStory:
      "Warm, generous northern pouring rooted in the Yellow River bend — Hetaowang and Mengguwang turn freezing steppe nights into boisterous feasts.",
    localPairing: "Hand-pulled boiled mutton, roasted lamb ribs & salty milk tea",
    mapBrandZh: "河套王",
  },
  shaanxi: {
    localTitle: "Beeswax-Vat Feng Aroma",
    localTitleZh: "秦地酒海凤香",
    localStory:
      "Aged in woven-rattan vats lined with beeswax and linen (酒海), Xifeng gives Xi’an tables an unmistakable honeyed almond snap no outsider can fake.",
    localPairing: "Lamb paomo, cumin roujiamo & oil-splashed biangbiang noodles",
    mapBrandZh: "西凤",
  },
  gansu: {
    localTitle: "Hexi Corridor Oasis Spirit",
    localTitleZh: "陇上丝路老窖",
    localStory:
      "From snowmelt-fed Jinhui in Longnan to nine-grain Binhe in Zhangye, Gansu drinkers prize sturdy, warming strong aroma built for dry plateau evenings.",
    localPairing: "Hand-grabbed Lanzhou lamb, braised beef & fermented-grain dishes",
    mapBrandZh: "金徽",
    flagshipIndex: 2,
  },
  qinghai: {
    localTitle: "Highland Barley Purity",
    localTitleZh: "青藏高原青稞清香",
    localStory:
      "Distilled in Huzhu from Tibetan plateau highland barley (青稞) and glacier water — light, floral, and distinct from sorghum-based lowland baijiu.",
    localPairing: "Yak-meat hotpot, roasted barley & Qinghai spiced lamb ribs",
    mapBrandZh: "天佑德",
    flagshipIndex: 1,
  },
  xinjiang: {
    localTitle: "Moutai Beyond the Great Wall",
    localTitleZh: "塞外茅台·伊力特",
    localStory:
      "Brewed with Tianshan snowmelt in the Ili River Valley, Yilite is the proud badge of Xinjiang hospitality — poured freely beside sizzling cumin skewers.",
    localPairing: "Charcoal lamb skewers, big-plate chicken & fresh naan",
    mapBrandZh: "伊力特",
  },
  heilongjiang: {
    localTitle: "Black-Soil Northern Fire",
    localTitleZh: "黑土烈酒·北国豪情",
    localStory:
      "Sub-zero winters built a fearless drinking culture: Qiqihar’s sauce-aroma Beidacang (“Northern Moutai”) and everyday favorite Laocunzhang rule Harbin tables.",
    localPairing: "Iron-pot stewed pork with sauerkraut, guobaorou & red sausage",
    mapBrandZh: "北大仓",
    flagshipIndex: 1,
  },
  jilin: {
    localTitle: "Songliao Grain Heritage",
    localTitleZh: "关东粮仓老烧锅",
    localStory:
      "Fertile corn and sorghum country producing rich, sweet northeastern cellar pours like Yushuqian and Changbai-mountain sauce spirit Daquanyuan.",
    localPairing: "Pickled-cabbage blood sausage stew & charcoal skewers",
    mapBrandZh: "榆树钱",
  },
  liaoning: {
    localTitle: "Shenyang’s Four-Century Kettle",
    localTitleZh: "奉天老龙口·辽东酒脉",
    localStory:
      "Dating back to the early Qing era in Shenyang, Laolongkou and Dandong’s Fengcheng Laojiao anchor Liaoning family dinners and winter banquets.",
    localPairing: "Braised pork trotters, grilled clams & Shenyang spiced skewers",
    mapBrandZh: "老龙口",
    flagshipIndex: 1,
  },
  guangdong: {
    localTitle: "Zero-Ganbei Cantonese Silk",
    localTitleZh: "岭南豉香·慢酌不劝酒",
    localStory:
      "No forced bottoms-up here. Foshan’s Shiwan Yuk Bing Siu rests rice spirit with pork fat in clay jars, dropping to a velvety 30% vol made for food.",
    localPairing: "Cantonese roast goose, char siu & claypot rice",
    mapBrandZh: "玉冰烧",
  },
  guangxi: {
    localTitle: "Karst-Cave Rice Aroma",
    localTitleZh: "桂林山水米香三花",
    localStory:
      "Guilin Sanhua ages pure rice spirit inside cool limestone karst caves for a jasmine-clean nose — while Hechi’s Danquan leads Guangxi’s sauce revival.",
    localPairing: "Guilin rice noodles, beer-braised Li River fish & lemon duck",
    mapBrandZh: "三花",
  },
};

