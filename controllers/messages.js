const sendMessage = async (req, res) => {
  // Converting req.body into FormData
  const formData = new FormData();
  for (const key in req.body) {
    formData.append(key, req.body[key]);
  }

  try {
    const response = await fetch(
      "https://kuoob.com/wp-json/hivepress/v1/messages/",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      // Handle non-OK responses (e.g., 404, 500, etc.)
      const errorData = await response.text();
      console.log("Error Data: ", errorData);
      return res.status(response.status).json({
        success: false,
        message: "Error sending the message",
        errorData,
      });
    }

    // Handle successful response
    const responseData = await response.json();
    console.log("Data: ", responseData);

    return res.status(201).json({
      success: true,
      message: "Successfully Sent Message!",
      data: responseData,
    });
  } catch (error) {
    console.log("Fetch Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Please Try Again!",
      error: error.message,
    });
  }
};


module.exports = {
  sendMessage,
};
