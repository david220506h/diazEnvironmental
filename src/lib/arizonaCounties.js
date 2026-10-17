export const arizonaCounties = [
  "Apache",
  "Cochise",
  "Coconino",
  "Gila",
  "Graham",
  "Greenlee",
  "La Paz",
  "Maricopa",
  "Mohave",
  "Navajo",
  "Pima",
  "Pinal",
  "Santa Cruz",
  "Yavapai",
  "Yuma",
];

export const arizonaCountyOptions = (language) => [
  ...arizonaCounties.map((county) => ({ value: county, label: county })),
  { value: "other", label: language === "es" ? "Otro" : "Other" },
];
