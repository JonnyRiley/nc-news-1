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
  it("Takes an array of an object containing the created_at key and returns a new array with the correct format!", () => {
    const expectedDate = [{ created_at: 1164458163389 }];
    const resultDate = [{ created_at: new Date(1164458163389) }];
    expect(formatDates(expectedDate)).to.eql(resultDate);
  });
  it("Takes multiple objects within an array and returns a new array in the correct format", () => {
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
      }
    ];
    expect(formatDates(expectedDate)).to.deep.equal(resultDate);
  });
  it("Does not mutate any given data input into the function", () => {
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
  it("Returns an empty object when given an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("When given 1 article_id, it will produce a reference obj with one key and one value", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input, "title", "article_id")).to.deep.equal({ A: 1 });
  });
  it("When given multiple article_id values, it will produce a reference obj with more than one key and one value", () => {
    const input = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    expect(makeRefObj(input, "article_id", "title")).to.deep.equal({
      A: 1,
      B: 2
    });
  });
  it("Does not mutate the input the data", () => {
    const input = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    const inputCopy = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    makeRefObj(input);
    expect(input).to.deep.equal(inputCopy);
  });
});

describe("formatComments", () => {
  it("Returns a new array object when given an array of on object", () => {
    expect(formatComments([], {})).to.deep.equal([]);
  });
  it("Returns a new array of one object that has been renamed and reassigned the new keys and values corresponding to the README", () => {
    const articleRef = {
      "They're not exactly dogs, are they?": 1
    };

    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(formatComments(input, articleRef)).to.eql(output);
  });
  it("Returns a new array of multiple objects that have been renamed and reassigned the new keys and values corresponding to the README", () => {
    const articleRef = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2
    };

    const input = [
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
      }
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 2,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    expect(formatComments(input, articleRef)).to.eql(output);
  });
  it("Does not mutate the data that has benn input into the function", () => {
    const input = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    const inputCopy = [
      { article_id: "A", title: 1 },
      { article_id: "B", title: 2 }
    ];
    makeRefObj(input);
    expect(input).to.deep.equal(inputCopy);
  });
});
