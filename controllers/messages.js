const sendMessage = async (req, res) => {
  try {
    const response = await fetch(
      "https://kuoob.com/wp-json/hivepress/v1/messages_resource/message_send_action",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    let data = await response.json();

    if (data.data.status === 404) {
      return res.status(data.data.status).json({
        success: false,
        message: data.message,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Successfully Sent Message!",
        data,
      });
    }
  } catch (error) {
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
