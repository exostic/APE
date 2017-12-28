const mqtt = require('mqtt');
//const mqtt = require("async-mqtt");
const mqttPattern = require("mqtt-pattern");
const EventEmitter = require('events');
const conf = require('../config/config');

let client = mqtt.connect(conf.MQTTClient.url, conf.MQTTClient.options);

const outTopic = conf.MQTTClient.outTopic;
const inTopic = conf.MQTTClient.inTopic;

let params;

let mqttPatternExtract = function(topic) {
    var pattern = "APE/+module/+id/#data";
    params = MQTTPattern.extract(pattern, topic);
    console.log("Topic extrait : [ " + params[id].join(', ') + " ]");
    return params;
}

var requestQueue = {};

class MQTTClient extends EventEmitter {

    constructor() {

      super();
      console.log('Connect');

      this.client = mqtt.connect(conf.MQTTClient.url, conf.MQTTClient.options);

      this.client.on('connect', () => {
          this.emit('connected');
          console.log(`Connected to MQTT broker @ ${conf.MQTTClient.options.host}:${conf.MQTTClient.options.port}`);
          this.client.subscribe(outTopic);
      });

      this.client.on('message', (topic, message) => {
          this.emit('message', topic, message);

          mqttPatternExtract(topic);
          console.log('params', params);

          const obj = message.toString(); 
          console.log('obj', obj);

          if(requestQueue[JSON.parse(message.toString()).Id]){
            requestQueue[JSON.parse(message.toString()).Id]();
          }

          switch (params.module) {

              case 'Activity':
                  console.log('Activity', message.toString())
                  break;
              
              case 'Engine':
                  console.log('Engine')
                  break;

              case 'Service':
                  console.log('Service', message.toString())
                  break;

              default:
                   console.log('unknown MQTT message :', message.toString());
          };
      });

      this.subscribe(inTopic);
     
    }

    publish(topic, message, callback) {
      console.log('publish', topic);
      if(typeof callback === 'function') {
        message.Id = parseInt(Math.random()*100000000,10);
        requestQueue[message.Id] = callback.bind(this,message);
        this.client.publish(topic, JSON.stringify(message));    
      }
      else {
        this.client.publish(topic, message); 
      }

    }

    subscribe(topic) {
        this.client.subscribe(topic);
    }

}

    //mqtt.publish(topic, message, {
    //    retain: true,
    //    qos: 0
    //});

module.exports = new MQTTClient();

