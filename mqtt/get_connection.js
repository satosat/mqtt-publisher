const awscrt = require("aws-crt");
const iot = awscrt.iot;
const mqtt = awscrt.mqtt;
require("dotenv").config();

/**
 * Configure and return a new mqtt connection
 */

function get_connection() {
  let config_builder =
    iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
      process.env.CERT,
      process.env.PRIVATE_KEY
    );

  config_builder.with_certificate_authority_from_path(
    undefined,
    process.env.ROOT_CA
  );

  config_builder.with_clean_session(false);

  config_builder.with_client_id("sdk-nodejs-v2-client-app");

  config_builder.with_endpoint(process.env.ENDPOINT);

  const config = config_builder.build();

  const client = new mqtt.MqttClient();
  return client.new_connection(config);
}

exports.get_connection = get_connection;
