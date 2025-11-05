// Filters list of objects whose nested arrays contain null values
function cleanMessageArray(data, field1, field2) {
  if (!Array.isArray(data)) {
    return data;
  }

  return data
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        if (item.messages && Array.isArray(item.messages)) {
          item.messages = cleanMessageArray(item.messages, field1, field2);
        }

        if (item[field1] === null || item[field2] === null) {
          return null;
        }
      }
      return item;
    })
    .filter((item) => item !== null);
}

// Filters selected conversation messages that have null values for current user
function cleanSelectedConversation(selectedConversation) {
  const filtered = {
    ...selectedConversation,
    messages: selectedConversation.messages.filter(
      (message) => message.recipientId !== null && message.senderId !== null,
    ),
  };
  return filtered;
}

module.exports = { cleanMessageArray, cleanSelectedConversation };
