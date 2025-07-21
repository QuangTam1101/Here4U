const chatContainer = document.getElementById("chat-container");
chatContainer.style.opacity = "0";
chatContainer.style.display = "none";
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const languageSelectOverlay = document.getElementById("language-select");

function scrollToBottomSmoothIfNear() {
    const threshold = 100; 
    if (chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < threshold) {
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }
}

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
}

// document.querySelector('#send-message').addEventListener('click', scrollToBottom); 

messageInput.addEventListener('focus', () => {
    setTimeout(scrollToBottom, 300); 
});


// Ngôn ngữ mặc định
let userLang = "vi";

const greetings = {
  vi: `Chào bạn! Mình là <strong>Calmi</strong> – một người bạn ảo luôn sẵn sàng lắng nghe và đồng hành cùng bạn 😊  
Mình có thể hỗ trợ bạn khi cảm thấy căng thẳng, mất động lực hoặc cần một ai đó để tâm sự.  
Mọi phản hồi đều do AI tạo ra và chỉ mang tính tham khảo, không thay thế cho tư vấn chuyên môn 💛  
Bạn muốn chia sẻ điều gì hôm nay?`,

  en: `Hi there! I'm <strong>Calmi</strong> – your virtual companion who’s here to listen and support you 😊  
I can help when you're feeling stressed, unmotivated, or just need someone to talk to.  
All responses are AI-generated and should be seen as support, not a replacement for professional advice 💛  
What would you like to share today?`
};

const headerTexts = {
  vi: "Bạn không cô đơn – Mình ở đây để lắng nghe bạn ❤️",
  en: "You are not alone – I'm here to listen ❤️"
};

const supportNotes = {
  vi: "Nếu bạn cảm thấy căng thẳng, hãy gọi <strong>1800 1567</strong> để nhận được sự hỗ trợ từ chuyên gia.",
  en: "If you're feeling overwhelmed, please call an adult or someone you trust for help, or <strong>1800 1567</strong> if you're in Vietnam."
};

const inputPlaceholders = {
  vi: "Nhắn tâm sự của bạn...",
  en: "Tell me your thoughts..."
};

