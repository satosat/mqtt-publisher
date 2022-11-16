const iotsdk = require("aws-iot-device-sdk-v2");
const mqtt = iotsdk.mqtt;
const { get_connection } = require("./get_connection");
const { exit } = require("process");

async function publish(topic, payload, qos, retain) {
  const connection = get_connection();

  await connection.connect().catch((error) => {
    console.log(`Connect error: ${error}`);
    exit(-1);
  });

  try {
    switch (qos) {
      case "least":
        connection.publish(topic, payload, mqtt.QoS.AtLeastOnce, retain);
        break;
      case "most":
        connection.publish(topic, payload, mqtt.QoS.AtMostOnce, retain);
        break;
      case "exact":
        connection.publish(topic, payload, mqtt.QoS.ExactlyOnce, retain);
        break;
      default:
        return { error: true, message: "Illegal access" };
    }
  } catch (error) {
    console.log("Error message: " + error);
    return { error: true, message: error };
  }

  return null;
}

exports.publish = publish;
