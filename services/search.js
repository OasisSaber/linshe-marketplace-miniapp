const { listItems, CANONICAL_CATEGORIES } = require("./items");

const SORTS = ["relevance", "price_asc", "latest"];

function queryItems(options) {
  const config = options || {};
  const keyword = String(config.keyword || "").trim().toLowerCase();
  const category = config.category || "全部";
  const sortBy = SORTS.includes(config.sortBy) ? config.sortBy : "relevance";
  const meetupOnly = Boolean(config.meetupOnly);

  let items = listItems().filter((item) => item.status !== "sold");

  if (keyword) {
    items = items.filter((item) => {
      return item.title.toLowerCase().includes(keyword)
        || item.campus_location.toLowerCase().includes(keyword);
    });
  }

  if (category !== "全部" && CANONICAL_CATEGORIES.includes(category)) {
    items = items.filter((item) => item.category === category);
  }

  if (meetupOnly) {
    items = items.filter((item) => item.supports_meetup);
  }

  if (sortBy === "price_asc") {
    items = [...items].sort((a, b) => a.price - b.price);
  }

  if (sortBy === "latest") {
    items = [...items].sort((a, b) => {
      return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0);
    });
  }

  return items;
}

module.exports = {
  SORTS,
  queryItems
};
