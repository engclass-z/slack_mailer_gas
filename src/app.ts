import GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

const searchQuery = 'subject: 【slack_mailer_gas】'; // メール検索する際の検索クエリ
const slackOAuthToken = 'xxxx';
const channelId = 'xxxx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = () => {
  const query = `${searchQuery} is:unread`;
  const threads = GmailApp.search(query, 0, 10);
  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      postToSlack(message.getId(), message.getFrom(), message.getSubject(), message.getPlainBody()); // slack 送信

      markRead(message); // 処理済み
    });
  });
};

const postToSlack = (id: string, from: string, subject: string, body: string) => {
  const slackApp = SlackApp.create(slackOAuthToken);
  const message = `
  id: ${id}
  from: ${from}
  subject: ${subject}
  
  body: 
  ${body}`;
  slackApp.postMessage(channelId, message);
};

/**
 * 既読にすることで、次回以降の処理対象から省く
 */
const markRead = (message: GmailMessage) => {
  message.markRead();
};

/**
 * 以下 SlackApp の定義
 */
declare const SlackApp: SlackApp;

interface SlackAppAPI {
  postMessage(channelId: string, message: string): void;
}

interface SlackApp {
  create(token: string): SlackAppAPI;
}
