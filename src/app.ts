import GmailMessage = GoogleAppsScript.Gmail.GmailMessage;

const searchQuery = 'subject: 【slack_mailer_gas】'; // メール検索する際の検索クエリ

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = () => {
  const query = `${searchQuery} is:unread`;
  const threads = GmailApp.search(query, 0, 10);
  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      markRead(message); // 処理済み
    });
  });
};

/**
 * 既読にすることで、次回以降の処理対象から省く
 */
const markRead = (message: GmailMessage) => {
  message.markRead();
};
