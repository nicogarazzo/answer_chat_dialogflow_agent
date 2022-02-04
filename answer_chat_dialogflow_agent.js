const VoximplantKit = require('voximplant-kit-sdk').default
const axios = require('axios')
const dialogflow = require('@google-cloud/dialogflow')
const uuid = require('uuid')
// kit.incomingMessage.current_request.id
async function runSample(projectId = 'bank-basicbot-001-umqq', text, session_id) {
  // A unique identifier for the given session
  const sessionId = (session_id == true?uuid.v4():session_id);
  const credentials = {
  client_email: 'vox002@bank-basicbot-001-umqq.iam.gserviceaccount.com',
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8Ly39FojMk068\nkm1tMH34z1E6jR+B/LU7CuNytjpKzs4eV2spvkoi5IDTWLWQ26nFSuKGuQ32G1xe\nmQ01LYihCfaDmiL7M4N+X6ips+6jLyFb8iLLut9SSx00/d2lWY8oXyfqltH+VNgq\n3iIpib8NmpDilM5XIjP4BD7JmKFeD7wBZcyl23EGZXVht+x/YNZt6FFBofnmFt2n\nKqlJVeBFYeu2el22jXvO+ytK+8BKeWQJQ2d7wZVdQzLedmtdvRWe4cxCR8ps8QiS\nEDAhQ46dFiTGYshgbhTeQvOnF1UfhVPGmPwuTg98zSYQDitANB73NDjwHJVlltn4\nm8qcHpHpAgMBAAECggEAThQHMTyBytuNrhjU9RpLEgo2iiQWgBDRQuuMHkK0Yeh3\nRciAioPM77g+KTJjtvQk9tpQrZQnUkbc5tT60WcQirx+/vBbdj1T4AGhkbO5nhRG\nc4c936ir0tGejyeLqHjFuHrurVshSrR6MiMTKoff8K2CUrhp+mYTCOL+CBffUA5g\n+7Ds5PrqnT8K5bu4hQEV1G8G3DOPFOtsQ6UmQxo3A6e4vFNdhgnIHSttjSOFUoMH\nZbIDJ5/C/9vNqV8FvdASCuJI3LaCBlaKAHIssecE5zxdN9RrEsn3gxYk0ZJIRc2I\nXgSxNjrMJqMC96la0Zt3JYwBGoV7TkrQTzbvaLThHwKBgQD0wUlKoobT1iIk83Ja\nXYNFGF1xuug1NeOt/LOqkgL9kzVSgGwEaURVnIBWLff76BUDccssi2bVTDVzmy4K\n+wScBbWuk/d8rV2wETbFmyQlBbR4ZTP/bWS7n5l2Zzz6Kx56oksSOYkUzDMX2Ozx\nBSHNa4T+80zZ+WDFYGlrXU0VWwKBgQDE1IfGBWJ8Vs4myXKHQ/4puaGupc3q9sb5\n/fNXMXJlPKEe4XbGAnzbqVI+XBZ+S9cvkTNHQIWBiHK6pK0W2oZG8phHeQqy03pH\n00cwtR08G0Kej8xjWAmASXzNoVKMs4IM50Sr0xL5/TP4i7fIbktXTXh+IYX2/d6o\nw03tgBGlCwKBgQDTSgj7ZVL/jNvtCjytxgyMmXwRskjDpsHmcUCo/2OVhH+DuVmG\ndVmIjpI703NBBBkf4ByFV9JuUFvUcSJOWGSiTEuLajE8cG1wkWu3KzcIvuQNC1DY\nMJfFYQIaNQVu8cpeE7y6/vBYA/AXpizl5IhJzYgCkAbIJYBk49Yd2W2yAQKBgAPB\nEf3i6Gf6t9/hg7+0ukpNchoEq5LJti3afCOzm7z2lRQjtMI+FeeSqTDrTLqH88jC\nejnnryQzWAzbSzneXSVJR0JFusCCbBimnPr+2VnmIzUnBPz4FuZNgIXjh9GLMvXQ\nC21Dj18ZRz58W7sE74bwwVWWihmV6gNKBlh7UtrVAoGAA7a9sF9R9g9gq1zR54ZD\nnQ8UpqZs/Wqu/jfqvczYW/hx0m+HWe7mv97GxG615cxga+De4VD1blf/08Qycc5w\nown/cM2PFVQ8iA8PjnA8Pp+aREjlek4ALLgtbsGgqu2NbCHbEhRZRSmGosrINUbf\ncwkTErEFrjQn7miObjwQzWM=\n-----END PRIVATE KEY-----\n"
};
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({projectId, credentials});
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result
}
module.exports = async function(context, callback) {
  var kit = new VoximplantKit(context)
  var result
  console.log('start', new Date())
  // await kit.loadDatabases()
  // check if we have dialogflow session_id for the current request
  console.log(kit.incomingMessage.conversation.current_request)
  // let session_id = kit.dbGet(kit.incomingMessage.conversation.current_request.id)
  session_id = "session-" + kit.incomingMessage.conversation.current_request.id.toString()
  console.log('Session id: ' + session_id)
  if (session_id == null) result = await runSample('bank-basicbot-001-umqq',  kit.incomingMessage.text, true)
  else result = await runSample('bank-basicbot-001-umqq',  kit.incomingMessage.text, session_id)
  //console.log(result)
  if (result.diagnosticInfo && result.diagnosticInfo.fields && result.diagnosticInfo.fields.end_conversation) {
      console.log('FINISH!')
      if (result.intent.displayName == 'to-operator') {
          console.log('transferToQueue')
          kit.transferToQueue({ queue_name: 'TadHack' })
          callback(200, kit.getResponseBody())
      } else {
          kit.finishRequest()
      }
  } else {
    kit.replyMessage.text = result.fulfillmentText
    // Формируем текст ответного сообщения, используя имя написавшего клиента
    // kit.replyMessage.text = 'Добрый день, ' +  kit.incomingMessage.client_data.client_display_name + '!' 123
    // Возвращаем ответное сообщение
    console.log('end', new Date())
    callback(200, kit.getResponseBody())
  }
}
