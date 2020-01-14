const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Takes an empty array and returns an empty array!", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("Takes an array of multiple objects and returns a new array!", () => {
    const expectedDate = [{ created_at: 1164458163389 }];
    const resultDate = [{ created_at: new Date(1164458163389) }];
    expect(formatDates(expectedDate)).to.eql(resultDate);
  });
  it("Takes multipe objects within an array and returns a new array", () => {
    const expectedDate = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const resultDate = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: new Date(1448282163389)
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ];
    expect(formatDates(expectedDate)).to.deep.equal(resultDate);
  });
  it("Doesnt mutate a given array when given an array", () => {
    const input = [
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ];
    const inputCopy = [
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: new Date(1416746163389)
      }
    ];
    expect(formatDates(input)).to.eql(inputCopy);
  });
});

describe("makeRefObj", () => {
  it.only("Returns an empty object when given an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it.only("When given 1 article_id, it will produce a ref obj with one key and one value", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input, "title", "article_id")).to.deep.equal({ A: 1 });
  });
  it.only("When given multiple article_id values, it will produce a ref obj with more than one key and one value", () => {
    const input = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    expect(makeRefObj(input, "article_id", "title")).to.deep.equal({
      A: 1,
      B: 2
    });
  });
  it.only("Does not mutate the input the data", () => {
    const input = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    const inputCopy = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    console.log(input);
    makeRefObj(input);
    expect(input).to.deep.equal(inputCopy);
  });
});

describe("formatComments", () => {});
