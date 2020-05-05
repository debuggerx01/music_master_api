import { getRandomInt, shuffle } from "./utility";
import { redis } from "./redis";
import Tags from "../models/tags";

const tagList = [
  // 0
  "电音",
  // 1
  "儿歌",
  // 2
  "常识",
  // 3
  "古典",
  // 4
  "国粹",
  // 5
  "经典",
  // 6
  "乐理",
  // 7
  "乐器",
  // 8
  "流行",
  // 9
  "欧美",
  // 10
  "摇滚",
  // 11
  "民谣",
  // 12
  "日韩",
  // 13
  "神曲",
  // 14
  "说唱",
  // 15
  "影视",
  // 16
  "正旋律",
];

const tagPatterns = [
  [tagList.indexOf("流行"), tagList.indexOf("经典"), tagList.indexOf("电音")],
  [tagList.indexOf("摇滚"), tagList.indexOf("民谣"), tagList.indexOf("正旋律")],
  [tagList.indexOf("电音"), tagList.indexOf("神曲"), tagList.indexOf("欧美")],
  [tagList.indexOf("古典"), tagList.indexOf("流行"), tagList.indexOf("影视")],
];

const randomTags = [
  tagList.indexOf("儿歌"),
  tagList.indexOf("常识"),
  tagList.indexOf("国粹"),
  tagList.indexOf("乐理"),
  tagList.indexOf("乐器"),
  tagList.indexOf("日韩"),
];

const tagIndex = (name: string) => {
  return tagList.indexOf(name);
};

const getRandomQuestions = async (cid) => {
  const tagPatternIndex = getRandomInt(0, tagPatterns.length - 1);
  await redis.set(`mm:processing:${cid}:tags`, JSON.stringify(new Tags(tagPatternIndex)));
  const pattern = tagPatterns[tagPatternIndex];
  let count = 4;
  let accept;
  const results = [];
  let ids;
  for (const tid of pattern) {
    accept = 0;
    do {
      ids = await redis.srandmember(`mm:questions:tag${tid}`, count - accept);
      for (const id of ids) {
        if (!results.includes(id)) {
          results.push(id);
          accept++;
        }
      }
    } while (count != accept);
    count--;
  }
  do {
    const randomTagIndex = randomTags[getRandomInt(0, randomTags.length - 1)];
    const id = (await redis.srandmember(`mm:questions:tag${randomTagIndex}`, 1))[0];
    if (!results.includes(id)) {
      results.push(id);
    }
  } while (results.length < 10);
  return shuffle(results);
};


// 全部答对和答对题数小于等于3题时不会进入判断
const buildMasterTag = (tags: Tags) => {
  let analysisList = [];
  let max = 0;
  for (const tag in tags.counts) {
    analysisList.push({
      tag,
      count: tags.counts[tag],
    });
    max = Math.max(max, tags.counts[tag]);
  }
  // 按照次数降序排列的tag数组
  analysisList = analysisList.sort((a, b) => b.count - a.count);
  if (max <= 1) {
    // 全部tag次数小于等于1，音痴型
    return "音痴型";
  }

  // 只有一种tag且次数大于1，或者第一多的tag次数比第二名多，返回第一名的tag名
  if (!analysisList[1] || analysisList[0].count >= 5 || analysisList[0].count > analysisList[1].count) {
    return `${analysisList[0].tag}/${max}`;
  } else {
    // 前几名tag的次数相同，1 < max < 5，取tagPattern中对应的tag
    const tagIndex = tagPatterns[tags.tagPattern][4 - max];
    return `${tagList[tagIndex]}/${max}`;
  }
};

export { tagList, tagIndex, getRandomQuestions, buildMasterTag };