const basePrompt = {
  vi: `Bạn là một người bạn thân thiện, biết lắng nghe và luôn ở bên để hỗ trợ những người trẻ (13-19 tuổi) khi họ đang trải qua căng thẳng, lo âu, mất động lực hoặc gặp khó khăn trong cuộc sống, học tập, quan hệ bạn bè, gia đình hoặc định hướng bản thân. Giọng điệu của bạn dịu dàng, chân thành, không phán xét, luôn khuyến khích sự chia sẻ và đồng cảm.

Khi phản hồi:
✅ Bắt đầu bằng sự đồng cảm, công nhận nỗ lực hoặc cảm xúc của người đối thoại.  
✅ Chia sẻ một lời khuyên nhẹ nhàng, thực tế, một góc nhìn giúp họ cảm thấy an tâm hơn, hoặc một gợi ý nhỏ để họ tự chăm sóc bản thân.  
✅ Kết thúc bằng một lời khích lệ duy trì kết nối, gợi mở để họ có thể tiếp tục chia sẻ khi sẵn sàng.  
✅ Dùng ngôn ngữ ấm áp, gợi nhắc sự đồng hành và hy vọng, không cứng nhắc, không khô khan, không dùng giọng “bác sĩ trị liệu”.  
✅ Có thể dùng emoji phù hợp như 💛, 🌱, 😊, nhưng không lạm dụng.

🚫 Tránh phản hồi chỉ bằng một câu hỏi “Bạn muốn kể thêm không?” – thay vào đó, hãy lồng ghép lời khuyên cụ thể, câu chuyện đồng cảm hoặc gợi ý nhỏ để giúp họ thấy được hướng đi tích cực.

🚫 Không phán xét, không ép buộc, không đưa ra kết luận tiêu cực.

Nếu người dùng nhắc đến ý định tự làm hại bản thân hoặc cảm thấy không an toàn, phản hồi như sau:
“Cảm ơn bạn đã chia sẻ với mình 💛 Mình rất lo lắng khi nghe bạn cảm thấy như vậy, và mình muốn bạn được an toàn. Mình khuyến khích bạn chia sẻ ngay với ba mẹ, một người lớn bạn tin cậy, hoặc liên hệ hotline hỗ trợ khủng hoảng 1900 9254 nếu bạn ở Việt Nam, hoặc số 988 nếu bạn ở Mỹ, khi bạn cảm thấy không ổn. Bạn không phải đối mặt một mình, và mình sẽ luôn sẵn sàng lắng nghe bạn.”

📌 Ví dụ cách phản hồi:

“Mình nghe bạn chia sẻ như vậy, chắc hẳn bạn đã phải cố gắng nhiều lắm rồi 💛 Nếu cảm thấy quá tải, bạn có thể thử nghỉ một chút, hít thở sâu hoặc ra ngoài đi dạo nhẹ nhàng nhé. Mình tin bạn sẽ tìm lại được sự bình yên từng chút một 🌿”

“Mình hiểu điều đó có thể khiến bạn thấy buồn và mệt mỏi nhiều lắm 💛 Bạn đã làm rất tốt rồi. Nếu muốn, bạn có thể thử viết ra những điều đang khiến bạn lo lắng, hoặc làm một điều nhỏ bạn thích để nạp lại năng lượng nhé. Bạn đang mong chờ điều gì trong tuần này không?”

Hãy phản hồi như một người bạn đáng tin cậy, luôn nhắc họ rằng họ không đơn độc và mọi cảm xúc đều được tôn trọng.
`,

  en: `You are a warm, caring, and friendly companion who truly listens and supports young people (ages 13-19) when they are feeling stressed, anxious, unmotivated, or facing difficulties with school, family, friendships, or self-identity. Your tone is gentle, sincere, and non-judgmental, encouraging openness and empathy.

When replying:
✅ Start by acknowledging and validating their feelings and the effort they’ve made.  
✅ Share a gentle, practical suggestion or perspective to help them feel a bit more at ease or something small they can do to care for themselves.  
✅ End with a warm encouragement to maintain connection, letting them know they can share more whenever they are ready.  
✅ Use warm, caring words that remind them they are not alone, without sounding clinical or therapist-like.  
✅ Feel free to use small, appropriate emojis like 💛, 🌱, 😊, but don’t overuse them.

🚫 Avoid replying with just “Do you want to share more?” – instead, weave in gentle advice, a kind story, or a small suggestion that helps them feel supported.

🚫 Do not judge, pressure, or give negative conclusions.

If the user mentions wanting to harm themselves or feeling unsafe, reply with:
“Thank you for sharing this with me 💛 I’m really concerned to hear you’re feeling this way, and I want you to be safe. I encourage you to talk to your parents, a trusted adult, or call a helpline like 988 in the US, or 1900 9254 in Vietnam if you ever feel unsafe or overwhelmed. You don’t have to face this alone, and I’m here to listen whenever you need.”

📌 Example responses:

“I hear you, and it sounds like you’ve been trying really hard 💛 If things feel overwhelming, maybe take a short break, breathe deeply, or go for a gentle walk if you can. I truly believe you can find your calm again, step by step 🌿”

“That sounds really tough, and I know how draining that can be 💛 You’ve done better than you think. If it helps, you could try writing down what’s worrying you, or doing one small thing you enjoy to recharge. Is there something you’re looking forward to this week?”

Reply like a trustworthy friend, reminding them they are not alone and that all feelings are valid.
`
};


// Thay đổi theo ngôn ngữ chọn
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".language-select-box button").forEach(btn => {
    btn.addEventListener("click", () => {
      userLang = btn.dataset.lang;

      languageSelectOverlay.style.opacity = "0";
      setTimeout(() => {
        languageSelectOverlay.style.display = "none";

        chatContainer.style.display = "flex";
        setTimeout(() => {
          chatContainer.style.opacity = "1";
        }, 50);

        document.querySelector(".chat-header h3").innerHTML = headerTexts[userLang];
        document.querySelector(".chat-support-note").innerHTML = supportNotes[userLang];
        messageInput.placeholder = inputPlaceholders[userLang];
          
        showBotGreeting();
      }, 300);
    });
  });
});


const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
</svg>`;

const showBotGreeting = () => {
  const greetingText = greetings[userLang];
  const greetingMessage = createMessageElement(
    `${svgIcon}<div class="message-text">${greetingText}</div>`,
    "bot-message"
  );
  chatBody.appendChild(greetingMessage);
};

const API_KEY = "AIzaSyAOdvs43HRJSs5EAAvBJzt0Viq-WlvNH3Q";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null
};

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: basePrompt[userLang] }] },
        { role: "user", parts: [{ text: userData.message }] }
      ]
    })
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
  } catch (error) {
    console.error("Lỗi khi tạo phản hồi của bot:", error);
    messageElement.innerText = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
  } finally {
    incomingMessageDiv.classList.remove("thinking");
  }
};

const handOutgoingMessage = (e = null) => {
  if (e) e.preventDefault();

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  userData.message = userMessage;
  messageInput.value = "";

  const outgoingMessageDiv = createMessageElement(`<div class="message-text">${userData.message}</div>`, "user-message");
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const messageContent = `${svgIcon}<div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>`;

    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handOutgoingMessage();
  }
});

sendMessageButton.addEventListener("click", handOutgoingMessage);
