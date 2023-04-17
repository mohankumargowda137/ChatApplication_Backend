function getConversedUsersQuery(userData) {
  const query = `
  select * from 
  (
    select conversation_id,user1 as user,authenticated_users.photourl,last_conversed_date as last_message 
    from (
      SELECT conversation_id,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[0]')) as user1,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[1]')) as user2,last_conversed_date  
      FROM conversation
      WHERE JSON_CONTAINS(JSON_EXTRACT(participants, '$.participants[*]'),'\"${userData.userId}\"')
    ) as user_conversation,authenticated_users 
    where user1 != '${userData.userId}' and user_conversation.user1=authenticated_users.user_id
    union 
    select conversation_id,user2 as user,authenticated_users.photourl,last_conversed_date as last_message
    from (
      SELECT conversation_id,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[0]')) as user1,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[1]')) as user2 , last_conversed_date
      FROM conversation
      WHERE JSON_CONTAINS(JSON_EXTRACT(participants, '$.participants[*]'),'\"${userData.userId}\"')
    ) as user_conversation , authenticated_users
    where user2 != '${userData.userId}' and user_conversation.user2=authenticated_users.user_id
    ) as all_user_conversation
    order by last_message desc
    `;
  return query;
}

function getUncoversedUsersQuery(userData) {
  const query = `
  select user_id,name,email,photourl from authenticated_users
  where authenticated_users.user_id not in
  (
    select user1 as user_id
    from (
      SELECT JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[0]')) as user1,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[1]')) as user2 
      FROM conversation
      WHERE JSON_CONTAINS(JSON_EXTRACT(participants, '$.participants[*]'),'\"${userData.userId}\"')
    ) as user_conversation
    where user1 != '${userData.userId}'
    union 
    select user2 as user
    from (
      SELECT JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[0]')) as user1,JSON_UNQUOTE(JSON_EXTRACT(participants, '$.participants[1]')) as user2 
      FROM conversation
      WHERE JSON_CONTAINS(JSON_EXTRACT(participants, '$.participants[*]'),'\"${userData.userId}\"')
    ) as user_conversation 
    where user2 != '${userData.userId}'
    )
    and authenticated_users.user_id!='${userData.userId}'
    `;
  return query;
}

function createConversationQuery(conversationData) {
  return `INSERT INTO conversation (participants) VALUES ('{"participants":["${conversationData.user1}","${conversationData.user2}"]}')`;
}

function checkConversationQuery(conversationData) {
  return `SELECT conversation_id FROM conversation
WHERE JSON_EXTRACT(participants,'$.participants[*]')=JSON_ARRAY("${conversationData.user1}","${conversationData.user2}")
OR JSON_EXTRACT(participants,'$.participants[*]')=JSON_ARRAY("${conversationData.user2}","${conversationData.user1}")`;
}
module.exports = {
  getConversedUsersQuery,
  getUncoversedUsersQuery,
  createConversationQuery,
  checkConversationQuery
};
