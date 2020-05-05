class Tags {
  constructor(tagPattern: number) {
    this.tagPattern = tagPattern;
    this.counts = {};
  }

  tagPattern: number;
  counts: {};
}

export default Tags;