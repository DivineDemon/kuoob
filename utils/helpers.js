const extractURL = (url) => {
  if (typeof url === "object") {
    return url.images;
  }

  let imageURL = "";
  const parsedData = JSON.parse(url);

  if (Array.isArray(parsedData) && parsedData.length > 0) {
    imageURL = parsedData[0]["image:loc"];
    return imageURL;
  } else {
    imageURL = parsedData[0].images;
    return imageURL;
  }
};

module.exports = {
  extractURL,
};
